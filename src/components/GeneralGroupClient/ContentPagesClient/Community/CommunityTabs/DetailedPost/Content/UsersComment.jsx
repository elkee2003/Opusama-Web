import React, { useState, useEffect } from 'react';
import { useNavigate} from "react-router-dom";
import { DataStore } from "aws-amplify/datastore";

const UsersComment = () => {
    const navigate = useNavigate();
    const [readMore, setReadMore] = useState(false);

    // delete later

    const post = {
        comment: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugiat, ullam. Reprehenderit repudiandae, provident omnis assumenda dolore maiores excepturi exercitationem commodi aperiam rem. Atque, magnam at error dolores qui praesentium nobis reprehenderit explicabo quas? Reprehenderit, repudiandae? Quis, praesentium corrupti neque exercitationem nisi error eveniet omnis non debitis, vitae quibusdam sunt ut, sapiente ab rem sed officiis. Est inventore voluptatum totam id? Ipsa est unde optio inventore numquam veritatis voluptate aspernatur magni!'
      }

  return (
    <div className='detCommentsCon'>
        <p className='detCommentsHeader'>Comments:</p>

        <div className='detCommentUserTimeCon'>
            <p className='detCommentUsername'>Juicy</p>
            <p className='detCommentTime'>2h</p>
        </div>
        <p className='detComment'>
            {readMore || post.comment.length <= 250
            ? post.comment
            : `${post.comment.substring(0, 250)}...`}
            
            {post.comment.length > 250 && (
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
  );
};

export default UsersComment;