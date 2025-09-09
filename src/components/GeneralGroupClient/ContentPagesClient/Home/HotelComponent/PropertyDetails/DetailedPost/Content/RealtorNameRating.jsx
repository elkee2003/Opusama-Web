import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../../TabStyles/Content.css';
import { DataStore } from "aws-amplify/datastore";
import { PostReview, RealtorReview } from '../../../../../../../../models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const RealtorNameRating = ({ realtor }) => {
  const [averageRealtorRating, setAverageRealtorRating] = useState(0);
  const navigate = useNavigate();

  // Function to calculate average realtor ratings
  const calculateAverageRealtorRating = async () => {
    try {
      // Fetch all RealtorReview entries for the realtor
      const realtorReviews = await DataStore.query(RealtorReview, (c) =>
        c.realtorID.eq(realtor.id)
      );

      // Fetch all PostReview entries related to the realtor
      const postReviews = await DataStore.query(PostReview, (p) =>
        p.realtorID.eq(realtor?.id)
      );

      // Combine both arrays of reviews
      const allReviews = [...realtorReviews, ...postReviews];

      if (allReviews.length > 0) {
        // Calculate the total rating
        const totalRating = allReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );

        // Calculate the average rating
        const average = totalRating / allReviews.length;

        setAverageRealtorRating(average.toFixed(1)); // Round to one decimal place
      } else {
        setAverageRealtorRating(0); // Handle no reviews case
      }
    } catch (e) {
      console.error('Error calculating average realtor rating', e);
    }
  };

  // useEffect to calculate average ratings
  useEffect(() => {
    calculateAverageRealtorRating();
  }, [realtor.id]);

  // useEffect for real-time realtor rating update
  useEffect(() => {
    if (!realtor) return;

    const realtorReviewSubscription = DataStore.observe(RealtorReview).subscribe(
      ({ opType, element }) => {
        if (element.realtorID === realtor.id) {
          if (['INSERT', 'UPDATE', 'DELETE'].includes(opType)) {
            calculateAverageRealtorRating();
          }
        }
      }
    );

    const postReviewSubscription = DataStore.observe(PostReview).subscribe(
      ({ opType, element }) => {
        if (element.realtorID === realtor?.id) {
          if (['INSERT', 'UPDATE', 'DELETE'].includes(opType)) {
            calculateAverageRealtorRating();
          }
        }
      }
    );

    return () => {
      realtorReviewSubscription.unsubscribe();
      postReviewSubscription.unsubscribe();
    };
  }, [realtor.id]);

  return (
    <div>
      {realtor?.firstName && (
        <div className="realtorNameRow">
          <button
            className="nameButton"
            onClick={() => navigate(`/clientcontent/realtorprofile/${realtor?.id}`)}
          >
            <span className="name">{realtor.firstName}</span>
          </button>

          {/* Medium of Review Star */}
          <button
            className="reviewIconRow"
            onClick={() =>
              alert(
                'A combination of ratings of properties under the realtor and realtor rating'
              )
            }
          >
            <FontAwesomeIcon 
            icon={faStar}
            className="realtorStar" 
            size="2x"
            />
            <span className="realtorStarTxt">{averageRealtorRating}</span>
          </button>
        </div>
      )}

      <div className='postRealtorProUsernameCon'>
        <p className='postRealtorProUsername'>@{realtor?.username || 'unknown'}</p>
      </div>
    </div>
  );
};

export default RealtorNameRating;