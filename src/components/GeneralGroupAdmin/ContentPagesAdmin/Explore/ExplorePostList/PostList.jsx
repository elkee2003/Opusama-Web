import React, {useState, useEffect} from 'react';
import { useAuthContext } from '../../../../../../Providers/ClientProvider/AuthProvider';
import ExplorePostFeed from '../ExplorePost/Post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { DataStore } from 'aws-amplify/datastore'
import {Realtor, Post} from '../../../../../models'

function PostList() {
    const navigate = useNavigate();
    const {dbUser, authUser} = useAuthContext()
    const [realtorPosts, setRealtorPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // For search
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [propPosts, setPropPosts] = useState([]);
    const [filteredData, setFilteredData] = useState([]);


    const handleSearch = () => {
        if (!propPosts || propPosts.length === 0) {
            return;
        }

        const minPriceParsed = parseFloat(minPrice) || 0;
        const maxPriceParsed = parseFloat(maxPrice) || Infinity;

        const lowercasedQuery = searchQuery.toLowerCase();

        const filtered = propPosts.filter((item) => {
            const matchesQuery =
            item?.firstName?.toLowerCase().includes(lowercasedQuery) ||
            item?.userName?.toLowerCase().includes(lowercasedQuery) ||
            item?.eventName?.toLowerCase().includes(lowercasedQuery) ||
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

    useEffect(()=>{
        if(authUser){
            if(!dbUser){
                alert(
                    'Kindly fill in your data to access pages. Thank you.'
                );
                navigate('/admin/profile')
            }else if (!dbUser.username) {
                alert('Please fill in your username to proceed.');
                navigate('/admin/editprofile');
            }
        };
        
    },[dbUser])

    // Alternative to for loop
    const fetchRealtorsAndPosts = async () => {
            try {
            setLoading(true);

            // Step 1: Query all realtors
            const realtors = await DataStore.query(Realtor);

            // Step 2: Fetch all posts that are available and approved
            const posts = await DataStore.query(Post, (p) => p.and ((p) =>[
                p.available.eq(true),
                p.isApproved.eq(true)
            ]));

            // Step 3: Map realtor details to each post
            const allPosts = posts.map((post) => {
                const realtor = realtors.find((r) => r.id === post.realtorID);
                return {
                ...post,
                realtorId: realtor?.id,
                firstName: realtor?.firstName,
                userName: realtor?.username,
                lastName: realtor?.lastName,
                email: realtor?.email,
                profilepic: realtor?.profilePic,
                phoneNumber: realtor?.phoneNumber,
                };
            });

            // Sort posts by createdAt or updatedAt
            const sortedPosts = allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setRealtorPosts(sortedPosts);
            setPropPosts(sortedPosts);
        } catch (error) {
            console.error('Error fetching realtors and posts', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [searchQuery, minPrice, maxPrice, propPosts]);

    

    useEffect(()=>{
        fetchRealtorsAndPosts();

        const subscription = DataStore.observe(Post).subscribe(({opType})=>{
        if(opType === "UPDATE"){
            fetchRealtorsAndPosts();
        }
        });

        return () => subscription.unsubscribe();
    },[])

    // Function to Restore Scroll Position When Returning
    // useEffect(() => {
    //     const scrollPosition = sessionStorage.getItem("scrollPosition");
        
    //     if (scrollPosition) {
    //         setTimeout(() => {
    //             window.scrollTo(0, parseInt(scrollPosition, 10));
    //         }, 100); 
    //     }
    // }, []);

    // Refresh Function
    const handleRefreshExplore = () => {
        // sessionStorage.removeItem("scrollPosition");
        setRefreshing(true); 
        fetchRealtorsAndPosts();
    };

  return (
    <div className='postListContainer' >

        {/* Search Bar */}
        {/* <div>
            <button 
                className="searchBtn"
                onClick={()=>navigate('/searchhouse')}
            >
                <FontAwesomeIcon icon={faSearch} size="lg" />
                <span className="searchBtnTxt">Search</span>
            </button>
        </div> */}

        {/* Search logic */}
        <input
            className="searchInputt"
            placeholder="Search..."
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

        {(searchQuery || minPrice || maxPrice) ? (
            filteredData.length > 0 ? (
                <div>
                    {filteredData.map((post) => (
                        <ExplorePostFeed key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className='noListngsCon'>
                    <p className="noListings">No matching listings</p>
                </div>
            )
        ) : (
            realtorPosts.length > 0 ? (
                <div>
                    {realtorPosts.map((post) => (
                        <ExplorePostFeed key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className='noListngsCon'>
                    <p className="noListings">No listings</p>
                </div>
            )
        )}
        
        {refreshing && (
            <div className="loading-container">
                <div className="spinner" />
                <h2>Loading...</h2>
            </div>
        )}

        <div className='refreshBtnPListCon'>
            <button onClick={handleRefreshExplore} className='refreshBtnPList'>
                {refreshing ? "Refreshing..." : "Refresh"}
            </button>
        </div>
    </div>
  )
}

export default PostList;
