import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import Content from './Content/Content';
import ProfileHead from './Content/ProfileHead/ProfileHead';
import { formatDistanceStrict } from "date-fns";
import { DataStore } from "aws-amplify/datastore";
import { CommunityDiscussion, CommunityReply, CommunityLike, Realtor, User } from '../../../../../models';


function UserProfile() {
    const { userId } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                setLoading(true);

                // Fetch posts created by this user
                const userPosts = await DataStore.query(
                    CommunityDiscussion,
                    p => p.instigatorID.eq(userId)
                );

                // Map through posts and add comment & like counts
                const postsWithStats = await Promise.all(
                    userPosts.map(async (post) => {
                        // Get instigator details (could be Realtor or User)
                        const instigator =
                            (await DataStore.query(Realtor, post.instigatorID)) ||
                            (await DataStore.query(User, post.instigatorID));

                        // Count comments
                        const comments = await DataStore.query(
                            CommunityReply,
                            c => c.communitydiscussionID.eq(post.id)
                        );

                        // Count likes
                        const likes = await DataStore.query(
                            CommunityLike,
                            l => l.communitydiscussionID.eq(post.id)
                        );

                        return {
                            ...post,
                            instigatorName: instigator?.firstName || "Unknown",
                            instigatorUsername: instigator?.username || "unknown",
                            instigatorProfilePic: instigator?.profilePic || null,
                            isVerified: instigator?.isVerified || false, 
                            numComments: comments.length,
                            totalLikes: likes.length,
                            formattedTime: post.createdAt
                                ? formatDistanceStrict(new Date(post.createdAt), new Date(), { addSuffix: true })
                                : "Just now"
                        };
                    })
                );

                // ✅ Sort posts newest → oldest
                const sortedPosts = postsWithStats.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setPosts(sortedPosts);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user posts:", err);
                setLoading(false);
            }
        };

        if (userId) fetchUserPosts();
    }, [userId]);
  return (
    <div>
      {loading ? (
            <div className="communLoading-container">
            <div className="communSpinner" />
            <h2>Loading...</h2>
            </div>
        ) : posts.length > 0 ? (
            <div className='userProfileCon'>
                {/* Show profile head once */}
                <ProfileHead post={posts[0]} />

                {/* Show all posts without repeating profile head */}
                {posts.map (post => (        
                    <Content key={post.id} post={post} />
                ))}
            </div>
        ) : (
            <p style={{textAlign:'center'}}>No posts found for this user</p>
        )}
    </div>
  )
}

export default UserProfile;
