import React, { useState, useEffect } from 'react';
import { DataStore } from 'aws-amplify/datastore';
import { PostComment, User, Realtor  } from '../../../../../../../../models';
import { useAuthContext } from '../../../../../../../../../Providers/ClientProvider/AuthProvider'; 
import { useParams, useNavigate} from "react-router-dom";
import { MdDelete } from "react-icons/md";
// import '../../../../../TabStyles/ReviewsComments.css';

const UsersComment = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const {authUser, dbRealtor} = useAuthContext();
  const [usersComments, setUsersComments] = useState([]);
  const [deleting, setDeleting] = useState(null);

  // Fetch all comments
  const fetchComments = async () => {
    try {
      // Fetch Realtors and Users
      const realtors = await DataStore.query(Realtor);
      const users = await DataStore.query(User);

      // Fetch comments related to this post
      const fetchedComments = await DataStore.query(PostComment, (c) => c.postID.eq(postId));

      // Fetch commenter details for each comment
      const postWithCommenters = await Promise.all(
        fetchedComments.map(async (comment) => {
          const commenter = realtors.find((r) => r.id === comment.commenterID) || users.find((u) => u.id === comment.commenterID);
          return {
            ...comment,
            commenterName: commenter ? commenter.firstName : "Unknown",
            commenterProfilePic: commenter ? commenter.profilePic : null,
          };
        })
      );

      // Sort comments by createdAt in ascending order (oldest first)
      const sortedComments = postWithCommenters.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      setUsersComments(sortedComments);
    } catch (e) {
      console.error('Error fetching comments', e);
    }
  };

  // Delete Comment Function
  const handleDelete = async (commentId) => {
    try {
      setDeleting(commentId); // Set loading state for the comment being deleted

      // Query the comment from DataStore
      const commentToDelete = await DataStore.query(PostComment, commentId);
      if (commentToDelete) {
        await DataStore.delete(commentToDelete);

        // Remove the deleted comment from state
        setUsersComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setDeleting(null);
    }
  };


  // useEffect for fetching comments and real-time updates
  useEffect(() => {
    if (!postId) return;

    fetchComments(); // Initial fetch

    const subscription = DataStore.observe(PostComment).subscribe(({ opType, element }) => {
      if (element.postID === postId) {
        if (opType === 'INSERT' || opType === 'UPDATE' || opType === 'DELETE') {
          fetchComments();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [postId]);

  const handleNavigateToReply = () => {
    if(authUser){
      navigate(`/realtorcontent/detail_response_post/${postId}`);
    }else{
      alert('Sign In to access')
      navigate('/')
    }
  };

  return (
    <div className="reviewsContainer">
      {usersComments.length > 0 ? (
        <>
          {usersComments.map((item) => (
            <div key={item.id} className="reviewItem">
              <h4 className="reviewerName">{item.commenterName}</h4>

              <div className='reviewTxtDeltCon'>
                <p className="reviewText">{item.comment}</p>
                {/* Show delete button only if user is the owner of the comment */}
                {dbRealtor && dbRealtor.id === item.commenterID && (
                  <div
                    className="detailDeleteCommentCon"
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id} // Disable button when deleting
                  >
                    <MdDelete className='detailDeleteCommentIcon' />
                  </div>
                )}
              </div>
            </div>
          ))}

        </>
      ) : (
        <p className="noReviewsComments">No Comments Yet</p>
      )}

      <div 
            className="writeCommentCon"
            onClick={handleNavigateToReply}
        >
            <p className='writeComment'>Write comment...</p>
        </div>
    </div>
  );
};

export default UsersComment;