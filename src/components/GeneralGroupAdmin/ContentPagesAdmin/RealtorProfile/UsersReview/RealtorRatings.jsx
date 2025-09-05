import React, { useState, useEffect } from 'react';
import UserReviews from './Details/UsersReview';
import { useParams } from 'react-router-dom'; 
import { DataStore } from 'aws-amplify/datastore';
import { Realtor } from '../../../../../models';

const RealtorRatings = () => {
  const { realtorId } = useParams();
  console.log('realtorID:', realtorId)
  const [realtor, setRealtor] = useState(null);

  const fetchRealtor = async () => {
    try {
      if (realtorId) {
        const foundRealtor = await DataStore.query(Realtor, realtorId);
        setRealtor(foundRealtor);
      }
    } catch (error) {
      console.error('Fetching Realtor error:', error);
    }
  };

  useEffect(() => {
    fetchRealtor();
  }, [realtorId]);

  if (!realtor) {
    return <div>Loading...</div>; // Show a loading state or an appropriate message
  }

  return (
    <div>
      <UserReviews realtor={realtor} />
    </div>
  );
};

export default RealtorRatings;