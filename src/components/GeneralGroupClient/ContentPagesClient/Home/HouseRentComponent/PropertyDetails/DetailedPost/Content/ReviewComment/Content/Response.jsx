import React, { useState, useEffect } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import '../../../../../../TabStyles/DetailResponse.css';
import { useNavigate, useParams} from "react-router-dom";
import { useAuthContext } from '../../../../../../../../../../../Providers/ClientProvider/AuthProvider'; 
import { useProfileContext } from '../../../../../../../../../../../Providers/ClientProvider/ProfileProvider';
import { useBookingShowingContext } from '../../../../../../../../../../../Providers/ClientProvider/BookingShowingProvider';
import { DataStore } from "aws-amplify/datastore";
import { PostComment, Notification } from '../../../../../../../../../../models'; 

const Response = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const { dbUser } = useAuthContext(); 
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const {realtorID, setRealtorID} = useProfileContext();
    const {propertyDetails} = useBookingShowingContext();

    const handleCommentSubmit = async () => {
        if (!comment.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        try {
            setLoading(true);

            const postComment = await DataStore.save(
                new PostComment({
                    comment: comment.trim(),
                    commenterID: dbUser.id, 
                    realtorID,
                    postID: postId,  
                })
            );

            await DataStore.save(
                new Notification({
                    creatorID: dbUser?.id,
                    recipientID:realtorID,
                    recipientType: 'COMMENT_REALTOR_POST',
                    type: "COMMENT",
                    entityID: postId,
                    message: `Someone made a comment on your listing (${propertyDetails?.propertyType} - ${propertyDetails?.type})`,
                    read: false,
                })
            );

            setComment('');
            // setRealtorID(null);
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
    <div className="detailResponseCon">

        <div 
            className='detailResponseBckCon'
            onClick={()=>navigate(-1)}
        >
            <IoIosArrowRoundBack className='detailResponseBckIcon'/>
        </div>

        <div 
            className='detailResponseCommentCon'
            onClick={handleCommentSubmit}
        >
            <p>Comment</p>
        </div>

        <div className="detailCommentCon">
            <textarea
                className="detailCommentTxtBox"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write comment..."
            />
        </div>

    </div>
  );
};

export default Response;