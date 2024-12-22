import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../../../components/HomePages/HomeScreen'
import SignupClient from '../../../components/HomePages/Signup/SignupClient/Signup';
import SignupRealtor from '../../../components/HomePages/Signup/SignupRealtor/Signup';
import ConfirmEmailClient from '../../../components/HomePages/ConfirmEmail/ConfirmEmailClient/Confirmemail';
import ConfirmEmailRealtor from '../../../components/HomePages/ConfirmEmail/ConfirmEmailRealtor/Confirmemail';
import ForgotPasswordClient from '../../../components/HomePages/ForgotPassword/ForgotPasswordClient/Forgotpassword';
import ForgotPasswordRealtor from '../../../components/HomePages/ForgotPassword/ForgotPasswordRealtor/Forgotpassword';
import ConfirmCodeClient from '../../../components/HomePages/ForgotPassword/ForgotPasswordClient/Confrimcode';
import ConfirmCodeRealtor from '../../../components/HomePages/ForgotPassword/ForgotPasswordRealtor/Confrimcode';

const AuthRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signupclient" element={<SignupClient />} />
        <Route path="/signuprealtor" element={<SignupRealtor />} />
        <Route path="/confirmemailclient" element={<ConfirmEmailClient />} />
        <Route path="/confirmemailrealtor" element={<ConfirmEmailRealtor />} />
        <Route path="/forgotpasswordclient" element={<ForgotPasswordClient />} />
        <Route path="/forgotpasswordrealtor" element={<ForgotPasswordRealtor />} />
        <Route path="/confirmcodeclient" element={<ConfirmCodeClient />} />
        <Route path="/confirmcoderealtor" element={<ConfirmCodeRealtor />} />
    </Routes>
);


export default AuthRoutes;