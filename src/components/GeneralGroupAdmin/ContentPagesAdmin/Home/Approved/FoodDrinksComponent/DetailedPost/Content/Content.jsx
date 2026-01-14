import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import DefaultImage from "/defaultImage.png";
import { Switch } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FaRegCommentDots } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { GoHeartFill } from "react-icons/go";
import DbUserReviewSection from './DataBUserReview'
import LastReview from './LastReview';
import RealtorNameRating from './RealtorNameRating';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import {useAuthContext} from '../../../../../../../../../Providers/ClientProvider/AuthProvider';
import {useBookingShowingContext} from '../../../../../../../../../Providers/ClientProvider/BookingShowingProvider';
import { useProfileContext } from '../../../../../../../../../Providers/ClientProvider/ProfileProvider';
import { getUrl, remove } from "aws-amplify/storage";
import { DataStore } from "aws-amplify/datastore";
import {PostReview, Post as PostModel, PostLike, User, BookingPostOptions} from '../../../../../../../../models';

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
    const [liked, setLiked] = useState(false);
    const [isApproved, setIsApproved] = useState(post?.isApproved ?? false);
    const [loading, setLoading] = useState(false);

    const bookingModeLabels = {
      manual: "Manual Acceptance",
      auto_date: "Auto Acceptance",
      auto_datetime: "Auto Acceptance",
      auto_event: "Auto Acceptance",
    };

    const formattedPrice = Number(post?.price)?.toLocaleString();
    const formattedCautionFee = Number(post?.cautionFee)?.toLocaleString();
    const formattedOtherFeesPrice = Number(post?.otherFeesPrice)?.toLocaleString();
    const formattedOtherFeesPrice2 = Number(post?.otherFeesPrice2)?.toLocaleString();
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
    
    useEffect(() => {
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
        navigate(`/admin/clientdetails/${post.id}`);
      }else{
        alert('Sign In to access');
        navigate('/?section=signin');
      }
    };

    // Function to delete Post
    const handleDeletePost = async () => {
      if (window.confirm("Are you sure you want to delete this post?")) {
        setLoading(true);
        try {
          // Delete all media from S3
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

          // Delete post from DataStore
          const postToDelete = await DataStore.query(PostModel, post.id);
          if (postToDelete) {
            await DataStore.delete(postToDelete);
            alert("Post deleted successfully.");
            navigate(-1); // Go back to previous page
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

    // Check if post is already liked on mount
    useEffect(() => {
      if (!dbUser) return;
      const checkLikeStatus = async () => {
        const existingLikes = await DataStore.query(
          PostLike,
          (p) => p.and(p => [
            p.postID.eq(post.id),
            p.likedByID.eq(dbUser.id)
          ])
        );
        setLiked(existingLikes.length > 0);
      };
      checkLikeStatus();
    }, [dbUser, post.id]);

    // Toggle like
    const toggleLike = async (e) => {
      e.stopPropagation(); 
      if (!dbUser) {
          alert("You need to be logged in to like a post!");
          return;
      }else if (!dbUser.username) {
          alert('Please fill in your username to proceed.');
          navigate('/admin/editprofile');
      }
  
      try {
          // Check if the user already liked the post
          const existingLikes = await DataStore.query(
              PostLike,
              (p) => p.and(p => [
                  p.postID.eq(post.id),
                  p.likedByID.eq(dbUser.id)
              ])
          );
  
          if (existingLikes.length > 0) {
          // Unlike: delete the like entry
          await Promise.all(existingLikes.map(async (like) => {
              await DataStore.delete(like);
          }));

          setLiked(false);
          } else {
              // Like: create a new like entry
              const savedLike = await DataStore.save(
                  new PostLike({
                      postID: post.id,
                      likedByID: dbUser.id,
                      like: true,
                  })
              );
              
              setLiked(true);  // <-- Update the state
          }
  
      } catch (error) {
          console.error("Error toggling like:", error);
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
    },[post.id]);

    // For Approval
    // useEffect for Approval
    useEffect(() => {
      if (post?.isApproved !== undefined) {
        setIsApproved(post.isApproved);
      }
    }, [post]);

    // toggle function for approval
    const toggleApproval = async (e) => {
      e.stopPropagation();
      try {
        const latestPost = await DataStore.query(PostModel, post.id);
        if (latestPost) {
          await DataStore.save(
            PostModel.copyOf(latestPost, (updated) => {
              updated.isApproved = !latestPost.isApproved;
            })
          );
        }
      } catch (err) {
        console.error("Error toggling isApproved:", err);
      }
    };

    // observe real-time updates for approval
    useEffect(() => {
      if (!post?.id) return;

      const subscription = DataStore.observe(PostModel, post.id).subscribe(
        (msg) => {
          if (msg.opType === "UPDATE") {
            setIsApproved(msg.element.isApproved);
          }
        }
      );

      return () => subscription.unsubscribe();
    }, [post?.id]);

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
          onClick={()=>navigate(`/admin/gallery/${post.id}`)}
        >
          {mediaUris.length > 0 ? (

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="gallerySwiper"
            >
              {mediaUris.map((media, index) => (
                <SwiperSlide key={index}>
                  {media.type === 'video' ? (
                    <div className='pVideoWrapper'>
                      <video 
                        className="pDetailMedia" 
                        controls
                        controlsList="nodownload"
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <source src={media.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>

                      <div 
                        className="pVideoOverlay" 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/gallery/${post.id}`);
                        }}
                      />
                    </div>
                  ) : (
                    <img src={media.url} alt={`Media ${index+1}`} className="image" />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img src={'/defaultImage.png'} alt="Default" className="image" />
          )}

          {/* Subcription label */}
          {post?.isSubscription && <div className='subscribeLabel'>
            <p>Subscribe</p>
          </div>}

          {/* Like Button */}
          <div
            onClick={toggleLike}
            className='postLike'
          >
            {liked ? (
              <GoHeartFill className='heartIcon' color="red" />
            ) : (
              <FaRegHeart className='heartIcon' color="white" />
            )}
          </div>
        </div>

        {/* Switch for Approval */}
        <div className='approvalToggleCon'>
          <span className='approvedTxt'>Approved:</span>
          <Switch
            checked={isApproved}
            onChange={toggleApproval}
            color="primary"
          />
        </div>

                {/* Editbutton */}
        <div
          className='fullEditPostBtnCon'
          onClick={async () => {
            try {
              // Fetch fresh full post from DataStore
              const fullPost = await DataStore.query(PostModel, post.id);

              // Fetch booking options
              const bookingOptions = await DataStore.query(
                BookingPostOptions,
                (c) => c.postID.eq(post.id)
              );

              // Merge into one editable object
              const editablePost = {
                ...fullPost,
                BookingPostOptions: bookingOptions,
              };

              loadExistingPost(editablePost);

              navigate("/admin/vendor_edit_selected_address");
            } catch (err) {
              console.error("Failed to load post for editing:", err);
              alert("Failed to load post for editing");
            }
          }}
        >
          <p>Edit</p>
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
            onClick={()=>navigate(`/admin/reviews_comments/${post.id}`)}
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
        {post?.fullAddress && (
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

        {/* Subcription Enabled or not */}
        {post?.isSubscription ? (
          <>
            <p className='subheader'>
              Post Type:
            </p>
            <p className='bedroom'>
              Subscription
            </p>
          </>
        ): ''}

        {/* Booking Mode */}
        {post?.bookingMode ? (
          <>
            <p className='subheader'>Booking Mode:</p>
            <p className='bedroom'>{bookingModeLabels[post.bookingMode] || "N/A"}</p>
          </>
        ): ''}

        {/* Session Duration */}
        {post?.sessionDuration ? (
          <>
            <p className='subheader'>Session Duration:</p>
            <p className='bedroom'>{formatDuration(post.sessionDuration)}</p>
          </>
        ) : ''}

        {/* Opening Hour */}
        {post?.openingHour ? (
          <>
            <p className='subheader'>Opening Hour:</p>
            <p className='bedroom'>{post.openingHour}</p>
          </>
        ): ''}

        {/* Closing Hour */}
        {post?.closingHour ? (
          <>
            <p className='subheader'>Closing Hour:</p>
            <p className='bedroom'>{post.closingHour}</p>
          </>
        ): ''}

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
          onClick={()=>navigate(`/admin/reviews_comments/${post.id}`)}
        >
          <LastReview post={post} dbUser={dbUser}/>
          <p className='seeAllReviewsTxt'>See all feedbacks</p>
        </button>

        {/* Get In Touch Container */}
        <button className='reserveCon' onClick={handleNavigate}>
            <p className='reserveTxt'>Contact</p>
        </button>

        {/* Delete Btn */}
        <div className="deleteAdminDiv">
          <button 
            className="deleteAdminCon"
            onClick={handleDeletePost}
            disabled={loading}
          >
            <p className="deleteAdminTxt">{loading ? "Deleting..." : "Delete"}</p>
          </button>
        </div>
        
      </div>

    </div>
  )
}

export default Content;
