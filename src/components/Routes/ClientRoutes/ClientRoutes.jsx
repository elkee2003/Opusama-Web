// import Layout and Sidebar for client
import React from 'react';
import {Routes, Route } from 'react-router-dom';
import ClientLayout from '../../../components/GeneralGroupClient/ContentLayout'
import HomeClient from '../../../components/GeneralGroupClient/ContentPagesClient/Home/Home';
import Explore from '../../../components/GeneralGroupClient/ContentPagesClient/Explore/Explore';
import Bookings from '../../../components/GeneralGroupClient/ContentPagesClient/Bookings/Bookings';
import ClientProfile from '../../../components/GeneralGroupClient/ContentPagesClient/Profile/Profile';
import EditProfile from '../../GeneralGroupClient/ContentPagesClient/Profile/EditProfile/index';
import ReviewClientProfile from '../../GeneralGroupClient/ContentPagesClient/Profile/EditProfile/ReviewProfile';
import DetailedPost from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/DetailedPost/DetailedPost';
import UserReviews from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/DetailedPost/Content/UsersReviews';
import PostGallery from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/PostGallery/PostGallery';
import ClientInfo from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/ShowingProcess/ClientDetails/ClientInfo';
import BookingInfo from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/ShowingProcess/Booking/BookingInfo';
import ReviewClientInfo from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/ShowingProcess/ReviewShowing/ReviewClientInfo';
import BookingFullDetails from '../../GeneralGroupClient/ContentPagesClient/Bookings/BookingFullDetails/BookingFullDetails';
import ReviewProfile from '../../GeneralGroupClient/ContentPagesClient/Profile/ReviewProfile/ReviewProfile';
import Support from '../../GeneralGroupClient/ContentPagesClient/Profile/ProfileBtnsCom/Support/Support';
import DeleteAccount from '../../GeneralGroupClient/ContentPagesClient/Profile/ProfileBtnsCom/DeleteAccount/DeleteAccount';
import RealtorProfile from '../../GeneralGroupClient/ContentPagesClient/RealtorProfile/RealtorProfile';
import RealtorUserReviews from '../../GeneralGroupClient/ContentPagesClient/RealtorProfile/UsersReview/RealtorRatings'

// HotelDetailedPost Import
import HotelDetailedPost from '../../GeneralGroupClient/ContentPagesClient/Home/HotelComponent/DetailedPost/DetailedPost';

const ClientRoutes = () => (
    <Routes>
        <Route path="/" element={<ClientLayout />}>
            {/* Home */}
            <Route path="home" element={<HomeClient />} />

            {/* Explore */}
            <Route path="explore" element={<Explore />} />

            {/* Bookings */}
            <Route path="bookings" element={<Bookings />} />

            {/* Profile */}
            <Route path="profile" element={<ClientProfile />} />

            {/* Edit Profile */}
            <Route path="editprofile" element={<EditProfile />} />

            {/* Review Edit */}
            <Route path="reviewedit" element={<ReviewClientProfile />} />
            <Route path="detailedpost/:postId" element={<DetailedPost />} />
            <Route path="reviews/:postId" element={<UserReviews />} />
            <Route path="gallery/:postId" element={<PostGallery />} />
            <Route path="clientdetails/:postId" element={<ClientInfo/>} />
            <Route path="bookingdetails" element={<BookingInfo/>} />
            <Route path="reviewinfo" element={<ReviewClientInfo/>} />
            <Route path="bookingdetails/:postId" element={<BookingFullDetails/>} />
            <Route path="reviewprofile" element={<ReviewProfile/>} />
            <Route path="support" element={<Support/>} />
            <Route path="deleteaccount" element={<DeleteAccount/>} />
            <Route path="realtorprofile/:realtorId" element={<RealtorProfile/>} />
            <Route path="realtorusersreview/:realtorId" element={<RealtorUserReviews/>} />

            {/* Hotel Route */}
            <Route path="hoteldetailedpost/:postId" element={<HotelDetailedPost />} />
        </Route>
    </Routes>
);

export default ClientRoutes;