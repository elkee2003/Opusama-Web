import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import DefaultImage from "/defaultImage.png";
import { Switch } from "@mui/material";
import './Content.css'
import { FaRegCommentDots } from "react-icons/fa6";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { MdDelete } from "react-icons/md";
import Countdown from "react-countdown";
import LastReview from './LastReview';
import RealtorNameRating from './RealtorNameRating';
import {useAuthContext} from '../../../../../../../Providers/ClientProvider/AuthProvider';
import { useProfileContext } from '../../../../../../../Providers/ClientProvider/ProfileProvider';
import VendorSlotManager from './VendorSlotManager/VendorSlotManager';
import { getUrl, remove } from "aws-amplify/storage";
import { DataStore } from "aws-amplify/datastore";
import {Post, PostReview, BookingPostOptions} from '../../../../../../models';

function Content({post, setPost, realtor,}) {
    const navigate = useNavigate();
    const {dbUser, authUser} = useAuthContext();

    const {setRealtorID,firstName} = useProfileContext();
    const [readMore, setReadMore] = useState(false);
    const [readMoreLux, setReadMoreLux] = useState(false);
    const [readMorePol, setReadMorePol] 
    = useState(false);
    const [isAvailable, setIsAvailable] = useState(post?.available);
    const [averageRating, setAverageRating] = useState(0);
    const [mediaUris, setMediaUris] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const bookingModeLabels = {
      manual: "Manual Acceptance (Host approval required)",
      auto_date: "Auto Acceptance (Date required)",
      auto_datetime: "Auto Acceptance (Date & time required)",
      auto_event: "Auto Acceptance (Instant booking)",
    };

    const formattedPrice = Number(post?.price)?.toLocaleString();
    const formattedCautionFee = Number(post?.cautionFee)?.toLocaleString();
    const formattedTotalPrice = Number(post?.totalPrice)?.toLocaleString();
    const formattedInspectionFee = Number(post?.inspectionFee)?.toLocaleString();

    const formatDuration = (minutes) => {
      if (minutes < 60) return `${minutes} minutes`;
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins === 0 
        ? `${hours} hour${hours > 1 ? 's' : ''}`
        : `${hours} hr ${mins} min`;
    };
    

    // useEffect to store realtorid for review
    useEffect(() => {
      if (realtor?.id) {
        setRealtorID(realtor.id);
      }
    }, [realtor?.id, setRealtorID]);

    // Function to handle post deletion
    const handleDeletePost = async () => {
      if (window.confirm("Are you sure you want to delete this post?")) {
        setLoading(true);
        try {
           // Delete media from S3
          if (post.media && post.media.length > 0) {
            await Promise.all(
              post.media.map(async (path) => {
                try {
                  await remove({ path });
                } catch (error) {
                  console.error(`Failed to delete ${path} from S3:`, error);
                }
              })
            );
          }

          // Query and delete the post
          const postToDelete = await DataStore.query(Post, post.id);
          if (postToDelete) {
            await DataStore.delete(postToDelete);
            alert("Post deleted successfully.");
            navigate(-1);
          } else {
            alert("Post not found.");
          }
        } catch (e) {
          alert(`Failed to delete post: ${e.message}`);
        } finally {
          setLoading(false);
        }
      }
    };

    // Function to delete Post Options
    const handleDeleteOption = async (optionId) => {
      if (!window.confirm("Are you sure you want to delete this option?")) return;
      
      try {
        const toDelete = await DataStore.query(BookingPostOptions, optionId);
        if (toDelete) {
          await DataStore.delete(toDelete);

          // Update UI immediately
          setPost((prevPost) => ({
            ...prevPost,
            bookingOptions: prevPost.bookingOptions.filter(opt => opt.id !== optionId),
          }));
        }
      } catch (error) {
        console.error("Error deleting option:", error);
      }
    };


    // Function to handle the availability switch toggle
    const toggleAvailability = async () => {
      try {
        const original = await DataStore.query(Post, post.id);
        if (!original) {
          alert("Post not found");
          return;
        }

        const updatedPost = Post.copyOf(original, (updated) => {
          updated.available = !original.available;
        });

        await DataStore.save(updatedPost);
        setIsAvailable(updatedPost.available);
      } catch (e) {
        alert(`Failed to update availability: ${e.message}`);
      }
    };
    

    // Fetch signed URLs for images
    useEffect(() => {
      // Fetch signed URLs for each media item in post.media
      const fetchMediaUrls = async () => {
        try {
          const urls = await Promise.all(
              post.media.map(async (path) => {
                const result = await getUrl({
                    path,
                    options: {
                      validateObjectExistence: true, 
                      expiresIn: null, // No expiration limit
                    },
                });
                return { url: result.url.toString(), type: path.endsWith('.mp4') ? 'video' : 'image' };
            })
          );
  
          setMediaUris(urls.filter(media => media.url !== null));
        } catch (error) {
          console.error('Error fetching media URLs:', error);
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
    <div className='realtorContentContainer'>
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

      <div 
        className='editPostBtnCon'
        onClick={()=>navigate(`/realtorcontent/edit_post/${post.id}`)}
      >
        <p>Edit</p>
      </div>

      {/* Scrollable Content */}
      <div className='scrollContainer'>
        <div 
          className='imageContainer'
          onClick={()=>navigate(`/realtorcontent/postgallery/${post.id}`)}
        >
          {/* Subcription Label */}
          {post.isSubscription && <div className='subscribeLabel'>
            <p>Subscription</p>
          </div>}

          {mediaUris.length > 0 ? (
          mediaUris[0].type === 'video' ? (
            <div className='postDetailVideoWrapper'>
              <video 
                className="detailMedia" 
                controls
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
              >
                <source src={mediaUris[0].url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="postDetailVideoOverlay" onClick={(e) => {
                e.stopPropagation();
                navigate(`/realtorcontent/postgallery/${post.id}`);
              }}/>
            </div>
          ) : (
            <img src={mediaUris[0].url} alt="Post" className="image" />
          )) : (
            <img src={'/defaultImage.png'} alt="Default" className="image" />
          )}
        </div>

        {/* Event Name */}
        {post?.eventName && (
          <p className='eventName'>
            {post?.eventName}
          </p>
        )}

        

        {/* Unavailable Label */}
        {!post?.available && <div className='unavailableLabel'>
          <p>Unavailable</p>
        </div>}

        <div className='toggleCon'>
          <span className='availableTxt'>Available:</span>
          <Switch
            checked={isAvailable}
            onChange={toggleAvailability}
            color="primary"
          />
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
            onClick={()=>navigate(`/realtorcontent/reviews_comments/${post.id}`)}
          >
            <FaRegCommentDots className='commentContentIcon'/>
            <p>{post?.totalFeedback}</p>
          </div>
        </div>

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
            <p className='realtorDetailss'>{post.availableDocs}</p>
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
        {post.fullAddress && (
          <p className='location'>{post.fullAddress}</p>
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

        {/* Capacity */}
        {post?.capacity ? (
          <>
            <p>
              Capacity:
            </p>
            <p className='bedroom'>
              {post.capacity}
            </p>
          </>
        ): ''}

        {/* Type & Description */}
        {post.description && (
          <div>
            <h4 className='luxPolHeadTxt'>Description</h4>
            <p className='realtorPropDesc'>
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


        {/* Event Start Date and Time  */}
        {post?.eventDateTime ? (
          <>
            <p className='subheader'> Start Date & Time</p>
            <p className='bedroom'>
              {new Date(post.eventDateTime).toLocaleString([], {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>

            {/* Countdown timer */}
            <div className="countdown-container">
              <Countdown
                date={new Date(post?.eventDateTime)}
                renderer={({ days, hours, minutes, seconds, completed }) => {
                  if (completed) {
                    return <span className="event-started">🎉 Event Started</span>;
                  } else {
                    return (
                      <div className="countdown-boxes">
                        <div className="time-box">
                          <span className="time-value">{days}</span>
                          <span className="time-label">Days</span>
                        </div>
                        <span className="colon">:</span>
                        <div className="time-box">
                          <span className="time-value">{hours}</span>
                          <span className="time-label">Hours</span>
                        </div>
                        <span className="colon">:</span>
                        <div className="time-box">
                          <span className="time-value">{minutes}</span>
                          <span className="time-label">Minutes</span>
                        </div>
                        <span className="colon">:</span>
                        <div className="time-box">
                          <span className="time-value">{seconds}</span>
                          <span className="time-label">Seconds</span>
                        </div>
                      </div>
                    );
                  }
                }}
              />
            </div>
          </>
        ) : ''}

        {/* Event End Date and Time */}
        {post?.eventEndDateTime ? (
          <>
            <p className='subheader'>End Date & Time</p>
            <p className='bedroom'>
              {new Date(post.eventEndDateTime).toLocaleString([], {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </>
          
        ) : ''}

        {/* Event Frequency */}
        {post?.eventFrequency ? (
          <>
            <p className='subheader'>Event Frequency</p>
            <p className='bedroom'>
              {post.eventFrequency}
            </p>
          </>
        ) : ''}

        {/* Event Recurrence */}
        {post?.recurrence ? (
          <>
            <p className='subheader'>Event Recurrence</p>
            <p className='bedroom'>
              {post.recurrence}
            </p>
          </>
        ) : ''}

        {/* Dress Code */}
        {post?.dressCode ? (
          <>
            <p className='subheader'>Dress Code</p>
            <p className='bedroom'>
              {post.dressCode}
            </p>
          </>
        ) : ''}


        {/* Subcription Enabled or not */}
        {post?.isSubscription ? (
          <>
            <p className='subheader'>
              Post Type:
            </p>
            <p className='bedroom'>
              Subscription Enabled
            </p>
          </>
        ): ''}

        {/* Booking Mode */}
        {post?.bookingMode ? (
          <>
            <p className='subheader'>Booking Mode:</p>
            <p>{bookingModeLabels[post.bookingMode] || "N/A"}</p>
          </>
        ): ''}

        {/* Multiple booking */}
        {post?.allowMultiple ? (
          <>
            <p className='subheader'>Multiple Booking:</p>
            <p>Enabled</p>
          </>
        ): ''}

        {/* Maximum Capacity */}
        {post?.maxCapacity ? (
          <>
            <p className='subheader'>Maximum Booking Capacity:</p>
            <p>{post.maxCapacity}</p>
          </>
        ): ''}

        {/* Session Duration */}
        {post?.sessionDuration ? (
          <>
            <p className='subheader'>Session Duration:</p>
            <p>{formatDuration(post.sessionDuration)}</p>
          </>
        ) : ''}

        {/* Session Gap */}
        {post?.sessionGap ? (
          <>
            <p className='subheader'>Session Gap:</p>
            <p>{formatDuration(post.sessionGap)}</p>
          </>
        ) : ''}

        {/* Service Days */}
        {post?.servicingDay?.length > 0 ? (
          <>
            <p className='subheader'>Days of Service:</p>
            <p>{post.servicingDay.join(", ")}</p>
          </>
        ): ''}

        {/* Opening Hour */}
        {post?.openingHour ? (
          <>
            <p className='subheader'>Opening Hour:</p>
            <p>{post.openingHour}</p>
          </>
        ): ''}

        {/* Closing Hour */}
        {post?.closingHour ? (
          <>
            <p className='subheader'>Closing Hour:</p>
            <p>{post.closingHour}</p>
          </>
        ): ''}

        {/* Manage Booking Slots */}
        {post?.bookingMode === "auto_datetime" && (
          <>
            <div className="topBorderLine" />
            <VendorSlotManager post={post} />
          </>
        )}

        {/* Price */}
        {post?.bookingOptions?.length > 0 ? (
          // Show booking options (no price)
          <div className="optionsContainer">
            <p className="optionSubTitle">Available Options:</p>

            {post.bookingOptions.map((opt, idx) => (
              <div 
                key={idx} 
                className="realtorBookingOptionCard"
              >
                <div className="optionDetails">
                  <p><strong>Type:</strong> {opt.bookingPostOptionType}</p>
                  <p><strong>Name:</strong> {opt.bookingName}</p>
                  <p><strong>Price:</strong> ₦{opt.optionPrice?.toLocaleString()}</p>
                </div>

                {/* Delete Icon */}
                <MdDelete
                  onClick={() => handleDeleteOption(opt.id)}
                  className="deleteOptionIcon"
                  title="Delete this option"
                />
              </div>
              
            ))}
          </div>
        ) : (
          // Show base price only if no bookingOptions
          <div className="priceRoww">
            <p className="sub">Price:</p>
            <p className="price">
              {Number(post.price) === 0
                ? "Free"
                : `₦${formattedPrice} ${post.timeFrame ? `/ ${post.timeFrame}` : ""}`}
            </p>
          </div>
        )}

        {/* Caution Fee */}
        {post?.cautionFee ? (
          <div className='cautionFeeRow'>
            <p className='sub'>Caution Fee:</p>
            <p className='price'>₦{formattedCautionFee}</p>
          </div>
          ) : ''
        }

        {/* Total Price */}
        {post?.bookingOptions?.length > 0 ? null : (
          <div className="priceRowTotal">
            <p className='sub'>Total Price:</p>
            <p className='totalPrice'>
              {Number(post.totalPrice) === 0 ? 'Free' : `₦${formattedTotalPrice}`}
            </p>
          </div>
        )}

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

        {/* Last Review */}
        <p className= 'lastRatingReviewTxt'>Ratings and Reviews:</p>
        <button 
          className='seeAllReviews'
          onClick={()=>navigate(`/realtorcontent/reviews_comments/${post.id}`)}
        >
          <LastReview post={post} dbUser={dbUser}/>
          <p className='seeAllReviewsTxt'>See all feedbacks</p>
        </button>

        {/* Delete btn */}
        <div className='deleteDiv'>
          <button 
          className='deleteCon'
          onClick={handleDeletePost}
          >
              <p className='deleteTxt'>{loading ? 'Deleting...' : 'Delete'}</p>
          </button>
        </div>
      </div>

    </div>
  )
}

export default Content;
