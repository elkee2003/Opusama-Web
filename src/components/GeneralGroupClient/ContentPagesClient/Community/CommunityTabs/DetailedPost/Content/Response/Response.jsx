import React, { useState, useEffect } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import './Response.css'; 
import { useNavigate, useParams} from "react-router-dom";
import { DataStore } from "aws-amplify/datastore";

const Response = () => {
    const navigate = useNavigate();
    const [comment, setComment] = useState('');

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
            onClick={()=>{console.log('comment')}}
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