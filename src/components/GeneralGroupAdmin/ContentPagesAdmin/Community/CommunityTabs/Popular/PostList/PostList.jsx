import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../CommunityTabs.css';
import { useAuthContext } from '../../../../../../../../Providers/ClientProvider/AuthProvider'; 
import Post from '../Post/Post';
import Select from 'react-select';
import { DataStore } from "aws-amplify/datastore";
import { CommunityDiscussion, CommunityReply, CommunityLike, Realtor, User } from '../../../../../../../models';

function PostList() {

    const [isFocus, setIsFocus] = useState(false);
    const {dbUser, authUser} = useAuthContext()
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [category, setCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const categoryData = [
        { label: 'Display All', value: '' },
        { label: 'Experience & Review', value: 'Experience & Review' },
        { label: 'Food, Fun & Nightlife', value: 'Food, Fun & Nightlife' },
        { label: 'Safety & Scam Alerts', value: 'Safety & Scam Alerts' },
        { label: 'City Life & Questions', value: 'City Life & Questions' },
        // { label: 'Neigbourhood Insights', value: 'Neigbourhood Insights' },
        // { label: 'House Hunting Tips', value: 'House Hunting Tips' },
        // { label: 'Recreation & Nightlife', value : 'Recreation & Nightlife' },
        // { label: 'Food & Drinks', value: 'Food & Drinks' },
        // { label: 'Scam Alerts', value: 'Scam Alerts' },
        // { label: 'Moving & Relocation Tips', value: 'Moving & Relocation Tips' },
        // { label: 'Experiences & Reviews', value: 'Experiences & Reviews'},
        // { label: 'General Real Estate Discussion', value: 'General Real Estate Discussion' },
    ];

    // useEffect to complete profile
    useEffect(()=>{
        if(authUser){
            if(!dbUser){
                alert(
                    'Kindly fill in your data to access pages. Thank you.'
                );
                navigate('/clientcontent/profile')
            }
        };
        
    },[dbUser]);

    const fetchInstigatorAndPost = async () => {
    
        try {
            setLoading(true);
    
            // Step 1: Query all instigators
            const realtors = await DataStore.query(Realtor);

            const users = await DataStore.query(User);
            
            // Fetch discussions with category filtering from database
            const discussions = await DataStore.query(CommunityDiscussion, (d) =>
                category ? d.category.eq(category) : d
            );
    
            // Step 2: Use map and Promise.all to fetch posts for each instigator
            const enhancedPosts = await Promise.all(
                discussions.map(async (post) => {
                    const instigator = realtors.find((r) => r.id === post.instigatorID) || users.find((u) => u.id === post.instigatorID);
    
                    // Fetch all replies related to this post
                    const replies = await DataStore.query(CommunityReply, (r) => r.communitydiscussionID.eq(post.id));
    
                    // Fetch all likes related to this post
                    const likes = await DataStore.query(CommunityLike, (l) => l.communitydiscussionID.eq(post.id));
    
                    // Count only replies where `comment` is not empty or null
                    const numComments = replies.filter(reply => reply.comment && reply.comment.trim() !== "").length;
    
                    // Calculate the total number of likes for a post
                    const totalLikes = likes.filter(like => like.like === true).length;
    
                    // Fetch commenter details for each reply
                    const repliesWithCommenters = await Promise.all(
                        replies.map(async (reply) => {
                            const commenter = realtors.find((r) => r.id === reply.commenterID) || users.find((u) => u.id === reply.commenterID);
                            return {
                                ...reply,
                                commenterName: commenter ? commenter.firstName : "Unknown",
                                commenterUsername: commenter?.username || "unknown",
                                commenterProfilePic: commenter ? commenter.profilePic : null,
                            };
                        })
                    );
    
                    // Fetch User details with each like
                    const likesWithUsers = await Promise.all(
                        likes.map(async (like) => {
                            const liker = realtors.find((r) => r.id === like.likedByID) || users.find((u) => u.id === like.likedByID);
                            return {
                                ...like,
                                likerName: liker ? liker.firstName : "Unknown",
                                likerUsername: liker?.username || "unknown",
                                likerProfilePic: liker ? liker.profilePic : null
                            };
                        })
                    );
    
                    return {
                        ...post,
                        creatorOfPostID: instigator?.id,
                        instigatorName: instigator ? instigator.firstName : 'Unknown',
                        instigatorUsername: instigator?.username || "unknown",
                        numComments,
                        totalLikes,
                        likes: likesWithUsers,
                        replies: repliesWithCommenters
                    };
                })
            );
    
            setPosts(enhancedPosts.sort((a, b) => (b.numComments + b.totalLikes) - (a.numComments + a.totalLikes)));
    
        } catch (error) {
            console.error('Error fetching posts', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // UseEffect to update
    useEffect(()=>{
        fetchInstigatorAndPost();

        // Observe CommunityDiscussion for any changes
        const discussionSubscription = DataStore.observe(CommunityDiscussion).subscribe(({ opType, element }) => {
            if (opType === "INSERT" || opType === "UPDATE" || opType === "DELETE") {
                fetchInstigatorAndPost();
            }
        });

        // Observe CommunityReply for any changes
        const replySubscription = DataStore.observe(CommunityReply).subscribe(({ opType, element }) => {
            if (posts.some(post => post.id === element.communitydiscussionID)) {
                fetchInstigatorAndPost();
            }
        });

        // Observe CommunityLike for any changes
        const likeSubscription = DataStore.observe(CommunityLike).subscribe(({ opType, element }) => {
            if (posts.some(post => post.id === element.communitydiscussionID)) {
                fetchInstigatorAndPost();
            }
        });

        return () => {
            discussionSubscription.unsubscribe();
            replySubscription.unsubscribe();
            likeSubscription.unsubscribe();
        };
    },[category]);

    // Search filtering
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredPosts(posts); // Reset to full post list if search is empty
            return;
        }
        
        const lowerSearchQuery = searchQuery.toLowerCase();
        const filteredResults = posts.filter(post =>
            post.title.toLowerCase().includes(lowerSearchQuery) ||
            post.content.toLowerCase().includes(lowerSearchQuery) ||
            post.instigatorName.toLowerCase().includes(lowerSearchQuery) || 
            post.instigatorUsername.toLowerCase().includes(lowerSearchQuery)
        );

        setFilteredPosts(filteredResults);
    }, [searchQuery, posts]);

    // function to deletepost by dbUser
    const handlePostDelete = (postId) => {
        setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
    };

    // function to refresh post
    const handleRefreshPost = () => {
        setRefreshing(true);
        fetchInstigatorAndPost();
    };

  return (
    <div className='communPostListCon' >

        {/* Drop Down */}
        <Select
            className={'communityCategorySelect'}
            options={categoryData}
            placeholder="Select Category"
            value={categoryData.find((option) => option.value === category)}
            onChange={(selectedOption) => setCategory(selectedOption.value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
        />

        {/* Search Input */}
        <input
            className="communitySearchInput"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading ? (
        <div className="communLoading-container">
            <div className="communSpinner" />
            <h2>Loading...</h2>
        </div>
        ) : (filteredPosts.length > 0 ? (
        <div>
            {filteredPosts.map(post => (
            <Post 
                key={post.id} 
                post={post}
                onDelete={handlePostDelete}
            />
            ))}
        </div>
        ) : (
        <div>
            <p>No result found</p>
        </div>
        )
        )}

        {/* Refresh Btn */}
        <div className='refreshCommunCon'>
            <button onClick={handleRefreshPost} className='refreshCommunBtn'>
                {refreshing ? "Refreshing..." : "Refresh"}
            </button>
        </div>

    </div>
  )
}

export default PostList;
