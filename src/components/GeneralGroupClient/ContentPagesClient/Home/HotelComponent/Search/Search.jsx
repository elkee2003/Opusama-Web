import React, { useState, useEffect } from 'react';
// import './Search.css';
import SearchResults from './SearchResults';
import { DataStore } from 'aws-amplify/datastore';
import { Realtor, Post } from '../../../../../../models';
import '../../TabStyles/Search.css';

const HotelSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [hotelPosts, setHotelPosts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = () => {
    if (!hotelPosts || hotelPosts.length === 0) {
      return;
    }

    const minPriceParsed = parseFloat(minPrice) || 0;
    const maxPriceParsed = parseFloat(maxPrice) || Infinity;

    const lowercasedQuery = searchQuery.toLowerCase();

    const filtered = hotelPosts.filter((item) => {
      const matchesQuery =
        item?.realtorFirstName?.toLowerCase().includes(lowercasedQuery) ||
        item?.userName?.toLowerCase().includes(lowercasedQuery) ||
        item?.type?.toLowerCase().includes(lowercasedQuery) ||
        item?.generalLocation?.toLowerCase().includes(lowercasedQuery) ||
        item?.city?.toLowerCase().includes(lowercasedQuery) ||
        item?.state?.toLowerCase().includes(lowercasedQuery) ||
        item?.country?.toLowerCase().includes(lowercasedQuery);

      const matchesPrice = item?.price >= minPriceParsed && item?.price <= maxPriceParsed;

      return matchesQuery && matchesPrice;
    });

    setFilteredData(filtered);
  };

  const fetchRealtorsAndPosts = async () => {
    try {
      const realtors = await DataStore.query(Realtor);
      const posts = await DataStore.query(Post);

      const filteredPosts = posts.filter((post) => post.propertyType === 'Hotel / Shortlet');

      const hotelPostData = filteredPosts.map((post) => {
        const realtor = realtors.find((r) => r.id === post.realtorID);
        return {
          ...post,
          realtorFirstName: realtor?.firstName,
          userName: realtor?.username,
          price: parseFloat(post.price) || 0,
        };
      });

      setHotelPosts(hotelPostData);
      setFilteredData(hotelPostData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, minPrice, maxPrice, hotelPosts]);

  useEffect(() => {
    fetchRealtorsAndPosts();
  }, []);

  return (
    <div className="searchContainer">
      <input
        className="searchInputt"
        placeholder="Search Hotel / Shortlet"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="priceInputRow">
        <input
          className="priceInput"
          placeholder="Min Price"
          value={minPrice}
          type="number"
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          className="priceInput"
          placeholder="Max Price"
          value={maxPrice}
          type="number"
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {filteredData.length > 0 ? (
        <ul className="searchResultsList">
          {filteredData.map((item) => (
            <SearchResults key={item.id} post={item} />
          ))}
        </ul>
      ) : (
        <p className="searchNoResultText">No results found</p>
      )}
    </div>
  );
};

export default HotelSearch;