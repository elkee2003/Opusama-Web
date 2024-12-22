// import Layout and Sidebar Pages for Realtor
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RealtorLayout from '../../../components/GeneralGroupRealtor/ContentLayout';
import HomeRealtor from '../../../components/GeneralGroupRealtor/ContentPagesRealtor/Home/Home';
import Upload from '../../../components/GeneralGroupRealtor/ContentPagesRealtor/Upload/Upload';
import Alert from '../../../components/GeneralGroupRealtor/ContentPagesRealtor/Alert/Alert';
import RealtorProfile from '../../../components/GeneralGroupRealtor/ContentPagesRealtor/Profile/Profile';

const RealtorRoutes = () => (
    <Routes>
        <Route path="/" element={<RealtorLayout />}>
            <Route path="home" element={<HomeRealtor />} />
            <Route path="upload" element={<Upload />} />
            <Route path="alerts" element={<Alert />} />
            <Route path="profile" element={<RealtorProfile />} />
        </Route>
    </Routes>
);

export default RealtorRoutes;
