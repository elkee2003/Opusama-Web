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

    useEffect(()=>{
        if(authUser){
            if(!dbUser){
                alert(
                    'Kindly fill in your data to access pages. Thank you.'
                );
                navigate('/clientcontent/profile')
            }
        };
        
    },[dbUser])

    // Alternative to for loop
    const fetchRealtorsAndPosts = async () => {
            try {
            setLoading(true);

            // Step 1: Query all realtors
            const realtors = await DataStore.query(Realtor);

            // Step 2: Fetch all posts without any filtering
            const posts = await DataStore.query(Post);

            // Step 3: Map realtor details to each post
            const allPosts = posts.map((post) => {
                const realtor = realtors.find((r) => r.id === post.realtorID);
                return {
                ...post,
                realtorId: realtor?.id,
                firstName: realtor?.firstName,
                lastName: realtor?.lastName,
                email: realtor?.email,
                profilepic: realtor?.profilePic,
                phoneNumber: realtor?.phoneNumber,
                };
            });

            // Sort posts by createdAt or updatedAt
            const sortedPosts = allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setRealtorPosts(sortedPosts);
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

    const handleRefreshExplore = () => {
        setRefreshing(true); // Start the refreshing spinner
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

        {realtorPosts && realtorPosts.length > 0 ? (
            <div>
                {realtorPosts.map((post) => (
                    <ExplorePostFeed key={post.id} post={post} />
                ))}
            </div>
        ) : (
            <div className='noListngsCon'>
                <p className="noListings">No listings</p>
            </div>
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
