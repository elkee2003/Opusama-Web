import React from 'react';
import { FaHome, FaBell, FaPlusCircle, FaUser, FaUsers } from 'react-icons/fa';
import { NavLink, useNavigate } from "react-router-dom";

import './Sidebar.css';

function ContentTabsRealtor ({ unreadCount }){

    const navigate = useNavigate();

    return (
        <>
            {/* Sidebar for larger screens */}
            <div className="realtor-sidebar">
                <div 
                    className='realtor-logoClick'
                    onClick={() => navigate('/')}
                >
                    <img 
                        src={'/opusama.png'}
                        alt="logo" 
                        width={150} 
                    />
                </div>
                <nav>
                    <ul>
                        <li>
                            <NavLink 
                                to="/realtorcontent/home"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                               <div className='realtor-nav-container'>
                                    <FaHome /> Home
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/realtorcontent/upload"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='realtor-nav-container'>
                                    <FaPlusCircle /> Upload
                                </div>
                            </NavLink>
                        </li>
                        
                        <li>
                            <NavLink 
                                to="/realtorcontent/community"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='realtor-nav-container'>
                                    <FaUsers /> Community
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink 
                                to="/realtorcontent/alerts"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='realtor-nav-container'>
                                    <FaBell /> Alerts
                                    {unreadCount > 0 && (
                                        <span className="realtorNotification-badge">{unreadCount}</span>
                                    )}
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink 
                                to="/realtorcontent/profile"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='realtor-nav-container'>
                                    <FaUser /> Profile
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Bottom tab navigator for smaller screens */}
            
            <div className="realtor-bottom-nav">
                <NavLink 
                    to="/realtorcontent/home"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaHome /> Home
                </NavLink>

                <NavLink 
                    to="/realtorcontent/upload"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaPlusCircle /> Upload
                </NavLink>

                <NavLink 
                    to="/realtorcontent/community"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaUsers /> Community
                </NavLink>

                <NavLink 
                    to="/realtorcontent/alerts"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <div className='realtorBottomNavBellCon'>
                        <FaBell /> Alerts
                        {unreadCount > 0 && (
                            <span className="realtorNotification-badge">{unreadCount}</span>
                        )}
                    </div>
                </NavLink>

                <NavLink Link 
                    to="/realtorcontent/profile"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaUser /> Profile
                </NavLink>
            </div>
        </>
    )
}

export default ContentTabsRealtor;