import React, {useState, useEffect} from 'react'
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import './Favourite.css'
import { useAuthContext } from '../../../../../../../../../Providers/ClientProvider/AuthProvider';
import { PostLike, Realtor, Post} from '../../../../../../../../models';
import { DataStore } from "aws-amplify/datastore";
import { getUrl } from "aws-amplify/storage";

function Favourite() {
    const { dbUser } = useAuthContext();
    const navigate = useNavigate();
    const [favouritePosts, setFavouritePosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Alternative to for loop
    const fetchFavouritePosts = async () => {
        if (!dbUser) return;

        try {
        setLoading(true);

        // Step 1: Get all likes by the current user
        const likes = await DataStore.query(PostLike, (p) =>
            p.likedByID.eq(dbUser.id)
        );

        if (likes.length === 0) {
            setFavouritePosts([]);
            return;
        }

        // Step 2: Extract post IDs
        const likedPostIds = likes.map((like) => like.postID);

        // Step 3: Fetch all posts with these IDs
        const posts = await Promise.all(
            likedPostIds.map(async (postId) => {
                const post = await DataStore.query(Post, postId);
                if (!post) return null;

                // Step 4: Fetch the realtor for this post
                const realtor = await DataStore.query(Realtor, post.realtorID);


                // fetch signed URLs
                const mediaUris = await Promise.all(
                    (post.media || []).map(async (path) => {
                    const result = await getUrl({ path });
                    return {
                        url: result.url.toString(),
                        type: path.endsWith(".mp4") ? "video" : "image",
                    };
                    })
                );

                return {
                    ...post,
                    firstName: realtor?.firstName || "",
                    lastName: realtor?.lastName || "",
                    profilePic: realtor?.profilePic || "",
                    phoneNumber: realtor?.phoneNumber || "",
                    mediaUris,
                    liked: true
                };
            })
        );

        // Step 7: Filter null and sort
        const sortedPosts = posts
            .filter((p) => p !== null)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setFavouritePosts(sortedPosts);
        } catch (error) {
            console.error('Error fetching realtors and posts', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Toggle like
    const toggleLike = async (e, post) => {
        e.stopPropagation(); 

        try {
            // Check if the user already liked the post
            const existingLikes = await DataStore.query(
                PostLike,
                (p) => p.and(p => [
                    p.postID.eq(post.id),
                    p.likedByID.eq(dbUser.id)
                ])
            );

            if (existingLikes.length > 0) {
                // Unlike: delete the like entry
                await Promise.all(existingLikes.map(async (like) => {
                    await DataStore.delete(like);
                }));

                // Remove the unliked post from favourites
                setFavouritePosts(prev => prev.filter(p => p.id !== post.id));

            } else {
                // Like: create a new like entry
                await DataStore.save(
                    new PostLike({
                        postID: post.id,
                        likedByID: dbUser.id,
                        like: true,
                    })
                );

                // Update UI instantly
                setFavouritePosts(prev =>
                    prev.map(p => p.id === post.id ? { ...p, liked: true } : p)
                );
            } 
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    // Realtime Update
    useEffect(()=>{
        fetchFavouritePosts();

        const subscription = DataStore.observe(Post).subscribe(({opType})=>{
        if(opType === "UPDATE"){
            fetchFavouritePosts();
        }
        });

        return () => subscription.unsubscribe();
    },[])

    const handleRefresh = () => {
        // sessionStorage.removeItem("scrollPosition");
        setRefreshing(true);
        fetchFavouritePosts();
    };

  return (
    <div className='favouritePostContainer'>
        {favouritePosts.length === 0 && !loading ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
                You have no favourite
            </p>
        ) : (
            favouritePosts.map((post) => (
                <div> 
                    <div 
                        key={post.id} 
                        className={'imageContainer'}
                        onClick={() => navigate(`/clientcontent/detailedpost/${post.id}`)}
                    >
                        {post.mediaUris?.length > 0 ? (
                        post.mediaUris[0].type === 'video' ? (
                            <div className='pVideoWrapper'>
                            <video
                                className="pMedia"
                                controls
                                controlsList="nodownload"
                                onContextMenu={(e) => e.preventDefault()}
                            >
                                <source src={post.mediaUris[0].url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div 
                                className="pVideoOverlay" 
                                onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/clientcontent/detailedpost/${post.id}`);
                                }}
                            />
                            </div>
                        ) : (
                            <img 
                            src={post.mediaUris[0].url} 
                            alt="Post" 
                            className='pImage' 
                            loading="lazy"
                            />
                        )
                        ) : (
                        <div className="pImageLoading">
                            <img src={'/defaultImage.png'} alt="Default" className='pImage' />
                            <div className="spinnerOverlay" />
                        </div>
                        )}

                        {/* Like Button */}
                        <div
                        onClick={(e) => toggleLike(e, post)}
                        className='postLike'
                        >
                        {post.liked ? (
                            <GoHeartFill className='heartIcon' color="red" />
                        ) : (
                            <FaRegHeart className='heartIcon' color="white" />
                        )}
                        </div>
                    </div>

                    {/* Username */}
                    <div 
                    className={'contact'}
                    onClick={()=>navigate(`/clientcontent/realtorprofile/${post.realtorID}`)}
                    >
                        <p className={'name'}>{post?.firstName}</p>
                    </div>

                    {post.type && <p className={'bedroom'}>{post?.type}</p>}
                    {post.bed && <p className={'bedroom'}>Beds: {post?.bed} </p>}
                    {post.bedrooms && <p className={'bedroom'}>Bedroom(s): {post.bedrooms} </p>}
                    {post.generalLocation && <p className={'location'}>{post.generalLocation}</p>}

                    <p className={'description'}>
                        {post.description.length <= 150 ? post.description : `${post.description.substring(0, 150)}...`}
                    </p>

                    <div className='priceRow'>
                        <p className='price'> 
                            ₦{Number(post.price)?.toLocaleString()} {post.timeFrame && `/ ${post.timeFrame}`}
                        </p>
                    </div>
                </div>
            ))
        )}
    </div>
  )
}

export default Favourite;
