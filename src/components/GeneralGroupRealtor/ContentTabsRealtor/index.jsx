import React from 'react';
import { FaHome, FaBell, FaPlusCircle, FaUser } from 'react-icons/fa';
import { NavLink, useNavigate } from "react-router-dom";

import './Sidebar.css';

function ContentTabsRealtor (){

    const navigate = useNavigate();

    return (
        <>
            {/* Sidebar for larger screens */}
            <div className="sidebar">
                <div 
                    className='logoClick'
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
                                    <FaPlusCircle /> Upload
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/realtorcontent/alerts"
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                            >
                                <div className='nav-container'>
                                    <FaBell /> Alerts
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
                    <FaPlusCircle /> Upload
                </NavLink>

                <NavLink 
                    to="/realtorcontent/alerts"
                    className={({ isActive }) => isActive ? 'active-link' : ''}
                >
                    <FaBell /> Alerts
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