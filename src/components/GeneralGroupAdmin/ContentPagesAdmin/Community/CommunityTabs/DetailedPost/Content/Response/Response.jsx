import React, { useState, useEffect } from 'react';
import MentionTextarea from '../../../MentionTextArea/MentionTextArea';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams, useLocation} from "react-router-dom";
import { useAuthContext } from '../../../../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from "aws-amplify/datastore";
import { CommunityReply, Notification, User, Realtor } from '../../../../../../../../models';

const Response = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { creatorOfPostID } = location.state || {};
    const { postId } = useParams();
    const { dbUser } = useAuthContext(); 
    const [comment, setComment] = useState('');
    const [mentions, setMentions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleCommentSubmit = async () => {
        if (!comment.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        try {
            setLoading(true);

            // 1. Save the comment reply
            const savedReply = await DataStore.save(
                new CommunityReply({
                    comment: comment.trim(),
                    commenterID: dbUser.id, 
                    communitydiscussionID: postId,  
                })
            );

            // 2. Notify the post creator (default)
            await DataStore.save(
                new Notification({
                    creatorID: dbUser.id,
                    recipientID:creatorOfPostID,
                    recipientType: 'POST_CREATOR_COMMENT',
                    type: "COMMENT",
                    entityID: savedReply.id,
                    message: `${dbUser.username || "Someone"} commented on your post`,
                    read: false,
                })
            );

            // 3. Mention notifications
            for (const username of new Set(mentions)) {
                const mentionedUsers = await DataStore.query(User, u => u.username.eq(username.toLowerCase()));

                const mentionedRealtors = await DataStore.query(Realtor, r => r.username.eq(username.toLowerCase()));

                const mentionedAccounts = [...mentionedUsers, ...mentionedRealtors];

                for (const acc of mentionedAccounts) {
                    if (acc.id !== dbUser.id) { // don’t notify yourself
                        await DataStore.save(
                            new Notification({
                            creatorID: dbUser.id,
                            recipientID: acc.id,
                            recipientType: "MENTION",
                            type: "MENTION",
                            entityID: savedReply.id,
                            message: `${dbUser.username || "Someone"} mentioned you in a post`,
                            read: false,
                            })
                        );
                    }
                }
            }

            alert("Comment added successfully!");

            setComment('');
            setMentions([]);

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
            <MentionTextarea
                value={comment}
                onChange={setComment}
                onMentionsChange={setMentions}
                placeholder="Write comment..."
            />
        </div>

    </div>
  );
};

export default Response;