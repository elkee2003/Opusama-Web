import React from 'react';
import { FaHome, FaBell, FaCompass, FaSearch, FaUser, FaUsers } from 'react-icons/fa';
import { NavLink, useNavigate } from "react-router-dom";
import './Sidebar.css';

function ContentTabsClient ({ unreadCount }){

    const navigate = useNavigate();

    return (
        <>
            {/* Sidebar for larger screens */}
            <div className="client-sidebar">
                {/* <h2>Opusama</h2> */}
                <div 
                    className='client-logoClickClient'
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
                            {/* Approved */}
                            <NavLink 
                                to="/admin/home"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='client-nav-container'>
                                <FaHome /> Approved
                                </div>
                            </NavLink>
                        </li>


                        {/* Explore */}
                        <li>
                            <NavLink 
                                to="/admin/explore"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='client-nav-container'>
                                    <FaSearch /> Explore
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/admin/community"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='client-nav-container'>
                                    <FaUsers /> Community
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink 
                                to="/admin/bookings"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='client-nav-container'>
                                    <FaBell /> Alerts
                                    {unreadCount > 0 && (
                                        <span className="clientNotification-badge">{unreadCount}</span>
                                    )}
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink 
                                to="/admin/profile"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='client-nav-container'>
                                    <FaUser /> Profile
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Bottom tab navigator for smaller screens */}
            <div className="client-bottom-nav">
                {/* Approved */}
                <NavLink 
                    to="/admin/home"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaHome /> Approved
                </NavLink>

                {/* Explore */}
                <NavLink 
                    to="/admin/explore"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaSearch /> Explore
                </NavLink>

                <NavLink 
                    to="/admin/community"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaUsers /> Community
                </NavLink>

                <NavLink 
                    to="/admin/bookings"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <div className='clientBottomNavBellCon'>
                    <FaBell /> Alerts
                        {unreadCount > 0 && (
                            <span className="clientNotification-badge">{unreadCount}</span>
                        )}
                    </div>
                </NavLink>

                <NavLink Link 
                    to="/admin/profile"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaUser /> Profile
                </NavLink>
            </div>
        </>
    )
}

export default ContentTabsClient;