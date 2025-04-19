import React from 'react';
import { FaHome, FaBell, FaCompass, FaSearch, FaUser, FaUsers } from 'react-icons/fa';
import { NavLink, useNavigate } from "react-router-dom";
import './Sidebar.css';

function ContentTabsClient (){

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
                            <NavLink 
                                to="/clientcontent/home"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='client-nav-container'>
                                <FaHome /> Home
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/clientcontent/explore"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='client-nav-container'>
                                    <FaSearch /> Explore
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/clientcontent/community"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='client-nav-container'>
                                    <FaUsers /> Community
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink 
                                to="/clientcontent/bookings"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='client-nav-container'>
                                    <FaBell /> Alerts
                                </div>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink 
                                to="/clientcontent/profile"
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
                    to="/clientcontent/community"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaUsers /> Community
                </NavLink>

                <NavLink 
                    to="/clientcontent/bookings"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaBell /> Alerts
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