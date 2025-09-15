// import Layout and Sidebar for client
import React from 'react';
import {Routes, Route } from 'react-router-dom';
import "./AdminRoutes.css"
import AdminLayout from '../../GeneralGroupAdmin/ContentLayout'
import HomeAdmin from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Home';
import Explore from '../../GeneralGroupAdmin/ContentPagesAdmin/Explore/Explore';
import Bookings from '../../GeneralGroupAdmin/ContentPagesAdmin/Alerts/Alerts';
import AdminCommunity from '../../GeneralGroupAdmin/ContentPagesAdmin/Community/Community';
import AdminProfile from '../../GeneralGroupAdmin/ContentPagesAdmin/Profile/Profile';
import EditProfile from '../../GeneralGroupAdmin/ContentPagesAdmin/Profile/EditProfile/index';
import ReviewAdminProfile from '../../GeneralGroupAdmin/ContentPagesAdmin/Profile/EditProfile/ReviewProfile';
import ReviewComment from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/HouseRentComponent/DetailedPost/Content/ReviewComment/TopTab';
import ProfileOptionsPage from '../../GeneralGroupAdmin/ContentPagesAdmin/Profile/MainProfile/ProfileOptionBtns/ProfileOptionsBtn';
import DetailResponse from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/HouseRentComponent/DetailedPost/Content/ReviewComment/Content/Response';
import PostGallery from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/HouseRentComponent/PostGallery/PostGallery';

import BookingFullDetails from '../../GeneralGroupAdmin/ContentPagesAdmin/Alerts/Bookings/BookingFullDetails/DetailedBooking';
import ReviewProfile from '../../GeneralGroupAdmin/ContentPagesAdmin/Profile/ReviewProfile/ReviewProfile';

import RealtorProfile from '../../GeneralGroupAdmin/ContentPagesAdmin/RealtorProfile/RealtorProfile';
import RealtorUserReviews from '../../GeneralGroupAdmin/ContentPagesAdmin/RealtorProfile/UsersReview/RealtorRatings';

import CreatePost from '../../GeneralGroupAdmin/ContentPagesAdmin/Community/CommunityTabs/CreatePost/CreatePost';

import CommunityDetailedPost from '../../GeneralGroupClient/ContentPagesClient/Community/CommunityTabs/DetailedPost/DetailedPost';
import CommunityPostResponse from '../../GeneralGroupClient/ContentPagesClient/Community/CommunityTabs/DetailedPost/Content/Response/Response';
import UserProfile from '../../GeneralGroupClient/ContentPagesClient/Community/UserProfile/UserProfile';

// SearchPages
import SearchPageHouse from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/HouseRentComponent/Search/Search';
import SearchPageHotel from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/HotelComponent/Search/Search';
import SearchPageCommercialSpaces from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/CommercialSpacesComponent/Search/Search';
import SearchPageEvents from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/EventsComponent/Search/Search';
import SearchPageExperience from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/ExperiencesComponent/Search/Search';
import SearchPageFoodDrinks from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/FoodDrinksComponent/Search/Search';
import SearchPageVenue from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/VenuesComponent/Search/Search';
import SearchPageOfficeSpace from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/OfficeSpaceComponent/Search/Search';
import SearchPagePropertySale from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/PropertySaleComponent/Search/Search';

// Other DetailedPost
import DetailedPost from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/HouseRentComponent/DetailedPost/DetailedPost';

// Explore DetailedPost
import ExploreDetailedPost from '../../GeneralGroupAdmin/ContentPagesAdmin/Explore/ExploreDetailedPost/DetailedPost';

// HotelDetailedPost
import HotelDetailedPost from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/HotelComponent/DetailedPost/DetailedPost';

// Experiences DetailedPost 
import ExperiencesDetailedPost from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/ExperiencesComponent/DetailedPost/DetailedPost';

// Events DetailedPost 
import EventsDetailedPost from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/EventsComponent/DetailedPost/DetailedPost';

// Food & Drinks DetailedPost 
import FoodDrinksDetailedPost from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/FoodDrinksComponent/DetailedPost/DetailedPost';

// Venue DetailedPost 
import VenueDetailedPost from '../../GeneralGroupAdmin/ContentPagesAdmin/Home/Approved/VenuesComponent/DetailedPost/DetailedPost';

