// import Layout and Sidebar for client
import React from 'react';
import {Routes, Route } from 'react-router-dom';
import ClientLayout from '../../../components/GeneralGroupClient/ContentLayout'
import HomeClient from '../../../components/GeneralGroupClient/ContentPagesClient/Home/Home';
import Explore from '../../../components/GeneralGroupClient/ContentPagesClient/Explore/Explore';
import Bookings from '../../../components/GeneralGroupClient/ContentPagesClient/Bookings/Bookings';
import ClientProfile from '../../../components/GeneralGroupClient/ContentPagesClient/Profile/Profile';
import DetailedPost from '../../GeneralGroupClient/ContentPagesClient/Home/HouseRentComponent/DetailedPost/DetailedPost';

const ClientRoutes = () => (
    <Routes>
        <Route path="/" element={<ClientLayout />}>
            <Route path="home" element={<HomeClient />} />
            <Route path="explore" element={<Explore />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="profile" element={<ClientProfile />} />
            <Route path="detailedpost/:postId" element={<DetailedPost />} />
        </Route>
    </Routes>
);

export default ClientRoutes;