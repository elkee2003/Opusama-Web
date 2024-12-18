import React from 'react';
import { useLocation } from 'react-router-dom';

const useDarkScreen = () => {
    const location = useLocation();
    return ['/signupclient', '/signuprealtor', '/confirmemailclient', '/confirmemailrealtor', '/forgotpasswordclient', '/forgotpasswordrealtor', '/confirmcodeclient', '/confirmcoderealtor'].includes(location.pathname);
};

export default useDarkScreen;