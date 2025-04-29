import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useProfileContext } from '../../../../../../../../Providers/ClientProvider/ProfileProvider';
import { useBookingShowingContext } from '../../../../../../../../Providers/ClientProvider/BookingShowingProvider';
import { DataStore } from "aws-amplify/datastore";
import { PostReview, Booking, Notification } from '../../../../../../../models';
import '../../../TabStyles/Content.css';

const ReviewSection = ({ post, dbUser }) => {
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const { realtorID } = useProfileContext();
  const {propertyDetails} = useBookingShowingContext();

  // Function to handle rating click
  const handleRating = (rating) => setUserRating(rating);

  // Save or update review of dbUser
  const saveReview = async () => {
    if (!review || userRating === 0) {
      alert("Incomplete", "Please provide a rating and review.");
      return;
    }

    setLoading(true);
    try {
      const existingReview = await DataStore.query(PostReview, (c) =>
        c.and((c) => [
          c.postID.eq(post?.id),
          c.userID.eq(dbUser?.id),
        ])
      );

      if (existingReview.length > 0) {
        await DataStore.save(
          PostReview.copyOf(existingReview[0], (updated) => {
            updated.rating = userRating;
            updated.review = review;
          })
        );
        alert("Updated", "Your review has been updated.");
      } else {
        reviewRecord = await DataStore.save(
          new PostReview({
            postID: post?.id,
            userID: dbUser?.id,
            realtorID,
            rating: userRating,
            review: review,
          })
        );
        alert("Submitted", "Your review has been submitted.");
      }

      await DataStore.save(
        new Notification({
          creatorID: dbUser?.id,
          recipientID:realtorID,
          recipientType: 'REVIEW_REALTOR_POST',
          type: "REVIEW",
          entityID: reviewRecord.id,
          message: `Someone rated and reviewed your listing (${propertyDetails?.propertyType} - ${propertyDetails?.type})`,
          read: false,
        })
      );

      setUserRating(0);
      setReview("");
    } catch (e) {
      console.error("Error saving review", e);
      alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dbUser's review
  const fetchUserReview = async () => {
    try {
      const userReview = await DataStore.query(PostReview, (c) =>
        c.and((c) => [c.postID.eq(post.id), c.userID.eq(dbUser?.id)])
      );
      if (userReview.length > 0) {
        setUserRating(userReview[0].rating);
        setReview(userReview[0].review);
      }
    } catch (e) {
      console.error("Error fetching user review", e);
    }
  };

  // useEffect for Dbuser already existing review
  useEffect(() => {
    fetchUserReview();
  }, [post?.id, dbUser?.id]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Fetch bookings for the current user
      const userBookings = await DataStore.query(Booking, (booking) =>
        booking.and((b) => [b.PostID.eq(post?.id), b.userID.eq(dbUser?.id)])
      );

      setBookings(userBookings);
    } catch (e) {
      alert('Error fetching bookings', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [post?.id, dbUser?.id]);

  // useEffect for realtime update
  useEffect(() => {
    if (!post) return;

    const subscription = DataStore.observe(PostReview).subscribe(({ opType, element }) => {
      if (element.postID === post.id) { // Ensure it's for the current post
        if (opType === 'INSERT' || opType === 'UPDATE' || opType === 'DELETE') {
          fetchUserReview();
          fetchBookings();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [post.id]);

  const allowedStatuses = ['VIEWING', 'CHECKED_IN', 'VISITING', 'VIEWED', 'CHECKED_OUT', 'VISITED', 'SOLD', 'REMOVED_CLIENT', 'REMOVED_REALTOR'];
  const canReview = bookings.some((booking) => allowedStatuses.includes(booking.status));

  return (
    <div>
      {canReview && (
        <div>
          {/* dbUser Rating */}
          <div className="rateContainer">
            <p className="rateTxt">Rate</p>
            <div className="starContainer">
              {[1, 2, 3, 4, 5].map((index) => (
                <button key={index} onClick={() => handleRating(index)}>
                  {index <= userRating ? (
                    <FaStar color="#07021f" size={24} />
                  ) : (
                    <FaRegStar color="#07021f" size={24} />
                  )}
                </button>
              ))}
            </div>
            <textarea
              className="reviewInput"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write Review"
              rows="4"
            />
          </div>

          <button
            className="submitReviewBtn"
            onClick={saveReview}
            disabled={loading}
          >
            <span className="submitReviewText">
              {loading ? "Submitting..." : "Submit Review"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;