const AdminRoutes = () => (
    <Routes>
        <Route path="/" element={<AdminLayout />}>
            {/* Approved */}
            <Route path="home" element={<HomeAdmin />} />

            {/* Explore */}
            <Route path="explore" element={<Explore />} />

            {/* Bookings */}
            <Route path="bookings" element={<Bookings />} />

            {/* Community */}
            <Route path="community" element={<AdminCommunity />} />

            {/* Profile */}
            <Route path="profile" element={<AdminProfile />} />

            {/* Edit Profile */}
            <Route path="editprofile" element={<EditProfile />} />

            {/* Profile Options */}
            <Route path="profileoptions" element={<ProfileOptionsPage />} />

            {/* Review Edit */}
            <Route path="reviewedit" element={<ReviewAdminProfile />} />

            {/* Detailed Post */}
            <Route path="detailedpost/:postId" element={<DetailedPost />} />

            {/* UserReview Post */}
            <Route path="reviews_comments/:postId" element={<ReviewComment />} />

            {/* Response for Detailed Post */}
            <Route path="detail_response_post/:postId" element={<DetailResponse />} />

            {/* Gallery of Post */}
            <Route path="gallery/:postId" element={<PostGallery />} />

            {/* Booking Full Details */}
            <Route path="bookingdetails/:bookingId" element={<BookingFullDetails/>} />

            {/* Review User Profile */}
            <Route path="reviewprofile" element={<ReviewProfile/>} />

            {/* Realtor Profile */}
            <Route path="realtorprofile/:realtorId" element={<RealtorProfile/>} />

            {/* Realtor Users Reviews */}
            <Route path="realtorusersreview/:realtorId" element={<RealtorUserReviews/>} />

            {/* Create Post */}
            <Route path="create_post" element={<CreatePost />} />

            {/* Community Detailed Post */}
            <Route path="community_post/:postId" element={<CommunityDetailedPost />} />

            {/* Response Community Post */}
            <Route path="response_post/:postId" element={<CommunityPostResponse />} />

            {/* Community UserProfile */}
            <Route path="userprofile/:userId" element={<UserProfile />} />


            {/* Search */}
            {/* House Search */}
            <Route path="search_house" element={<SearchPageHouse />} />

            {/* Hotel Search */}
            <Route path="search_hotel" element={<SearchPageHotel />} />

            {/* Experience Search */}
            <Route path="search_experience" element={<SearchPageExperience />} />

            {/* Events Search */}
            <Route path="search_events" element={<SearchPageEvents />} />

            {/* CommercialSpace Search */}
            <Route path="search_commercial_spaces" element={<SearchPageCommercialSpaces />} />

            {/* Food&Drinks Search */}
            <Route path="search_food_drinks" element={<SearchPageFoodDrinks />} />

            {/* Venue Search */}
            <Route path="search_venue" element={<SearchPageVenue />} />

            {/* Office Space Search */}
            <Route path="search_office_space" element={<SearchPageOfficeSpace />} />

            {/* Property Sale Search */}
            <Route path="search_property_sale" element={<SearchPagePropertySale />} />


            {/* Explore Detailed Route */}
            <Route path="exploredetailedpost/:postId" element={<ExploreDetailedPost />} />

            {/* Hotel Detailed Route */}
            <Route path="hoteldetailedpost/:postId" element={<HotelDetailedPost />} />

            {/* Experiences Detailed Route */}
            <Route path="experience_detailedpost/:postId" element={<ExperiencesDetailedPost />} />

            {/* Events Detailed Route */}
            <Route path="events_detailedpost/:postId" element={<EventsDetailedPost />} />

            {/* Food&Drinks Detailed Route */}
            <Route path="food_drinks_detailedpost/:postId" element={<FoodDrinksDetailedPost />} />

            {/* Venue Detailed Route */}
            <Route path="venue_detailedpost/:postId" element={<VenueDetailedPost />} />

            {/* for invalid route */}
            <Route 
                path='*' 
                element={
                    <div className='adminError404Con'>
                        <p>404 Not Found</p>
                    </div>
                }
            />
        </Route>
    </Routes>
);

export default AdminRoutes;