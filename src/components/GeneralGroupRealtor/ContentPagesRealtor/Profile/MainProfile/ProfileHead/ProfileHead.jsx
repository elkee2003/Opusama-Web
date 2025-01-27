import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileHead.css'
import { FaPhone } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5';
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import placeholder from '/placeholder.png';
import { useProfileContext } from '../../../../../../../Providers/RealtorProvider/ProfileProvider';
import { useAuthContext } from '../../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from 'aws-amplify/datastore';
import { Realtor } from '../../../../../../models';
import { getUrl } from 'aws-amplify/storage';

const ProfileHead = () => {
    const navigate = useNavigate(); 
    const { firstName, lastName, address, phoneNumber, profilePic, setProfilePic, myDescription } = useProfileContext();
    const { dbRealtor } = useAuthContext();

    const [loading, setLoading] = useState(true);
    const [readMoreDescription, setReadMoreDescription] = useState(false);

    const descriptionMaxLength = 80;
    const truncatedDescription =
        myDescription.length > descriptionMaxLength
        ? `${myDescription.substring(0, descriptionMaxLength)}...`
        : myDescription;

    const maxLength = 30;
    const locationText = address;

    const truncatedText =
        address.length > maxLength ? `${locationText.substring(0, maxLength)}...` : locationText;

    const comingSoon = () => {
        alert('Functionality will be available soon!');
    };

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
                <p className="name">{firstName}</p>
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