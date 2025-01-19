import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoPencil } from 'react-icons/io5';
import { useProfileContext } from '../../../../../../Providers/ClientProvider/ProfileProvider';
import './ReviewProfile.css'; 

const ReviewProfile = () => {
  const { firstName, lastName, profilePic, address, phoneNumber } = useProfileContext();
  const navigate = useNavigate();

  // Navigation Function
  const goToProfile = () => {
    navigate('/clientcontent/profile');
  };

  return (
    <div className="reviewProContainer">
      <h1 className="title">Review Profile</h1>

      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="bckBtnCon">
        <IoArrowBack className="bckBtnIcon" />
      </button>

      <button className="editBtn" onClick={() => navigate('/clientcontent/editprofile')}>
        <p className='editBtnTxt'>
            Edit
        </p>
      </button>

      <div className="scrollView">
        {profilePic && (
          <div className="profilePicContainer">
            <img src={profilePic} alt="Profile" className="img" />
          </div>
        )}

        <h2 className="subHeader">First Name:</h2>
        <p className="inputReview">{firstName}</p>

        <h2 className="subHeader">Last Name:</h2>
        <p className="inputReview">{lastName}</p>

        <h2 className="subHeader">Address:</h2>
        <p className="inputReview">{address}</p>

        <h2 className="subHeader">Phone Number:</h2>
        <p className="inputReviewLast">{phoneNumber}</p>
      </div>

      {/* Done Button */}
      <div>
        <button onClick={goToProfile} className="doneBtn">
            <p className='doneTxt'>
                Done
            </p>
        </button>
      </div>
    </div>
  );
};

export default ReviewProfile;