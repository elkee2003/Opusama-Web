import React from 'react';
import { FaHome, FaCompass, FaSearch, FaCalendarAlt, FaCalendarCheck, FaUser } from 'react-icons/fa';
import { NavLink } from "react-router-dom";
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
                            <NavLink 
                                to="/clientcontent/home"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='nav-container'>
                                <FaHome /> Home
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/clientcontent/explore"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='nav-container'>
                                    <FaSearch /> Explore
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/clientcontent/bookings"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='nav-container'>
                                    <FaCalendarAlt /> Bookings
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/clientcontent/profile"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='nav-container'>
                                    <FaUser /> Profile
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Bottom tab navigator for smaller screens */}
            <div className="bottom-nav">
                <NavLink 
                    to="/clientcontent/home"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaHome /> Home
                </NavLink>

                <NavLink 
                    to="/clientcontent/explore"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaSearch /> Explore
                </NavLink>

                <NavLink 
                    to="/clientcontent/bookings"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaCalendarAlt /> Bookings
                </NavLink>

                <NavLink Link 
                    to="/clientcontent/profile"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaUser /> Profile
                </NavLink>
            </div>
        </>
    )
}

export default ContentTabsClient;