import React, { useState, useEffect } from 'react';
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import { FaRegCommentDots } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import './Content.css'; 
import { useNavigate, useParams} from "react-router-dom";
import UsersComment from './UsersComment';
import { DataStore } from "aws-amplify/datastore";

const Content = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [readMore, setReadMore] = useState(false);

    // delete later
  const post = {
    content: 'I just moved to trans amadi, what should I expect in terms of security and amenities? Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet suscipit corporis rerum accusamus deleniti pariatur molestiae aperiam. Ipsum, ullam. Veniam asperiores ullam atque error aspernatur enim sequi! Doloremque, repudiandae placeat Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, culpa possimus, fugiat optio non eos, voluptatem eum ipsa minima error modi corporis officiis. Sapiente ab omnis impedit aperiam, dolor doloribus ea provident. Cupiditate pariatur eveniet totam itaque temporibus atque autem dicta nemo deleniti dolorum, molestias, consequuntur nostrum non sint repellendus, laborum architecto aut dolor. Officiis molestias necessitatibus molestiae eum dictafugiat optio non eos, voluptatem eum ipsa minima error modi corporis officiis. Sapiente ab omnis impedit aperiam, dolor doloribus ea provident. Cupiditate pariatur eveniet totam itaque temporibus atque autem dicta nemo deleniti dolorum, molestias, consequuntur nostrum non sint repellendus, laborum architecto aut dolor. Officiis molestias necessitatibus molestiae eum dicta!!!!',
    instigatorID: 'Lilian Tariah Ijeoma'
  }

  return (
    <div className="communityDetailedPostCon">

        {/* Category */}
        <p className='detPostCategory'>
            Neigbhourhood Insights
        </p>

        {/* Post Username and Time */}
        <div className="detPostUserTimeCon">
            <p>{post.instigatorID}</p>
            <p className='detPostTime'>3 months</p>
        </div>

        {/* Title */}
        <div className="detPostTitleCon">
          <p className='detPostTitle'>How is the Power supply in Town?</p> 
        </div>

        {/* Post Content */}
        <p className='detPostContent'>
          {readMore || post.content.length <= 750
            ? post.content
            : `${post.content.substring(0, 750)}...`}
          {post.content.length > 750 && (
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

        {/* Post Engagment */}
        <div className='detPostEngagementCon'>
            <div className="detEngagementrow">
            <FaRegCommentDots className='detEngagementIcon'/>
            <p className='detEngagementNum'>3</p>
            </div>

            <div className="detEngagementrow">
            <FaRegHeart className='detEngagementIcon'/>

            {/* This one is a filled heart it will be used to show that the dbuser like the particular post */}
            {/* <GoHeartFill className='detEngagementFilledHeart'/> */}
            <p className='detEngagementNum'>10</p>
            </div>
        </div>

        <div className='detCommentBorder'/>

        {/* Users Comments */}
        <UsersComment/>

        {/* Place holder to write comment */}
        <div 
            className="writeResCon"
            onClick={()=>navigate('/clientcontent/response_post')}
        >
            <p className='writeRes'>Write comment...</p>
        </div>


        {/* Floating Create Post Icon */}
        <div 
            className='addIconCon'
            onClick={()=>navigate('/clientcontent/create_post')}
        >
            <IoMdAdd className='addIcon'/>
        </div>
    </div>
  );
};

export default Content;