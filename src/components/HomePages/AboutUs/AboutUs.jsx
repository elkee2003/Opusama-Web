import React from 'react';
import './AboutUs.css'

const AboutUs = () => {
  return (
    <section
      id='aboutUs'
      className="aboutUs-wrapper"
    >
        <div className="paddings innerWidth flexCenter aboutUs-container">
            <div className="flexColStart">
                <span className="primaryText">About Us</span>
                <span className="secondaryText bold-txt">
                    From verified homes and shortlets to spas, clubs, swimming pools, and student housing — Opusama helps you explore, compare, and connect with your city like never before.
                </span>
                <span className="secondaryText">
                    Whether you're hunting for a home, planning a night out, moving to a new area, or just curious about where to go next — Opusama gives you <span className='bold-txt'>real listings, real reviews, and real visuals from real people.</span>
                </span>
                <span className="secondaryText">
                    It's a city compass built for the bold: a lifestyle-tech platform that <span className='bold-txt'> lets you discover experiences and places through the eyes of the community </span>— not just marketers.
                </span>
                <span className="secondaryText">
                    We're building an <span className='bold-txt'>ecosystem of trust</span>, where urban discovery isn't just about where to go, but <span className='bold-txt'>why it matters</span>.
                </span>

                <div>
                    <p className="secondaryText">• Launched in Africa. Built to scale globally.</p>
                    <p className="secondaryText">• Fueled by community reviews, photos, collections, and ratings.</p>
                    <p className="secondaryText">• Curated for city living — from rooftops to rentals to real talk.</p>
                    <p className="secondaryText">Opusama is where lifestyle meets location. Own the City. Live the Experience.</p>
                </div>
            </div>
        </div>
    </section>
  );
};

export default AboutUs;