import React from 'react';
import { useLocation } from 'react-router-dom';

const useDarkScreen = () => {
    const location = useLocation();
    return ['/signup', '/confirmemail', '/forgotpassword', '/confirmcode'].includes(location.pathname);
};

export default useDarkScreen;