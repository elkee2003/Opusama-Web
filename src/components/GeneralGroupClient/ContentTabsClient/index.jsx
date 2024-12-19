import React from 'react';
import { FaHome, FaCompass, FaSearch, FaCalendarAlt, FaCalendarCheck, FaUser } from 'react-icons/fa';
import { Link } from "react-router-dom";
import './Sidebar.css';

function ContentTabsClient (){

    return (
        <>
            {/* Sidebar for larger screens */}
            <div className="sidebar">
                <h2>Opusama</h2>
                <nav>
                    <ul>
                        <li>
                            <Link to="/clientcontent/home">Home</Link>
                        </li>
                        <li>
                            <Link to="/clientcontent/explore">Explore</Link>
                        </li>
                        <li>
                            <Link to="/clientcontent/bookings">Bookings</Link>
                        </li>
                        <li>
                            <Link to="/clientcontent/profile">Profile</Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Bottom tab navigator for smaller screens */}
            <div className="bottom-nav">
                <Link to="/clientcontent/home">Home</Link>
                <Link to="/clientcontent/explore">Explore</Link>
                <Link to="/clientcontent/bookings">Bookings</Link>
                <Link Link to="/clientcontent/profile">Profile</Link>
            </div>
        </>
    )
}

export default ContentTabsClient;