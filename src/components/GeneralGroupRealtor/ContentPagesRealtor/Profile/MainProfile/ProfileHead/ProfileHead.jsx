import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileHead.css'
import { FaPhone } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import placeholder from '/placeholder.png';
import { useProfileContext } from '../../../../../../../Providers/RealtorProvider/ProfileProvider';
import { useAuthContext } from '../../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from 'aws-amplify/datastore';
import { Realtor, PostReview, RealtorReview } from '../../../../../../models';
import { getUrl } from 'aws-amplify/storage';

const ProfileHead = () => {
    const navigate = useNavigate(); 
    const { firstName, lastName, address, phoneNumber, profilePic, setProfilePic, myDescription } = useProfileContext();
    const { dbRealtor } = useAuthContext();

    const [loading, setLoading] = useState(true);
    const [readMoreDescription, setReadMoreDescription] = useState(false);
    const [averageRealtorRating, setAverageRealtorRating] = useState(0);

    const descriptionMaxLength = 80;
    const truncatedDescription =
        myDescription.length > descriptionMaxLength
        ? `${myDescription.substring(0, descriptionMaxLength)}...`
        : myDescription;

    const maxLength = 30;
    const locationText = address;

    const truncatedText =
        address.length > maxLength ? `${locationText.substring(0, maxLength)}...` : locationText;


    // Fetch signed URL for profile picture
    const fetchImageUrl = async () => {
        setLoading(true);
        try {
        const result = await getUrl({
            path: dbRealtor.profilePic,
            options: {
            validateObjectExistence: true,
            expiresIn: null, // No expiration limit
            },
        });

        if (result.url) {
            setProfilePic(result.url.toString());
        }
        } catch (error) {
        console.error('Error fetching profile pic URL:', error);
        } finally {
        setLoading(false);
        }
    };

    // Real time update of fetchImage
    useEffect(() => {
        if (dbRealtor?.profilePic) {
            fetchImageUrl();
        }

        const subscription = DataStore.observe(Realtor).subscribe(({ opType }) => {
            if (opType === 'INSERT' || opType === 'UPDATE' || opType === 'DELETE') {
                fetchImageUrl();
            }
        });

        return () => subscription.unsubscribe();
    }, [dbRealtor.profilePic]);

    // Function to calculate average realtor ratings
    const calculateAverageRealtorRating = async () => {
        try {
            // Fetch all RealtorReview entries for the realtor
            const realtorReviews = await DataStore.query(RealtorReview, (c) =>
            c.realtorID.eq(dbRealtor.id)
            );

            // Fetch all PostReview entries related to the realtor
            const postReviews = await DataStore.query(PostReview, (p) =>
            p.realtorID.eq(dbRealtor?.id)
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
    }, [dbRealtor.id]);

    // useEffect for real-time realtor rating update
    useEffect(() => {
        if (!dbRealtor) return;

        const realtorReviewSubscription = DataStore.observe(RealtorReview).subscribe(
            ({ opType, element }) => {
            if (element.realtorID === dbRealtor?.id) {
                if (['INSERT', 'UPDATE', 'DELETE'].includes(opType)) {
                calculateAverageRealtorRating();
                }
            }
            }
        );

        const postReviewSubscription = DataStore.observe(PostReview).subscribe(
            ({ opType, element }) => {
            if (element.realtorID === dbRealtor?.id) {
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
    }, [dbRealtor.id]);

  return (
    <div className="profileHeadContainer">
        <div className="profileDetails">
            {/* Three dots */}
            <button
            className="dotCon"
            onClick={() => navigate('/realtorcontent/profileoptions')}
            >
                <BsThreeDotsVertical className='dotIcon' />
            </button>

            {/* Image */}
            <div
            className="mainProfilePicContainer"
            onClick={() => navigate('/realtorcontent/editprofile')}
            >
            {loading ? (
                <img src={placeholder} alt="Placeholder" className="img" />
            ) : (
                <img
                src={profilePic}
                alt="Profile"
                className="img"
                onError={() => setProfilePic(null)}
                />
            )}
            </div>

            <div className="proHeadDetails">
            {/* Name and Surname */}
            <div className="proHeadRow">
                <IoPerson className='proHeadIcon' />
                <div className='nameRatingCon'>
                    <p className="name">{firstName}</p>

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
            </div>

            {/* PhoneNumber */}
            <div className="proHeadRow">
                <FaPhone className='proHeadIcon' />
                <p className="proHeadTxt">{phoneNumber}</p>
            </div>

            {/* Address */}
            <div className="proHeadRow">
                <FaLocationDot className='proHeadIcon'/>
                <p className="proHeadTxt">{truncatedText}</p>
            </div>

            {/* Description */}
            <div className="row">
                <span className="proHeadTxtDesc">
                {readMoreDescription || myDescription.length <= descriptionMaxLength
                    ? myDescription
                    : truncatedDescription}
                {myDescription.length > descriptionMaxLength && (
                    <span
                    onClick={() => setReadMoreDescription(!readMoreDescription)}
                    className={`readMoreLess ${
                        readMoreDescription ? 'readMoreLessActive' : ''
                    }`}
                    >
                    {readMoreDescription ? ' show less' : ' read more'}
                    </span>
                )}
                </span>
            </div>
            </div>
        </div>

        <div className="profileHeadSubrow">
            <button
            className="subHeaderContainer"
            onClick={() => navigate('/realtorcontent/editprofile')}
            >
            <span className="subHeaderTxt">Edit Profile</span>
            </button>

            <button className="subHeaderContainer" onClick={() => navigate('/realtorcontent/realtorrating')}>
            <span className="subHeaderTxt">View Ratings</span>
            </button>
        </div>
    </div>
  );
};

export default ProfileHead;