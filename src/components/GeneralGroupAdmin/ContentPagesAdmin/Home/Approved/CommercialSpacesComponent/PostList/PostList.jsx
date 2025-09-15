import React, {useState, useEffect} from 'react';
import PostFeed from '../Post/Post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { DataStore } from 'aws-amplify/datastore'
import {Realtor, Post} from '../../../../../../../models'

function PostList() {
    const navigate = useNavigate();
    const [realtorPosts, setRealtorPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Alternative to for loop
    const fetchRealtorsAndPosts = async () => {
        try {
        setLoading(true);

        // Step 1: Query all realtors
        const realtors = await DataStore.query(Realtor);

        // Step 2: Use map and Promise.all to fetch posts for each realtor in parallel
        const allPosts = await Promise.all(
            realtors.map(async (realtor) => {
            // Query posts for each realtor
            const posts = await DataStore.query(Post, (p) => p.and((p)=>[
                p.realtorID.eq(realtor.id),
                p.available.eq(true),
                p.isApproved.eq(true)
            ]));
            const filteredPosts = posts.filter((post) => post.propertyType === 'Commercial Space');

            // Map the realtor details to each post
            return filteredPosts.map((post) => ({
                ...post,
                realtorId: realtor.id,
                firstName: realtor.firstName,
                lastName: realtor.lastName,
                email: realtor.email,
                profilepic: realtor.profilePic,
                phoneNumber: realtor.phoneNumber,
            }));
            })
        );

        // Flatten the array of arrays and sort posts by createdAt or updatedAt
        const flatPosts = allPosts.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setRealtorPosts(flatPosts);
        } catch (error) {
        console.error('Error fetching realtors and posts', error);
        } finally {
        setLoading(false);
        setRefreshing(false);
        }
    };

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

    // Function to Refresh
    const handleRefresh = () => {
        // sessionStorage.removeItem("scrollPosition");
        setRefreshing(true);
        fetchRealtorsAndPosts();
    };

  return (
    <div className='postListContainer' >

        {/* Search Bar */}
        <div className="stickySearchBar">
            <button 
                className="homeSearchBtn"
                onClick={()=>navigate(`/admin/search_commercial_spaces`)}
            >
                <FontAwesomeIcon icon={faSearch} size="2x" />
                <span className="homeSearchBtnTxt">Search for Commercial Spaces</span>
            </button>
        </div>

        {realtorPosts && realtorPosts.length > 0 ? (
            <div>
                {realtorPosts.map((post) => (
                    <PostFeed key={post.id} post={post} />
                ))}
            </div>
        ) : (
            <div className='noListngsCon'>
                <p className="noListings">No Commercial Space listings</p>
            </div>
        )}
        {refreshing && (
            <div className="loading-container">
                <div className="spinner" />
                <h2>Loading...</h2>
            </div>
        )}

        {/* Refresh Button */}
        <div className='refreshBtnPListCon'>
            <button onClick={handleRefresh} className='refreshBtnPList'>
                {refreshing ? "Refreshing..." : "Refresh"}
            </button>
        </div>
    </div>
  )
}

export default PostList;
