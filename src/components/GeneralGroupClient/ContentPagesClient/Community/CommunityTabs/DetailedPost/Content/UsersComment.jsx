import React, { useState, useEffect } from 'react';
import { useNavigate} from "react-router-dom";
import { formatDistanceStrict } from "date-fns";
import { DataStore } from "aws-amplify/datastore";

const UsersComment = ({replies}) => {
    const navigate = useNavigate();
    const [readMore, setReadMore] = useState(false);

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
                        ? formatDistanceStrict(new Date(reply.createdAt), new Date(), { unit: "minute" })
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
                {/* Border */}
                <div className='commentBorder'/>
            </div>
        ))} 
    </div>
  );
};

export default UsersComment;