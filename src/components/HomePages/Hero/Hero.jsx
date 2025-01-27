import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import "./Hero.css";

// Custom hook to check screen width
const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(window.matchMedia(query).matches);
  
    // useEffect to check media query to display background images
    useEffect(() => {
      const mediaQueryList = window.matchMedia(query);
      const listener = (event) => setMatches(event.matches);
  
      mediaQueryList.addEventListener("change", listener);
      return () => mediaQueryList.removeEventListener("change", listener);
    }, [query]);
  
    return matches;
}

const Hero = () => {

    const navigate = useNavigate();

    const [currentImage, setCurrentImage] = useState(0);

     // Detect screen size using multiple queries
    const isLargeScreen = useMediaQuery("(min-width: 1100px)");
    const isMediumScreen = useMediaQuery("(min-width: 500px) and (max-width: 1099px)");
    const isSmallScreen = useMediaQuery("(min-width: 250px) and (max-width: 499px)");

    const largeScreenImages = [
        "/hero1.png",
        "/hero2.png",
        "/hero3.png",
        "/hero4.png",
        "/hero5.png",
    ];

    const mediumScreenImages = [
        'hero1medium.png',
        'hero2medium.png',
        'hero3medium.png',
        'hero4medium.png',
        'hero5medium.png',
    ]

    const smallScreenImages = [
        'hero1small.png',
        'hero2small.png',
        'hero3small.png',
        'hero4small.png',
        'hero5small.png',
    ]

    // Choose images based on screen size
    let images;
    if (isLargeScreen) {
        images = largeScreenImages;
    } else if (isMediumScreen) {
        images = mediumScreenImages;
    } else if (isSmallScreen) {
        images = smallScreenImages;
    } else {
        images = [];
    }

    // Function to change the image every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentImage((prev) => (prev + 1) % images.length); // Loop through images
        }, 7000); // 5000ms = 7 seconds
    
        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [images.length]);

    const navigateToSignIn = () => {
        const signInElement = document.getElementById('signin');
        if (signInElement) {
            const elementTop = signInElement.getBoundingClientRect().top + window.scrollY - 80; // Adjust for any fixed headers
            window.scrollTo({ top: elementTop, behavior: 'smooth' });
        }
    };

  return (
    <div
        id='hero'
        className="hero-background"
        style={{
            backgroundImage: `url(${images[currentImage]})`,
        }} 
    >

        {/* Button container */}
        <div className="hero-btn-container">

            {/* <button className="hero-button">
                Download App
            </button> */}
            
            <button className="hero-button" onClick={navigateToSignIn}>
                Sign In
            </button>
        </div>

        {/* Search */}
        <div>
            <button 
                className="heroSearchBtn"
                onClick={()=>navigate('/clientcontent/home')}
            >
                <FontAwesomeIcon
                    icon={faSearch}
                    size="lg" 
                    className='searchIcon'
                />

                <p className="heroSearchBtnTxt">
                    {/* Property, Gym, Park... */}
                    Search for properties...
                </p>
            </button>
        </div>
    </div>
  )
}

export default Hero
