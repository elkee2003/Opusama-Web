import React from 'react';
import { useLocation } from 'react-router-dom';

const useDarkScreen = () => {
    const location = useLocation();
    return ['/signup', '/confirm-email', '/forgot-password'].includes(location.pathname);
};

export default useDarkScreen;