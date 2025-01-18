// import Layout and Sidebar for client
import React from 'react';
import {Routes, Route } from 'react-router-dom';
import ClientLayout from '../../../components/GeneralGroupClient/ContentLayout'
import HomeClient from '../../../components/GeneralGroupClient/ContentPagesClient/Home/Home';
import Explore from '../../../components/GeneralGroupClient/ContentPagesClient/Explore/Explore';
import Bookings from '../../../components/GeneralGroupClient/ContentPagesClient/Bookings/Bookings';
import ClientProfile from '../../../components/GeneralGroupClient/ContentPagesClient/Profile/Profile';
import DetailedPost from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/DetailedPost/DetailedPost';
import UserReviews from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/DetailedPost/Content/UsersReviews';
import PostGallery from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/PostGallery/PostGallery';
import ClientInfo from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/ShowingProcess/ClientDetails/ClientInfo';
import BookingInfo from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/ShowingProcess/Booking/BookingInfo';
import ReviewClientInfo from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/ShowingProcess/ReviewShowing/ReviewClientInfo';

// HotelDetailedPost Import
import HotelDetailedPost from '../../GeneralGroupClient/ContentPagesClient/Home/HotelComponent/DetailedPost/DetailedPost';

const ClientRoutes = () => (
    <Routes>
        <Route path="/" element={<ClientLayout />}>
            <Route path="home" element={<HomeClient />} />
            <Route path="explore" element={<Explore />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="profile" element={<ClientProfile />} />
            <Route path="detailedpost/:postId" element={<DetailedPost />} />
            <Route path="reviews/:postId" element={<UserReviews />} />
            <Route path="gallery/:postId" element={<PostGallery />} />
            <Route path="clientdetails/:postId" element={<ClientInfo/>} />
            <Route path="bookingdetails" element={<BookingInfo/>} />
            <Route path="reviewinfo" element={<ReviewClientInfo/>} />

            {/* Hotel Route */}
            <Route path="hoteldetailedpost/:postId" element={<HotelDetailedPost />} />
        </Route>
    </Routes>
);

export default ClientRoutes;