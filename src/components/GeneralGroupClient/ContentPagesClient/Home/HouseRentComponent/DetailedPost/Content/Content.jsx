import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import './Content.css'
import DefaultImage from "/defaultImage.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// import ReviewSection from './dbUserReview';
import UserReviews from './UsersReviews';
import LastReview from './LastReview';
import RealtorNameRating from './RealtorNameRating';
import {useAuthContext} from '../../../../../../../../Providers/ClientProvider/AuthProvider';
import { getUrl } from "aws-amplify/storage";
import { DataStore } from "aws-amplify/datastore";
import {PostReview} from '../../../../../../../models';

function Content({post, realtor,}) {
    const navigate = useNavigate();
    const {dbUser, authUser} = useAuthContext();
    const [readMore, setReadMore] = useState(false);
    const [readMoreLux, setReadMoreLux] = useState(false);
    const [readMorePol, setReadMorePol] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const [imageUris, setImageUris] = useState([]);  

    const formattedPrice = Number(post?.price)?.toLocaleString();
    const formattedCautionFee = Number(post?.cautionFee)?.toLocaleString();
    const formattedTotalPrice = Number(post?.totalPrice)?.toLocaleString();
    const formattedInspectionFee = Number(post?.inspectionFee)?.toLocaleString();

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

    // Navigate function
    const handleNavigate = () => {
      navigate(authUser ? "/realtor/houserealtor/clientinfo" : "/login");
    };

  return (
    <div className='container'>
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
            onClick={()=>navigate(`/gallery/housegallery/${post.id}`)}
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

          {post.type && <p className='type'>{post.type}</p>}
          
          {post.nameOfType && (
            <p className='typeName'>Name: {post.nameOfType}</p>
          )}
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
          <div className='ratingRow'>
            <FontAwesomeIcon icon={faStar} className='star' />
            <span className='starTxt'>{averageRating}</span>
          </div>

          {/* Description */}
          {post.description && (
            <div>
              <h4 className='luxPolHeadTxt'>Description</h4>
              <p>
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

        <div className='cautionFeeRow'>
          <p className='sub'>Caution Fee:</p>
          <p className='price'>₦{formattedCautionFee}</p>
        </div>

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

        <div className='topBorderLine' />

        {/* <ReviewSection post={post} dbUser={dbUser} /> */}

        <p className= 'lastRatingReviewTxt'>Ratings and Reviews:</p>
        <button 
          // onClick={handleOpenBottomSheet}
        >
          <LastReview post={post} dbUser={dbUser}/>
          <p className='seeAllReviews'>See all reviews</p>
        </button>

      </div>

    </div>
  )
}

export default Content;
