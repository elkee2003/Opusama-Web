// import Layout and Sidebar Pages for Realtor
import React from 'react';
import { Routes, Route, Form } from 'react-router-dom';
import './RealtorRoutes.css';
import RealtorLayout from '../../../components/GeneralGroupRealtor/ContentLayout';
import HomeRealtor from '../../../components/GeneralGroupRealtor/ContentPagesRealtor/Home/Home';
import Upload from '../../../components/GeneralGroupRealtor/ContentPagesRealtor/Upload/SelectMedia';
import Alert from '../../../components/GeneralGroupRealtor/ContentPagesRealtor/Alert/Alert';
import RealtorCommunity from '../../../components/GeneralGroupRealtor/ContentPagesRealtor/Community/Community'
import RealtorProfile from '../../../components/GeneralGroupRealtor/ContentPagesRealtor/Profile/Profile';

// Upload Routes
import DisplayMedia from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/UploadCom/PickedMedia/DisplayMedia/DisplayMedia';
import ViewMedia from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/UploadCom/PickedMedia/ViewMedia/ViewMedia';
import UploadAddressPage from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/UploadCom/Forms/UploadAddressPage';
import Forms from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/UploadCom/Forms/Form';
import UploadProperty from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/UploadCom/UploadProperty/UploadProperty';

// Edit Post Routes
import EditDisplayMedia from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/EditPost/EditPickedMedia/DisplayMedia/DisplayMedia';
import EditViewMedia from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/EditPost/EditPickedMedia/ViewMedia/ViewMedia';
import EditUploadAddressPage from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/EditPost/EditForms/Googleautocomplete';
import EditForms from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/EditPost/EditForms/Form';
import EditUploadProperty from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/EditPost/EditUploadProperty/UploadProperty';

// Other Routes
import EditProfile from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/EditProfile/EditProfile';
import ReviewProfile from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/EditProfile/ReviewProfile';
import ProfileOptionsPage from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/MainProfile/ProfileOptions/ProifleOptions';
import UserReviewsProfile from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/UsersReview/UsersReview';
import DeleteAcccount from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/ProfileBtnsCom/DeleteAccount/DeleteAccount';
import Support from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/ProfileBtnsCom/Support/Support';
import PropertyDetails from '../../GeneralGroupRealtor/ContentPagesRealtor/Home/PropertyDetails/PropertyDetails';
import EditPost from '../../GeneralGroupRealtor/ContentPagesRealtor/Home/EditPost/EditPost';
import ReviewComment from '../../GeneralGroupRealtor/ContentPagesRealtor/Home/PropertyDetails/DetailedPost/Content/ReviewComment/TopTab';
import DetailResponse from '../../GeneralGroupRealtor/ContentPagesRealtor/Home/PropertyDetails/DetailedPost/Content/ReviewComment/Content/Response';
import UsersReview from '../../GeneralGroupRealtor/ContentPagesRealtor/Home/PropertyDetails/DetailedPost/Content/ReviewComment/Content/UsersReviews'
import PostGallery from '../../GeneralGroupRealtor/ContentPagesRealtor/Home/PostGallery/PostGallery';
import PendingDetailedAlert from '../../GeneralGroupRealtor/ContentPagesRealtor/Alert/PendingAlerts/DetailedAlert/DetailedAlert';
import AcceptedDetailedAlert from '../../GeneralGroupRealtor/ContentPagesRealtor/Alert/AcceptedAlerts/DetailedAlert/DetailedAlert';
import CreatePost from '../../GeneralGroupRealtor/ContentPagesRealtor/Community/CommunityTabs/CreatePost/CreatePost';
import CommunityDetailedPost from '../../GeneralGroupRealtor/ContentPagesRealtor/Community/CommunityTabs/DetailedPost/DetailedPost';
import CommunityPostResponse from '../../GeneralGroupRealtor/ContentPagesRealtor/Community/CommunityTabs/DetailedPost/Content/Response/Response';
import UserProfile from '../../GeneralGroupRealtor/ContentPagesRealtor/Community/UserProfile/UserProfile';
import VendorScanGenerator from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/ProfileBtnsCom/VendorScanGenerator/VendorScanGenerator';
import ScannerPage from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/ProfileBtnsCom/ScannerPage/ScannerPage';

const RealtorRoutes = () => (
    <Routes>
        <Route path="/" element={<RealtorLayout />}>
            <Route path="home" element={<HomeRealtor />} />

            <Route path="upload" element={<Upload />} />

            <Route path="alerts" element={<Alert />} />

            <Route path="community" element={<RealtorCommunity />} />

            <Route path="profile" element={<RealtorProfile />} />

            {/* Upload Post Routes */}
            <Route path="displaymedia" element={<DisplayMedia />} />

            <Route path="view-media" element={<ViewMedia />} />

            <Route path="selectaddress" element={<UploadAddressPage/>} />

            <Route path="form" element={<Forms />} />

            <Route path="uploadproperty" element={<UploadProperty />} />

            {/* Edit Post Routes */}
            <Route path="edit_display_media" element={<EditDisplayMedia />} />

            <Route path="edit_view_media" element={<EditViewMedia />} />

            <Route path="edit_selectaddress" element={<EditUploadAddressPage />} />

            <Route path="edit_form" element={<EditForms />} />

            <Route path="edit_uploaded_post" element={<EditUploadProperty />} />

            {/* Normal Post Routes */}
            <Route path="editprofile" element={<EditProfile />} />

            <Route path="reviewprofile" element={<ReviewProfile />} />

            <Route path="profile" element={<EditProfile />} />

            <Route path="profileoptions" element={<ProfileOptionsPage />} />

            <Route path="realtorrating" element={<UserReviewsProfile />} />

            <Route path="deleteaccount" element={<DeleteAcccount />} />

            <Route path="support" element={<Support />} />
            
            <Route path="postdetails/:postId" element={<PropertyDetails/>} />

            {/* ReviewComment Post */}
            <Route path="reviews_comments/:postId" element={<ReviewComment />} />

            {/* Response for Detailed Post */}
            <Route path="detail_response_post/:postId" element={<DetailResponse />} />

            <Route path="postreviews/:postId" element={<UsersReview/>} />

            <Route path="postgallery/:postId" element={<PostGallery/>} />

            {/* Edit Post Shallow*/}
            <Route path="edit_post/:postId" element={<EditPost />} />

            <Route path="pending_details/:alertId" element={<PendingDetailedAlert/>} />

            <Route path="accepted_details/:alertId" element={<AcceptedDetailedAlert/>} />

             {/* Create Post */}
             <Route path="create_post" element={<CreatePost />} />

            {/* Community Detailed Post */}
            <Route path="community_post/:postId" element={<CommunityDetailedPost />} />
            
            {/* Response Community Post */}
            <Route path="response_post/:postId" element={<CommunityPostResponse />} />

            {/* Community UserProfile */}
            <Route path="userprofile/:userId" element={<UserProfile />} />

            {/* Vendor Scan Generator */}
            <Route path="vendor_scanner_generator" element={<VendorScanGenerator />} />
            <Route path="scanner" element={<ScannerPage />} />

            {/* for invalid route */}
            <Route 
                path='*' 
                element={
                    <div className='realtorError404Con'>
                        <p>404 Not Found</p>
                    </div>
                }
            />
        </Route>
    </Routes>
);

export default RealtorRoutes;
