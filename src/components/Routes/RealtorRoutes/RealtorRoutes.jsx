// import Layout and Sidebar Pages for Realtor
import React from 'react';
import { Routes, Route, Form } from 'react-router-dom';
import RealtorLayout from '../../../components/GeneralGroupRealtor/ContentLayout';
import HomeRealtor from '../../../components/GeneralGroupRealtor/ContentPagesRealtor/Home/Home';
import Upload from '../../../components/GeneralGroupRealtor/ContentPagesRealtor/Upload/SelectMedia';
import Alert from '../../../components/GeneralGroupRealtor/ContentPagesRealtor/Alert/Alert';
import RealtorProfile from '../../../components/GeneralGroupRealtor/ContentPagesRealtor/Profile/Profile';
import DisplayMedia from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/UploadCom/DisplayMedia/DisplayMedia';
import GooglePlacesAutoCompleteCom from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/UploadCom/Forms/Googleautocomplete';
import Forms from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/UploadCom/Forms/Form';
import UploadProperty from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/UploadCom/UploadProperty/UploadProperty';
import EditProfile from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/EditProfile/EditProfile';
import ReviewProfile from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/EditProfile/ReviewProfile';
import ProfileOptionsPage from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/MainProfile/ProfileOptions/ProifleOptions';
import DeleteAcccount from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/ProfileBtnsCom/DeleteAccount/DeleteAccount';
import Support from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/ProfileBtnsCom/Support/Support';
import DetailedPost from '../../GeneralGroupRealtor/ContentPagesRealtor/Home/DetailedPost/DetailedPost';
import UsersReview from '../../GeneralGroupRealtor/ContentPagesRealtor/Home/DetailedPost/Content/UsersReviews';
import PostGallery from '../../GeneralGroupRealtor/ContentPagesRealtor/Home/PostGallery/PostGallery';
import PendingDetailedAlert from '../../GeneralGroupRealtor/ContentPagesRealtor/Alert/PendingAlerts/DetailedAlert/DetailedAlert';
import AcceptedDetailedAlert from '../../GeneralGroupRealtor/ContentPagesRealtor/Alert/AcceptedAlerts/DetailedAlert/DetailedAlert';

const RealtorRoutes = () => (
    <Routes>
        <Route path="/" element={<RealtorLayout />}>
            <Route path="home" element={<HomeRealtor />} />
            <Route path="upload" element={<Upload />} />
            <Route path="alerts" element={<Alert />} />
            <Route path="profile" element={<RealtorProfile />} />
            <Route path="displaymedia" element={<DisplayMedia />} />
            <Route path="selectaddress" element={<GooglePlacesAutoCompleteCom />} />
            <Route path="form" element={<Forms />} />
            <Route path="uploadproperty" element={<UploadProperty />} />
            <Route path="editprofile" element={<EditProfile />} />
            <Route path="reviewprofile" element={<ReviewProfile />} />
            <Route path="profile" element={<EditProfile />} />
            <Route path="profileoptions" element={<ProfileOptionsPage />} />
            <Route path="deleteaccount" element={<DeleteAcccount />} />
            <Route path="support" element={<Support />} />
            
            <Route path="postdetails/:postId" element={<DetailedPost/>} />
            <Route path="postreviews/:postId" element={<UsersReview/>} />
            <Route path="postgallery/:postId" element={<PostGallery/>} />
            <Route path="pending_details/:alertId" element={<PendingDetailedAlert/>} />
            <Route path="accepted_details/:alertId" element={<AcceptedDetailedAlert/>} />

            {/* for invalid route */}
            <Route path='*' element={<div style={{marginTop:'200px',textAlign:'center', fontSize:'30px', fontWeight:'bold', color:'rgb(192, 191, 191)'}}>404 Not Found</div>}/>
        </Route>
    </Routes>
);

export default RealtorRoutes;
