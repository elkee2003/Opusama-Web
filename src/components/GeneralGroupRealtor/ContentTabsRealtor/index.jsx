import React from 'react';
import { FaHome, FaCompass, FaSearch, FaCalendarAlt, FaCalendarCheck, FaUser } from 'react-icons/fa';
import { NavLink } from "react-router-dom";
import './Sidebar.css';

function ContentTabsRealtor (){

    return (
        <>
            {/* Sidebar for larger screens */}
            <div className="sidebar">
                <h2>Opusama</h2>
                <nav>
                    <ul>
                        <li>
                            <NavLink 
                                to="/realtorcontent/home"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                               <div className='nav-container'>
                                    <FaHome /> Home
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/realtorcontent/upload"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='nav-container'>
                                    <FaSearch /> Upload
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/realtorcontent/alerts"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='nav-container'>
                                    <FaCalendarAlt /> Alerts
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/realtorcontent/profile"
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
                    to="/realtorcontent/home"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaHome /> Home
                </NavLink>

                <NavLink 
                    to="/realtorcontent/upload"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaSearch /> Upload
                </NavLink>

                <NavLink 
                    to="/realtorcontent/alerts"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaCalendarAlt /> Alerts
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