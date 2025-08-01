// import Layout and Sidebar for client
import React from 'react';
import {Routes, Route } from 'react-router-dom';
import ClientLayout from '../../../components/GeneralGroupClient/ContentLayout'
import HomeClient from '../../../components/GeneralGroupClient/ContentPagesClient/Home/Home';
import Explore from '../../../components/GeneralGroupClient/ContentPagesClient/Explore/Explore';
import Bookings from '../../../components/GeneralGroupClient/ContentPagesClient/Alerts/Alerts';
import ClientCommunity from '../../../components/GeneralGroupClient/ContentPagesClient/Community/Community';
import ClientProfile from '../../../components/GeneralGroupClient/ContentPagesClient/Profile/Profile';
import EditProfile from '../../GeneralGroupClient/ContentPagesClient/Profile/EditProfile/index';
import ReviewClientProfile from '../../GeneralGroupClient/ContentPagesClient/Profile/EditProfile/ReviewProfile';
import ReviewComment from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/DetailedPost/Content/ReviewComment/TopTab';
import DetailResponse from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/DetailedPost/Content/ReviewComment/Content/Response';
import PostGallery from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/PostGallery/PostGallery';
import ClientInfo from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/ShowingProcess/ClientDetails/ClientInfo';
import BookingInfo from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/ShowingProcess/Booking/BookingInfo';
import ReviewClientInfo from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/ShowingProcess/ReviewShowing/ReviewClientInfo';
import BookingFullDetails from '../../GeneralGroupClient/ContentPagesClient/Alerts/Bookings/BookingFullDetails/DetailedBooking';
import ReviewProfile from '../../GeneralGroupClient/ContentPagesClient/Profile/ReviewProfile/ReviewProfile';
import Support from '../../GeneralGroupClient/ContentPagesClient/Profile/ProfileBtnsCom/Support/Support';
import DeleteAccount from '../../GeneralGroupClient/ContentPagesClient/Profile/ProfileBtnsCom/DeleteAccount/DeleteAccount';
import RealtorProfile from '../../GeneralGroupClient/ContentPagesClient/RealtorProfile/RealtorProfile';
import RealtorUserReviews from '../../GeneralGroupClient/ContentPagesClient/RealtorProfile/UsersReview/RealtorRatings';
import CreatePost from '../../GeneralGroupClient/ContentPagesClient/Community/CommunityTabs/CreatePost/CreatePost';
import CommunityDetailedPost from '../../GeneralGroupClient/ContentPagesClient/Community/CommunityTabs/DetailedPost/DetailedPost';
import CommunityPostResponse from '../../GeneralGroupClient/ContentPagesClient/Community/CommunityTabs/DetailedPost/Content/Response/Response';
import PaymentPage from '../../GeneralGroupClient/ContentPagesClient/Payment/Payment';

// SearchPages
import SearchPageHouse from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/Search/Search';
import SearchPageHotel from '../../GeneralGroupClient/ContentPagesClient/Home/HotelComponent/Search/Search';
import SearchPageCommercialSpaces from '../../GeneralGroupClient/ContentPagesClient/Home/CommercialSpacesComponent/Search/Search';
import SearchPageEvents from '../../GeneralGroupClient/ContentPagesClient/Home/EventsComponent/Search/Search';
import SearchPageExperience from '../../GeneralGroupClient/ContentPagesClient/Home/ExperiencesComponent/Search/Search';
import SearchPageFoodDrinks from '../../GeneralGroupClient/ContentPagesClient/Home/FoodDrinksComponent/Search/Search';
import SearchPageVenue from '../../GeneralGroupClient/ContentPagesClient/Home/VenuesComponent/Search/Search';
import SearchPageOfficeSpace from '../../GeneralGroupClient/ContentPagesClient/Home/OfficeSpaceComponent/Search/Search';
import SearchPagePropertySale from '../../GeneralGroupClient/ContentPagesClient/Home/PropertySaleComponent/Search/Search';

// Other DetailedPost
import DetailedPost from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/DetailedPost/DetailedPost';

// Explor DetailedPost
import ExploreDetailedPost from '../../GeneralGroupClient/ContentPagesClient/Explore/ExploreDetailedPost/DetailedPost';

// HotelDetailedPost
import HotelDetailedPost from '../../GeneralGroupClient/ContentPagesClient/Home/HotelComponent/DetailedPost/DetailedPost';

// Experiences DetailedPost 
import ExperiencesDetailedPost from '../../GeneralGroupClient/ContentPagesClient/Home/ExperiencesComponent/DetailedPost/DetailedPost';

// Events DetailedPost 
import EventsDetailedPost from '../../GeneralGroupClient/ContentPagesClient/Home/EventsComponent/DetailedPost/DetailedPost';

// Food & Drinks DetailedPost 
import FoodDrinksDetailedPost from '../../GeneralGroupClient/ContentPagesClient/Home/FoodDrinksComponent/DetailedPost/DetailedPost';

// Venue DetailedPost 
import VenueDetailedPost from '../../GeneralGroupClient/ContentPagesClient/Home/VenuesComponent/DetailedPost/DetailedPost';

const ClientRoutes = () => (
    <Routes>
        <Route path="/" element={<ClientLayout />}>
            {/* Home */}
            <Route path="home" element={<HomeClient />} />

            {/* Explore */}
            <Route path="explore" element={<Explore />} />

            {/* Bookings */}
            <Route path="bookings" element={<Bookings />} />

            {/* Community */}
            <Route path="community" element={<ClientCommunity />} />

            {/* Profile */}
            <Route path="profile" element={<ClientProfile />} />

            {/* Edit Profile */}
            <Route path="editprofile" element={<EditProfile />} />

            {/* Review Edit */}
            <Route path="reviewedit" element={<ReviewClientProfile />} />

            {/* Detailed Post */}
            <Route path="detailedpost/:postId" element={<DetailedPost />} />

            {/* UserReview Post */}
            <Route path="reviews_comments/:postId" element={<ReviewComment />} />

            {/* Response for Detailed Post */}
            <Route path="detail_response_post/:postId" element={<DetailResponse />} />

            {/* Gallery of Post */}
            <Route path="gallery/:postId" element={<PostGallery />} />

            {/* Client Info */}
            <Route path="clientdetails/:postId" element={<ClientInfo/>} />

            {/* Booking for Hotel Info */}
            <Route path="bookingdetails" element={<BookingInfo/>} />

            {/* Review Booking/Showing Info */}
            <Route path="reviewinfo" element={<ReviewClientInfo/>} />

            {/* Booking Full Details */}
            <Route path="bookingdetails/:bookingId" element={<BookingFullDetails/>} />

            {/* Review User Profile */}
            <Route path="reviewprofile" element={<ReviewProfile/>} />

            {/* Support Page */}
            <Route path="support" element={<Support/>} />

            {/* Delete Account */}
            <Route path="deleteaccount" element={<DeleteAccount/>} />

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

            {/* Payment */}
            <Route path="payment" element={<PaymentPage />} />

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
            <Route path='*' element={<div style={{display: 'flex', width:'100vw', marginTop:'200px', paddingLeft:'20%',textAlign:'center', fontSize:'30px', fontWeight:'bold', color:'rgb(192, 191, 191)'}}>404 Not Found</div>}/>
        </Route>
    </Routes>
);

export default ClientRoutes;