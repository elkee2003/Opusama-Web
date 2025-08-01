import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import DefaultImage from "/defaultImage.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FaRegCommentDots } from "react-icons/fa6";
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

    const {setPostPrice, setPostCautionFee, setPostOtherFeesName, setPostOtherFeesPrice, setPostOtherFeesName2, setPostOtherFeesPrice2, setPostTotalPrice} = useBookingShowingContext();

    const {setRealtorID} = useProfileContext();
    const [readMore, setReadMore] = useState(false);
    const [readMoreLux, setReadMoreLux] = useState(false);
    const [readMorePol, setReadMorePol] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [mediaUris, setMediaUris] = useState([]);   

    const formattedPrice = Number(post?.price)?.toLocaleString();
    const formattedCautionFee = Number(post?.cautionFee)?.toLocaleString();
    const formattedOtherFeesPrice = Number(post?.otherFeesPrice)?.toLocaleString();
    const formattedOtherFeesPrice2 = Number(post?.otherFeesPrice2)?.toLocaleString();
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
      const fetchMediaUrls = async () => {
        try {
          const urls = await Promise.all(
            post.media.map(async (path) => {
              const result = await getUrl({ 
                path, 
                options: { validateObjectExistence: true } 
              });

              return {
                url: result.url.toString(),
                type: path.endsWith('.mp4') ? 'video' : 'image'
              };
            })
          );

          setMediaUris(urls.filter((media) => media.url !== null));
        } catch (error) {
          console.error("Error fetching media URLs:", error);
        }
      };

      if (post.media?.length > 0) {
        fetchMediaUrls();
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
      setPostOtherFeesName(post?.otherFeesName);
      setPostOtherFeesPrice(post?.otherFeesPrice);
      setPostOtherFeesName2(post?.otherFeesName2);
      setPostOtherFeesPrice2(post?.otherFeesPrice2);
    }, [formattedTotalPrice, realtor.id]);

    // Navigate function
    const handleNavigate = () => {
      if(authUser){
        navigate(`/clientcontent/clientdetails/${post.id}`);
      }else{
        alert('Sign In to access');
        navigate('/?section=signin');
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
            {mediaUris.length > 0 ? (
              mediaUris[0].type === 'video' ? (
                <div className='pDetailVideoWrapper'>
                  <video 
                    className="pDetailMedia" 
                    controls
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <source src={mediaUris[0].url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  <div className="pDetailVideoOverlay" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/clientcontent/gallery/${post.id}`);
                  }}/>
                </div>
              ) : (
                <img src={mediaUris[0].url} alt="Post" className="image" />
              )
            ) : (
              <img src={DefaultImage} alt="Default" className='image' />
            )}
          </div>

          {/* Realtor Info */}
          <RealtorNameRating realtor={realtor}/>

          {/* Property Details */}
          <div className='propertyTypeRow'>
            {post.propertyType && <p className='propertyType'>
              {post.propertyType}
            </p>}

            <div 
              className='commentContentRow'
              onClick={()=>navigate(`/clientcontent/reviews_comments/${post.id}`)}
            >
              <FaRegCommentDots className='commentContentIcon'/>
              <p>{post?.totalFeedback}</p>
            </div>
          </div>

          {/* Type */}
          {post.type && <p className='type'>{post.type}</p>}

          {/* Package Type */}
          {post?.packageType && <p className='type'>{post?.packageType}</p>}
          
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

          {/* Capacity */}
          {post?.capacity ? (
            <>
              <p className='subheader'>Capacity</p>
              <p className='bedroom'>
                {post.capacity}
              </p>
            </>
          ) : ''}

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
          {post.generalLocation && (
            <p className='location'>{post.generalLocation}</p>
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
              <p className='lifestyleDetailedDesc'>
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

          {/* Dress Code */}
          {post?.dressCode ? (
            <>
              <p className='subheader'>Dress Code</p>
              <p className='bedroom'>
                {post.dressCode}
              </p>
            </>
          ) : ''}

          {/* Time and Date */}
          {post?.eventDateTime ? (
            <>
              <p className='subheader'>Date & Time</p>
              <p className='bedroom'>
                {post.eventDateTime}
              </p>
            </>
          ) : ''}

        {/* Pricing */}
        <div className='priceRoww'>
          <p className='sub'>Price:</p>
          <p className='price'>
            {Number(post.price) === 0
              ? 'Free'
              : `₦${formattedPrice} ${post.timeFrame ? `/ ${post.timeFrame}` : ''}`}
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

        {/* Other Fees */}
        {post?.otherFeesPrice ? (
          <div className='cautionFeeRow'>
            <p className='sub'>{post?.otherFeesName}:</p>
            <p className='price'>₦{formattedOtherFeesPrice}</p>
          </div>
          ) : ''
        }

        {/* Other Fees2 */}
        {post?.otherFeesPrice2 ? (
          <div className='cautionFeeRow'>
            <p className='sub'>{post?.otherFeesName2}:</p>
            <p className='price'>₦{formattedOtherFeesPrice2}</p>
          </div>
          ) : ''
        }

        {/* Total Price */}
        <div className="priceRowTotal">
          <p className='sub'>Total Price:</p>
          <p className='totalPrice'>
            {Number(post.totalPrice) === 0 ? 'Free' : `₦${formattedTotalPrice}`}
          </p>
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
          <h4 className='luxPolHeadTxt'> Luxuries</h4>
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
          <h4 className='luxPolHeadTxt'>Policies</h4>
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
          onClick={()=>navigate(`/clientcontent/reviews_comments/${post.id}`)}
        >
          <LastReview post={post} dbUser={dbUser}/>
          <p className='seeAllReviewsTxt'>See all feedbacks</p>
        </button>

        {/* Get In Touch Container */}
        <button className='reserveCon' onClick={handleNavigate}>
            <p className='reserveTxt'>Contact</p>
        </button>

      </div>

    </div>
  )
}

export default Content;
