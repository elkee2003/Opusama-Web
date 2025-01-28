import React, { useState, useEffect } from 'react';
// import './Search.css';
import SearchResults from './SearchResults';
import { DataStore } from 'aws-amplify/datastore';
import { Realtor, Post } from '../../../../../../models';

const HotelSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [recreationPosts, setRecreationPosts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = () => {
    if (!recreationPosts || recreationPosts.length === 0) {
      return;
    }

    const minPriceParsed = parseFloat(minPrice) || 0;
    const maxPriceParsed = parseFloat(maxPrice) || Infinity;

    const lowercasedQuery = searchQuery.toLowerCase();

    const filtered = recreationPosts.filter((item) => {
      const matchesQuery =
        item?.realtorFirstName?.toLowerCase().includes(lowercasedQuery) ||
        item?.type?.toLowerCase().includes(lowercasedQuery) ||
        item?.address?.toLowerCase().includes(lowercasedQuery) ||
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

      const filteredPosts = posts.filter((post) => post.propertyType === 'Recreation');

      const recreationPostData = filteredPosts.map((post) => {
        const realtor = realtors.find((r) => r.id === post.realtorID);
        return {
          ...post,
          realtorFirstName: realtor?.firstName,
          price: parseFloat(post.price) || 0,
        };
      });

      setRecreationPosts(recreationPostData);
      setFilteredData(recreationPostData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, minPrice, maxPrice, recreationPosts]);

  useEffect(() => {
    fetchRealtorsAndPosts();
  }, []);

  return (
    <div className="searchContainer">
      <input
        className="searchInputt"
        placeholder="Search Recreation"
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