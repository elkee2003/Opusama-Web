import React from 'react';
import './Offers.css';
import { FaHome, FaLandmark, FaBuilding, FaHotel, FaUserTie } from 'react-icons/fa';

const Offers = () => {
  return (
    <section
        id='offers'
        className="offer-wrapper"
    >
        <div className="paddings innerWidth flexColStart offer-container">
            <h1 className="primaryText">What We Offer</h1>
            <p className="secondaryText">
                Opusama is your trusted platform for finding the perfect property. Whether you're a client looking for properties or an agent showcasing listings, we connect you seamlessly.
            </p>

            <div className='offer-section'>
                <div className="offer-items">

                    {/* For Clients */}
                    <div className='offer-item'>
                        <h2 className="section-title">
                            For everyday explorers
                        </h2>
                        <p>
                            Discover verified homes, shortlets, student housing, restaurants, spas, pools, clubs, lounges, gyms, and more — all in one place.
                        </p>
                        <p>
                            See authentic reviews, visitor photos, and collections curated by real people like you.
                        </p>
                        <p>
                            Ask questions, share experiences, or follow community insights about safety, nightlife, neighborhoods, food and more.
                        </p>
                        <p>
                            Create personal collections and bookmarks of where you've been or want to go next.
                        </p>
                    </div>

                    {/* Agents / Business owners */}
                    <div className='offer-item'>
                        <h2 className="section-title">
                            For business owners, realtors, and venue managers
                        </h2>
                        <p>
                            Showcase your spaces with beautiful listings, visitor-generated reviews, and 1-minute video experiences.
                        </p>
                        <p>
                            Get discovered by users actively searching for what you offer — not by chance, but by intent.
                        </p>
                        <p>
                            Receive leads, bookings, and comments from interested customers.
                        </p>
                        <p>
                            Enjoy enhanced visibility through promoted listings, spotlight ads, or inclusion in curated collections (e.g. “Top 5 Date Spots”).
                        </p>
                        <p>
                            Tap into community conversations — get tagged, respond to feedback, and build loyalty.
                        </p>
                    </div>
                </div> 
            </div>
        </div>
    </section>
  );
};

export default Offers;