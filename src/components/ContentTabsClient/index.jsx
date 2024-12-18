import React from 'react';
import Home from '../ContentGroupClient/Home/Home';
import Explore from '../ContentGroupClient/Explore/Explore';
import Bookings from '../ContentGroupClient/Bookings/Bookings';
import Profile from '../ContentGroupClient/Profile/Profile';

function ContentTabsClient (){
    return (
        <>
            <Home/>
            <Explore/>
            <Bookings/>
            <Profile/>
        </>
    )
}

export default ContentTabsClient;