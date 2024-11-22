import React from 'react';
import './Offers.css';
import { FaHome, FaLandmark, FaBuilding, FaHotel, FaUserTie } from 'react-icons/fa';

const Offers = () => {
  return (
    <section className="offer-wrapper">
        <div className="paddings innerWidth flexColStart offer-container">
            <h1 className="primaryText">What We Offer</h1>
            <p className="secondaryText">
            Opusama is your trusted platform for finding the perfect property. Whether you're a client looking for properties or an agent showcasing listings, we connect you seamlessly.
            </p>

            {/* For Clients */}
            <div className="offer-section">
                <h2 className="section-title">
                    For Clients
                </h2>
                <div className="offer-items">
                    <div className="offer-item">
                        <FaHome className="offer-icon" />
                        <h3>Houses for Rent</h3>
                        <p>
                            Discover comfortable and affordable rental homes.
                        </p>
                    </div>

                    <div className="offer-item">
                        <FaBuilding className="offer-icon" />
                        <h3>Houses for Sale</h3>
                        <p>
                            Browse through a variety of properties to purchase your dream home.
                        </p>
                    </div>

                    <div className="offer-item">
                        <FaLandmark className="offer-icon" />
                        <h3>Land for Sale</h3>
                        <p>
                            Secure land for your next project or investment.
                        </p>
                    </div>

                    <div className="offer-item">
                        <FaBuilding className="offer-icon" />
                        <h3>Office Spaces</h3>
                        <p>
                            Find professional office spaces to suit your business needs.
                        </p>
                    </div>

                    <div className="offer-item">
                        <FaHotel className="offer-icon" />
                        <h3>Hotels and Short Stays</h3>
                        <p>Book conveniently located hotels and short-stay apartments for your trips.</p>
                    </div>
                </div>

                    {/* For Agents */}
                <div className="offer-section">
                    <h2 className="section-title">For Agents</h2>
                    <div className="offer-items">
                        <div className="offer-item">
                            <FaUserTie className="offer-icon" />
                            <h3>Showcase Listings</h3>
                            <p>
                                Post and manage your property listings effortlessly.
                            </p>
                        </div>

                        <div className="offer-item">
                            <FaUserTie className="offer-icon" />
                            <h3>Connect with Clients</h3>
                            <p>
                                Reach a broader audience and grow your network.
                            </p>
                        </div>

                        <div className="offer-item">
                            <FaUserTie className="offer-icon" />
                            <h3>Build Credibility</h3>
                            <p>
                                Enhance your reputation in the real estate market.
                            </p>
                        </div>
                    </div>
                </div> 
            </div> 
        </div>
    </section>
  );
};

export default Offers;