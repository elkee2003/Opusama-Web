import React, { useState, useEffect } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import './Response.css'; 
import { useNavigate, useParams} from "react-router-dom";
import { useAuthContext } from '../../../../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from "aws-amplify/datastore";
import { CommunityReply } from '../../../../../../../../models';

const Response = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const { dbUser } = useAuthContext(); 
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCommentSubmit = async () => {
        if (!comment.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        try {
            setLoading(true);

            await DataStore.save(
                new CommunityReply({
                    comment: comment.trim(),
                    commenterID: dbUser.id, 
                    communitydiscussionID: postId,  
                })
            );

            setComment('');
            alert("Comment added successfully!");
            navigate(-1); 
        } catch (error) {
            console.error("Error saving comment:", error);
            alert("Failed to post comment.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="responseCon">

        <div 
            className='responseBckCon'
            onClick={()=>navigate(-1)}
        >
            <IoIosArrowRoundBack className='responseBckIcon'/>
        </div>

        <div 
            className='responseCommentCon'
            onClick={handleCommentSubmit}
        >
            <p>Comment</p>
        </div>

        <div className="commentCon">
            <textarea
                className="commentTxtBox"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write comment..."
            />
        </div>

    </div>
  );
};

export default Response;