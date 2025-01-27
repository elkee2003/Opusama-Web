import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import './Content.css'
import DefaultImage from "/defaultImage.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import DbUserReviewSection from './DataBUserReview'
import LastReview from './LastReview';
import RealtorNameRating from './RealtorNameRating';
import {useAuthContext} from '../../../../../../../../Providers/ClientProvider/AuthProvider';
import {useBookingShowingContext} from '../../../../../../../../Providers/ClientProvider/BookingShowingProvider';
import { useProfileContext } from '../../../../../../../../Providers/ClientProvider/ProfileProvider';
import { getUrl } from "aws-amplify/storage";
import { DataStore } from "aws-amplify/datastore";
import {PostReview} from '../../../../../../../models';

function Content({post, realtor,}) {
    const navigate = useNavigate();
    const {dbUser, authUser} = useAuthContext();

    const {setPostPrice, setPostCautionFee, setPostTotalPrice} = useBookingShowingContext();

    const {setRealtorID} = useProfileContext();
    const [readMore, setReadMore] = useState(false);
    const [readMoreLux, setReadMoreLux] = useState(false);
    const [readMorePol, setReadMorePol] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [imageUris, setImageUris] = useState([]);  

    const formattedPrice = Number(post?.price)?.toLocaleString();
    const formattedCautionFee = Number(post?.cautionFee)?.toLocaleString();
    const formattedTotalPrice = Number(post?.totalPrice)?.toLocaleString();
    const formattedInspectionFee = Number(post?.inspectionFee)?.toLocaleString();
    

    // useEffect to store realtorid for review
    useEffect(() => {
      if (realtor?.id) {
        setRealtorID(realtor.id);
      }
    }, [realtor?.id, setRealtorID]);
    

    // Fetch signed URLs for images
    useEffect(() => {
      const fetchImageUrls = async () => {
        try {
          const urls = await Promise.all(
            post.media.map(async (path) => {
              const result = await getUrl({ path, options: { validateObjectExistence: true } });
              return result.url;
            })
          );
          setImageUris(urls.filter((url) => url !== null));
        } catch (error) {
          console.error("Error fetching image URLs:", error);
        }
      };

      if (post.media?.length > 0) {
        fetchImageUrls();
      }
    }, [post.media]);

    // Calculate average rating
    useEffect(() => {
      const calculateAverageRating = async () => {
        try {
          const reviews = await DataStore.query(PostReview, (c) => c.postID.eq(post.id));
          if (reviews.length > 0) {
            const total = reviews.reduce((sum, review) => sum + review.rating, 0);
            setAverageRating((total / reviews.length).toFixed(1));
          } else {
            setAverageRating(0);
          }
        } catch (error) {
          console.error("Error calculating average rating:", error);
        }
      };

      calculateAverageRating();
    }, [post.id]);

    // Run this effect when these values change
    useEffect(() => {
      setPostTotalPrice(post?.totalPrice);
      setPostPrice(post?.price);
      setPostCautionFee(post?.cautionFee);
    }, [formattedTotalPrice, realtor.id]);

    // Navigate function
    const handleNavigate = () => {
      if(authUser){
        navigate(`/clientcontent/clientdetails/${post.id}`);
      }else{
        alert('Sign In to access')
        navigate('/')
      }
    };

    // useEffect for realtime update
    useEffect(()=>{
      if(!post) return;

      const subscription = DataStore.observe(PostReview).subscribe(({ opType, element }) => {
        if (element.postID === post.id) { // Ensure it's for the current post
          if (opType === 'INSERT' || opType === 'UPDATE' || opType === 'DELETE') {
            calculateAverageRating();
          }
        }
      });

      return () => subscription.unsubscribe();
    },[post.id])

  return (
    <div className='contentContainer'>
        <button 
          className='bckContainer' 
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon 
            icon={faArrowLeft}
            className='backIcon' 
            size="2x"
          />
        </button>

        {/* Scrollable Content */}
        <div className='scrollContainer'>
          <div 
            className='imageContainer'
            onClick={()=>navigate(`/clientcontent/gallery/${post.id}`)}
          >
            {imageUris[0] ? (
              <img src={imageUris[0]} alt="Post" className='image' />
            ) : (
              <img src={DefaultImage} alt="Default" className='image' />
            )}
          </div>

          {/* Realtor Info */}
          <RealtorNameRating realtor={realtor}/>

          {/* Property Details */}
          {post.propertyType && <p className='propertyType'>
            {post.propertyType}
          </p>}

          {/* Type */}
          {post.type && <p className='type'>{post.type}</p>}
          
          {/* Name of Type */}
          {post.nameOfType && (
            <p className='typeName'>Name: {post.nameOfType}</p>
          )}

          {/* Available Documents */}
          {post.availableDocs && (
            <div>
              <h4 className='subheader'>Available Documents:</h4>
              <p className='details'>{post.availableDocs}</p>
            </div>
          )}

          <div className='topBorderLine' />

          {/* Accommodation Parts */}
          {post.accommodationParts && (
            <>
              <p className='subheader'>Accommodation Parts</p>
              <p className='bedroom'>
                {post.accommodationParts}
              </p>
            </>
          )}
          
          {/* Bed & Bedrooms */}
          {post.bed && (
            <p className='bedroom'>Beds: {post.bed} </p>
          )}


          {post.bedrooms && (
            <p className='bedroom'>Bedrooms: {post.bedrooms} </p>
          )}

          <div className='topBorderLine' />

          {/* Location */}
          {post.address && (
            <p className='location'>{post.address}</p>
          )}

          {/* City, State, Country, */}
          <div>
            <p className='subheader'>Location</p>
            {post.city && (
              <div className='locationRow'>
                <p className='location'>
                  City:
                </p>
                <p className='bedroom'>
                  {' '}{post.city}
                </p>
              </div>
            )}

            {post.state && (
              <div className='locationRow'>
                <p className='location'>
                  State:
                </p>
                <p className='bedroom'>
                  {' '}{post.state}
                </p>
              </div>
            )}
            {post.country && (
              <div className='locationRow'>
                <p className='location'>
                  Country:
                </p>
                <p className='bedroom'>
                  {' '}{post.country}
                </p>
              </div>
            )}
          </div>

          <div className='topBorderLine' />

          {/* Ratings */}
          <div className='reviewIconRow'>
            <FontAwesomeIcon icon={faStar} className='star' />
            <span className='starTxt'>{averageRating}</span>
          </div>

          {/* Type & Description */}
          {post.description && (
            <div>
              <h4 className='luxPolHeadTxt'>Description</h4>
              <p className='detailedDesc'>
                {readMore || post.description.length <= 150
                  ? post.description
                  : `${post.description.substring(0, 150)}...`}
                {post.description.length > 150 && (
                  <button
                    className={readMore ? 'readLessButton' : 'readMoreButton'}
                    onClick={() => setReadMore(!readMore)}
                  >
                    {readMore ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </p>
            </div>
          )}

        {/* Pricing */}
        <div className='priceRoww'>
          <p className='sub'>Rent:</p>
          <p className='price'>
            ₦{formattedPrice} {post.timeFrame && `/ ${post.timeFrame}`}
          </p>
        </div>

        {/* Caution Fee */}
        {post?.cautionFee ? (
          <div className='cautionFeeRow'>
            <p className='sub'>Caution Fee:</p>
            <p className='price'>₦{formattedCautionFee}</p>
          </div>
          ) : ''
        }

        <div className="priceRowTotal">
          <p className='sub'>Total Price:</p>
          <p className='totalPrice'>₦{formattedTotalPrice}</p>
        </div>

        {/* Inspection Fee */}
          {post?.inspectionFee ? (
            <div className='priceRowTotal'>
              <p className='subInspectionFee'>Inspection Fee:</p>
              <p className='inspectionFee'> ₦{formattedInspectionFee}</p>
            </div>
          ) : ''}

        <div className='topBorderLine' />

        {/* Amenities */}
        <div>
          <h4 className='luxPolHeadTxt'>Living Luxuries</h4>
          <p className='luxPolTxt'>
            {readMoreLux ||post.amenities.length <= 150 ? post.amenities : `${post.amenities.substring(0, 100)}...`}

            {/* Button to toggle */}
            { post.amenities.length > 100 &&(<button
                className={readMoreLux ? 'readLessButton' : 'readMoreButton'}
                onClick={() => setReadMoreLux(!readMoreLux)}
              >
                {readMoreLux ? 'Show Less' : 'Read More'}
              </button>
            )
            }
          </p>
        </div>
        
        <div className='topBorderLine' />

        {/* Policies */}
        <div>
          <h4 className='luxPolHeadTxt'>Stay Policies</h4>
          <p className='luxPolTxt'>
            {readMorePol || post.policies.length <= 100 ? post.policies : `${post.policies.substring(0,100)}...`}

            {/* Button to toggle */}
            { post.policies.length > 100 &&(  <button
                className={readMorePol ? 'readLessButton' : 'readMoreButton'}
                onClick={() => setReadMorePol(!readMorePol)}
                >
                  {readMorePol ? 'Show Less' : 'Read More'}
                </button> )
            }
          </p>
        </div>

        {/* Border Line */}
        <div className='topBorderLine' />

        {/* DbUser Rating & Review */}
        <DbUserReviewSection post={post} dbUser={dbUser} />

        {/* Last Review */}
        <p className= 'lastRatingReviewTxt'>Ratings and Reviews:</p>
        <button 
          className='seeAllReviews'
          onClick={()=>navigate(`/clientcontent/reviews/${post.id}`)}
        >
          <LastReview post={post} dbUser={dbUser}/>
          <p className='seeAllReviewsTxt'>See all reviews</p>
        </button>

        {/* Get In Touch Container */}
        <button className='getinTouchContainer' onClick={handleNavigate}>
            <p className='getInTouchTxt'>Get in Touch!</p>
        </button>

      </div>

    </div>
  )
}

export default Content;
