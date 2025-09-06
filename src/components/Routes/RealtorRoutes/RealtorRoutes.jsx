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
import DisplayMedia from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/UploadCom/PickedMedia/DisplayMedia/DisplayMedia';
import ViewMedia from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/UploadCom/PickedMedia/ViewMedia/ViewMedia';
import GooglePlacesAutoCompleteCom from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/UploadCom/Forms/Googleautocomplete';
import Forms from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/UploadCom/Forms/Form';
import UploadProperty from '../../GeneralGroupRealtor/ContentPagesRealtor/Upload/UploadCom/UploadProperty/UploadProperty';
import EditProfile from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/EditProfile/EditProfile';
import ReviewProfile from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/EditProfile/ReviewProfile';
import ProfileOptionsPage from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/MainProfile/ProfileOptions/ProifleOptions';
import UserReviewsProfile from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/UsersReview/UsersReview';
import DeleteAcccount from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/ProfileBtnsCom/DeleteAccount/DeleteAccount';
import Support from '../../GeneralGroupRealtor/ContentPagesRealtor/Profile/ProfileBtnsCom/Support/Support';
import DetailedPost from '../../GeneralGroupRealtor/ContentPagesRealtor/Home/DetailedPost/DetailedPost';
import EditPost from '../../GeneralGroupRealtor/ContentPagesRealtor/Home/EditPost/EditPost';
import ReviewComment from '../../GeneralGroupRealtor/ContentPagesRealtor/Home/DetailedPost/Content/ReviewComment/TopTab';
import DetailResponse from '../../GeneralGroupRealtor/ContentPagesRealtor/Home/DetailedPost/Content/ReviewComment/Content/Response';
import UsersReview from '../../GeneralGroupRealtor/ContentPagesRealtor/Home/DetailedPost/Content/ReviewComment/Content/UsersReviews'
import PostGallery from '../../GeneralGroupRealtor/ContentPagesRealtor/Home/PostGallery/PostGallery';
import PendingDetailedAlert from '../../GeneralGroupRealtor/ContentPagesRealtor/Alert/PendingAlerts/DetailedAlert/DetailedAlert';
import AcceptedDetailedAlert from '../../GeneralGroupRealtor/ContentPagesRealtor/Alert/AcceptedAlerts/DetailedAlert/DetailedAlert';
import CreatePost from '../../GeneralGroupRealtor/ContentPagesRealtor/Community/CommunityTabs/CreatePost/CreatePost';
import CommunityDetailedPost from '../../GeneralGroupRealtor/ContentPagesRealtor/Community/CommunityTabs/DetailedPost/DetailedPost';
import CommunityPostResponse from '../../GeneralGroupRealtor/ContentPagesRealtor/Community/CommunityTabs/DetailedPost/Content/Response/Response';

const RealtorRoutes = () => (
    <Routes>
        <Route path="/" element={<RealtorLayout />}>
            <Route path="home" element={<HomeRealtor />} />

            <Route path="upload" element={<Upload />} />

            <Route path="alerts" element={<Alert />} />

            <Route path="community" element={<RealtorCommunity />} />

            <Route path="profile" element={<RealtorProfile />} />

            <Route path="displaymedia" element={<DisplayMedia />} />

            <Route path="view-media" element={<ViewMedia />} />

            <Route path="selectaddress" element={<GooglePlacesAutoCompleteCom />} />

            <Route path="form" element={<Forms />} />

            <Route path="uploadproperty" element={<UploadProperty />} />
            <Route path="editprofile" element={<EditProfile />} />

            <Route path="reviewprofile" element={<ReviewProfile />} />

            <Route path="profile" element={<EditProfile />} />

            <Route path="profileoptions" element={<ProfileOptionsPage />} />

            <Route path="realtorrating" element={<UserReviewsProfile />} />

            <Route path="deleteaccount" element={<DeleteAcccount />} />

            <Route path="support" element={<Support />} />
            
            <Route path="postdetails/:postId" element={<DetailedPost/>} />

            {/* ReviewComment Post */}
            <Route path="reviews_comments/:postId" element={<ReviewComment />} />

            {/* Response for Detailed Post */}
            <Route path="detail_response_post/:postId" element={<DetailResponse />} />

            <Route path="postreviews/:postId" element={<UsersReview/>} />

            <Route path="postgallery/:postId" element={<PostGallery/>} />

            {/* Edit Post */}
            <Route path="edit_post/:postId" element={<EditPost />} />

            <Route path="pending_details/:alertId" element={<PendingDetailedAlert/>} />

            <Route path="accepted_details/:alertId" element={<AcceptedDetailedAlert/>} />

             {/* Create Post */}
             <Route path="create_post" element={<CreatePost />} />

            {/* Community Detailed Post */}
            <Route path="community_post/:postId" element={<CommunityDetailedPost />} />
            
            {/* Response Community Post */}
            <Route path="response_post/:postId" element={<CommunityPostResponse />} />

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
