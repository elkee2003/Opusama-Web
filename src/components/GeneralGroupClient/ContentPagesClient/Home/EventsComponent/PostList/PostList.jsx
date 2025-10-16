import React, {useState, useEffect} from 'react';
import PostFeed from '../Post/Post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { DataStore } from 'aws-amplify/datastore'
import {Realtor, Post} from '../../../../../../models'


function PostList() {
    const navigate = useNavigate();
    const [realtorPosts, setRealtorPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    // helper function: get expiry date (1 day after event date)
    const nextDay = (dateString) => {
        const d = new Date(dateString);
        d.setDate(d.getDate() + 1);
        return d;
    };


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
                    // p.isApproved.eq(true)
                ]));
                // filter + auto-expire logic
                const filteredPosts = await Promise.all(
                    posts.map(async (post) => {
                        if (post.propertyType === 'Event') {
                            const now = new Date();
                            let expiryDate = null;

                            if (post.eventFrequency === 'one-time' && post.eventDateTime) {
                                expiryDate = nextDay(post.eventDateTime);
                            } 
                            else if (post.eventFrequency === 'multi-day' && post.eventEndDateTime) {
                                expiryDate = nextDay(post.eventEndDateTime);
                            } 
                            else if (post.eventFrequency === 'recurring') {
                                // recurring events should never expire automatically
                                expiryDate = null;
                            }

                            // if expiryDate is set and already passed, expire the post
                            if (expiryDate && now > expiryDate && post.available === true) {
                                await DataStore.save(
                                Post.copyOf(post, (updated) => {
                                    updated.available = false;
                                })
                                );
                                return null;
                            }
                        }

                        return post.propertyType === 'Event'
                        ? {
                            ...post,
                            realtorId: realtor.id,
                            firstName: realtor.firstName,
                            lastName: realtor.lastName,
                            email: realtor.email,
                            profilepic: realtor.profilePic,
                            phoneNumber: realtor.phoneNumber,
                            }
                        : null;
                    })
                );
                // filter out null (expired or not event)
                return filteredPosts.filter(Boolean);
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
                onClick={()=>navigate(`/clientcontent/search_events`)}
            >
                <FontAwesomeIcon icon={faSearch} size="2x" />
                <span className="homeSearchBtnTxt">Search for Events</span>
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
                <p className="noListings">No Events listings</p>
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
