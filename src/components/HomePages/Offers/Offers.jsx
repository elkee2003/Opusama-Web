import React from 'react';
import './Offers.css';
import { FaMapLocationDot } from "react-icons/fa6";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaUserShield } from "react-icons/fa";
import { IoIosBookmark } from "react-icons/io";
import { BsHouseAddFill } from "react-icons/bs";
import { RiUserSearchFill } from "react-icons/ri";
import { TbMessage2 } from "react-icons/tb";
import { FaEye } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";

const Offers = () => {
  return (
    <section
        id='offers'
        className="offer-wrapper"
    >
        <div className="paddings innerWidth flexColStart offer-container">
            <h1 className="primaryText offer-section-header-txt">What We Offer</h1>
            <p className="secondaryText offer-section-txt">
                Opusama is a bridge between discovery and experience — where people and places meet.
            </p>
            

            <div className='offer-section'>
                <div className="offer-items">

                    <div className='offer-image-con'>
                        <img src={'/image1.png'} alt="image" className="offer-image" />
                    </div>

                    {/* For Clients */}
                    <div className='offer-item'>
                        <h2 className="section-title">
                            For Everyday Explorers
                        </h2>

                        <div className='offer-item-points'>

                            <div className='offer-list-con'>
                                <FaMapLocationDot className='offer-icon' />

                                <p>
                                    Discover verified homes, shortlets, student housing, restaurants, spas, pools, clubs, lounges, gyms, and more — all in one place.
                                </p>
                            </div>
                            
                            <div className='offer-list-con'>
                                <FaUserShield className='offer-icon'/>

                                <p>
                                    See authentic reviews, visitor photos, and collections curated by real people like you.
                                </p>
                            </div>

                            <div className='offer-list-con'>
                                <FaPeopleGroup className='offer-icon' />

                                <p>
                                    Ask questions, share experiences, or follow community insights about safety, nightlife, neighborhoods, food and more.
                                </p>
                            </div>
                            <div className='offer-list-con'>
                                <IoIosBookmark className='offer-icon'/>
                                <p>
                                    Create personal collections and bookmarks of where you've been or want to go next.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Agents / Business owners */}
                    <div className='offer-item'>
                        <h2 className="section-title">
                            For Business owners, Realtors, and Venue managers
                        </h2>
                        
                        <div className='offer-item-points'>
                        
                            <div className='offer-list-con'>
                                <BsHouseAddFill className='offer-icon'/>
                                <p>
                                    Showcase your spaces with beautiful listings, visitor-generated reviews, and video experiences.
                                </p>
                            </div>

                            <div className='offer-list-con'>
                                <RiUserSearchFill className='offer-icon'/>
                                <p>
                                    Get discovered by users actively searching for what you offer — not by chance, but by intent.
                                </p>
                            </div>

                            <div className='offer-list-con'>
                                <TbMessage2 className='offer-icon'/>
                                <p>
                                    Receive leads, bookings, and comments from interested customers.
                                </p>
                            </div>

                            <div className='offer-list-con'>
                                <FaEye className='offer-icon'/>
                                <p>
                                    Enjoy enhanced visibility through promoted listings, spotlight ads, or inclusion in curated collections (e.g. “Top 5 Date Spots”).
                                </p>
                            </div>

                            <div className='offer-list-con'>
                                <HiMiniUserGroup className='offer-icon'/>
                                <p>
                                    Tap into community conversations — get tagged, respond to feedback, and build loyalty.
                                </p>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    </section>
  );
};

export default Offers;