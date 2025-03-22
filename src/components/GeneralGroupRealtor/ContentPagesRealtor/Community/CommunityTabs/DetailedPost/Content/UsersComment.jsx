import React, { useState, useEffect } from 'react';
import { useNavigate} from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { useAuthContext } from '../../../../../../../../Providers/ClientProvider/AuthProvider';
import { formatDistanceStrict } from "date-fns";
import { DataStore } from "aws-amplify/datastore";
import { CommunityReply } from '../../../../../../../models';

const UsersComment = ({ replies: initialReplies }) => {
    const navigate = useNavigate();
    const { dbRealtor } = useAuthContext();
    const [deleting, setDeleting] = useState(null);
    const [readMore, setReadMore] = useState(false);
    const [replies, setReplies] = useState(initialReplies);
    
    useEffect(() => {
        setReplies(initialReplies);  // Update when initialReplies change
    }, [initialReplies]);

    // Delete Reply Function
    const handleDelete = async (replyId) => {
        try {
            setDeleting(replyId); // Set loading state for the reply being deleted

            // Query the reply from DataStore
            const replyToDelete = await DataStore.query(CommunityReply, replyId);
            if (replyToDelete) {
                await DataStore.delete(replyToDelete);

                // Remove the deleted reply from state
                setReplies(prevReplies => prevReplies.filter(reply => reply.id !== replyId));
            }
        } catch (error) {
            console.error("Error deleting reply:", error);
        } finally {
            setDeleting(null);
        }
    };

    if (!replies || replies.length === 0) {
        return <p className="noCommentsText">No Comments</p>;
    }

  return (
    <div className='detCommentsCon'>
        <p className='detCommentsHeader'>Comments:</p>

        {replies.map(reply => (
            <div>
                <div className='detCommentUserTimeCon'>
                    <p className='detCommentUsername'>
                        {reply.commenterName}
                    </p>
                    <p className='detCommentTime'>
                        {reply.createdAt 
                        ? formatDistanceStrict(new Date(reply.createdAt), new Date(), { addSuffix: true })
                            .replace(" seconds", "s")
                            .replace(" second", "s")
                            .replace(" minutes", "m")
                            .replace(" minute", "m")
                            .replace(" hours", "h")
                            .replace(" hour", "h")
                            .replace(" days", "d")
                            .replace(" day", "d")
                            .replace(" weeks", "w")
                            .replace(" week", "w")
                            .replace(" months", "mo")
                            .replace(" month", "mo")
                            .replace(" years", "y")
                            .replace(" year", "y")
                        : "Just now"}
                        {/* {reply.createdAt ? formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true }) : "Just now"} */}
                    </p>
                </div>
                <div className='commentRow'>
                    <p className='detComment'>

                        {readMore || (reply?.comment ? reply.comment.length <= 250 : true)
                        ? (reply.comment ? reply.comment : "No comment available")
                        : `${reply.comment.substring(0, 250)}...`}

                        
                        {reply.comment && reply?.comment.length > 250 && (
                            <button
                                className={readMore ? 'readLessBtnComment' : 'readMoreBtnComment'}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setReadMore(!readMore)
                                }}
                            >
                                {readMore ? 'Show Less' : 'Read More'}
                            </button>
                        )}
                    </p>

                    {/* Show delete button only if user is the owner of the reply */}
                    {dbRealtor && dbRealtor?.id === reply.commenterID && (
                        <div 
                            className="deleteCommentCon" 
                            onClick={() => handleDelete(reply.id)}
                            disabled={deleting === reply.id} // Disable button when deleting
                        >
                            <MdDelete className='deleteCommentIcon' />
                        </div>
                    )}
                </div>
                {/* Border */}
                <div className='commentBorder'/>
            </div>
        ))} 
    </div>
  );
};

export default UsersComment;