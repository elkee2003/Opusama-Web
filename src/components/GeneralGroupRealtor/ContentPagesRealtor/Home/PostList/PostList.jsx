import React, {useState, useEffect} from 'react';
import './PostList.css';
import { useAuthContext } from '../../../../../../Providers/ClientProvider/AuthProvider';
import PostFeed from '../Post/Post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { DataStore } from 'aws-amplify/datastore'
import { Post } from '../../../../../models'

function PostList() {
    const navigate = useNavigate();
    const {dbRealtor, authUser} = useAuthContext()
    
    const [myPostList, setMyPostList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(()=>{
        if(authUser){
            if(!dbRealtor){
                alert(
                    'Kindly fill in your data to access pages. Thank you.'
                );
                navigate('/realtorcontent/profile')
            }
        };
        
    },[dbRealtor])

    // fetch posts
    const fetchMyPosts = async () => {
        setLoading(true);
        try {
        const myPosts = await DataStore.query(Post, (p) => p.realtorID.eq(dbRealtor.id));
        const sortedPosts = myPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMyPostList(sortedPosts);
        } catch (e) {
        alert('Error fetching posts: ' + e.message);
        } finally {
        setLoading(false);
        setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    
        const subscription = DataStore.observe(Post).subscribe(({ opType }) => {
          if (opType === 'INSERT' || opType === 'UPDATE' || opType === 'DELETE') {
            fetchMyPosts();
          }
        });
    
        return () => subscription.unsubscribe();
    }, []);
    

    const handleRefresh = () => {
        setRefreshing(true);
        fetchMyPosts();
    };

  return (
    <div className='exploreContainer' >

        <div 
            className='realtorLogoForSmallScreen'  
        >
            <img 
                src={'/opusama.png'}
                alt="logo" 
                onClick={() => navigate('/')}
            />
        </div>


        {myPostList && myPostList.length > 0 ? (
            <div >
                {myPostList.map((post) => (
                    <PostFeed key={post.id} post={post} />
                ))}
            </div>
        ) : (
            <div className='realtorNoListngsCon'>
                <p className="realtorNoListings">You have not made any posts yet.</p>
            </div>
        )}
        {refreshing && (
            <div className="loading-container">
                <div className="spinner" />
                <h2>Loading...</h2>
            </div>
        )}

        <div className='realtorRefreshBtnCon'>
            <button onClick={handleRefresh} className='refreshButton'>
                {refreshing ? "Refreshing..." : "Refresh"}
            </button>
        </div>
    </div>
  )
}

export default PostList;