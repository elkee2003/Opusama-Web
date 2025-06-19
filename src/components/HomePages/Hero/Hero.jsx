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
        "/hero1.jpg",
        "/hero2.jpg",
        "/hero3.jpg",
        "/hero4.jpg",
        "/hero5.jpg",
        "/hero6.jpg",
        "/hero7.jpg",
        "/hero8.jpg",
    ];

    const mediumScreenImages = [
        "/hero1.jpg",
        "/hero2.jpg",
        "/hero3.jpg",
        "/hero4.jpg",
        "/hero5.jpg",
        "/hero6.jpg",
        "/hero7.jpg",
        "/hero8.jpg",
    ]

    const smallScreenImages = [
        'hero1small.jpg',
        'hero2small.jpg',
        'hero3.jpg',
        'hero4small.jpg',
        'hero5.jpg',
        'hero6.jpg',
        "/hero7small.jpg",
        "/hero8small.jpg",
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
        }, 4000); // 4000ms = 4 seconds
    
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

        {/* Write up section */}
        <div className="writeup-container">
            <span>Own</span> The  City<span> Live</span> The Experience
        </div>

        {/* Hero Overlay */}
        <div className="hero-Overlay" />

        {/* Button container */}
        <div className="hero-btn-container">

            {/* <button className="hero-button">
                Download App
            </button> */}
            
            {/* <button className="hero-button" onClick={navigateToSignIn}>
                Sign In
            </button> */}
        </div>

        {/* Search */}
        <div
            className="hero-explore-con"
            onClick={()=>navigate('/clientcontent/home')}
        >
            <p className="hero-explore-txt">Explore</p>
        </div>
    </div>
  )
}

export default Hero
