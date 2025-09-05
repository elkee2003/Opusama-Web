import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RealtorProfileHead.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Placeholder from '/placeholder.png'; 
import { getUrl } from 'aws-amplify/storage';
import { DataStore } from 'aws-amplify/datastore';
import { RealtorReview, PostReview } from '../../../../../models';

const RealtorProfileHead = ({ realtor }) => {
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(true);
    const [realtorProfilePic, setRealtorProfilePic] = useState(null);
    const [readMoreDescription, setReadMoreDescription] = useState(false);
    const [averageRating, setAverageRating] = useState(0);

  const descriptionMaxLength = 80;
  const truncatedDescription =
    realtor.myDescription?.length > descriptionMaxLength
      ? `${realtor.myDescription.substring(0, descriptionMaxLength)}...`
      : realtor.myDescription;

  // Navigate to Rating & Review
  const handleNavigate = () => {
    navigate(`/clientcontent/realtorusersreview/${realtor.id}`);
  };

  // Function to calculate average ratings
  const calculateAverageRating = async () => {
    try {
      // Fetch all RealtorReview entries for the realtor
      const realtorReviews = await DataStore.query(RealtorReview, (c) =>
        c.realtorID.eq(realtor.id)
      );

      // Fetch all PostReview entries related to the realtor
      const postReviews = await DataStore.query(PostReview, (p) =>
        p.realtorID.eq(realtor.id)
      );

      // Combine both arrays of reviews
      const allReviews = [...realtorReviews, ...postReviews];

      if (allReviews.length > 0) {
        // Calculate the total rating
        const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);

        // Calculate the average rating
        const average = totalRating / allReviews.length;

        setAverageRating(average.toFixed(1)); // Round to one decimal place
      } else {
        setAverageRating(0); // Handle no reviews case
      }
    } catch (e) {
      console.log('Error calculating average rating', e);
    }
  };

  // useEffect to calculate average ratings
  useEffect(() => {
    calculateAverageRating();
  }, [realtor.id]);

  // useEffect for real-time update
  useEffect(() => {
    if (!realtor) return;

    const realtorReviewSubscription = DataStore.observe(RealtorReview).subscribe(
      ({ opType, element }) => {
        if (element.realtorID === realtor.id) {
          if (opType === 'INSERT' || opType === 'UPDATE' || opType === 'DELETE') {
            calculateAverageRating();
          }
        }
      }
    );

    const postReviewSubscription = DataStore.observe(PostReview).subscribe(({ opType, element }) => {
      if (element.realtorID === realtor.id) {
        if (opType === 'INSERT' || opType === 'UPDATE' || opType === 'DELETE') {
          calculateAverageRating();
        }
      }
    });

    return () => {
      realtorReviewSubscription.unsubscribe();
      postReviewSubscription.unsubscribe();
    };
  }, [realtor.id]);

  // Fetch signed URL for profile picture
  const fetchImageUrl = async () => {
    setLoading(true);
    try {
      const result = await getUrl({
        path: realtor.profilePic,
        options: {
          validateObjectExistence: true,
          expiresIn: null, // No expiration limit
        },
      });

      if (result.url) {
        setRealtorProfilePic(result.url.toString());
      }
    } catch (error) {
      console.error('Error fetching profile pic URL:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (realtor.profilePic) {
      fetchImageUrl();
    }
  }, [realtor.profilePic]);

  return (
    <div className="realtorHeadContainer">
      {/* Profile Picture */}
      <button className="realtorProfilePicContainer">
        {loading ? (
          <img src={Placeholder} alt="Profile" className="realtorImg" />
        ) : (
          <img
            src={realtorProfilePic || Placeholder}
            alt="Profile"
            className="realtorImg"
            onError={() => setRealtorProfilePic(null)}
          />
        )}
      </button>

      <div className="details">
        {/* Name */}
        <div className="realtorRow">
          <span className="realtorName">{realtor.firstName}</span>

          {/* Medium of Review Star */}
          <button className="reviewIconRow" onClick={() => alert('A combination of ratings of properties under the realtor and realtor rating ')}>
            <FontAwesomeIcon icon={faStar} className="star" />
            <span className="starTxt">{averageRating}</span>
          </button>
        </div>

        <div className='userRealtorProUsernameCon'>
            <p className='userRealtorProUsername'>@{realtor?.username || 'unknown'}</p>
        </div>

        <div className="descriptionCon">
          <p className="txtDesc">
            {readMoreDescription || realtor?.myDescription?.length <= descriptionMaxLength
              ? realtor?.myDescription
              : truncatedDescription}
              
            {realtor.myDescription?.length > descriptionMaxLength && (
              <span
                onClick={() => setReadMoreDescription(!readMoreDescription)}
                className={readMoreDescription ? 'readMoreLess active' : 'readMoreLess'}
              >
                {readMoreDescription ? ' show less' : ' read more'}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Contact & Rating & Review */}
      <div className="profileBtnCon">
            {/* ratings and review */}
            <button className="rateReviewBtn" onClick={handleNavigate}>
                <p className='rateReviewBtnTxt'>
                    Ratings & Review
                </p>
            </button>
      </div>
    </div>
  );
};

export default RealtorProfileHead;