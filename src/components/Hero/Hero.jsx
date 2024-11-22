import React, {useState, useEffect} from 'react';
import Header from '../Header/Header'
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
    ];

    const mediumScreenImages = [
        'hero1medium.png',
        'hero2medium.png',
        'hero3medium.png',
        'hero4medium.png',
    ]

    const smallScreenImages = [
        'hero1small.png',
        'hero2small.png',
        'hero3small.png',
        'hero4small.png',
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

  return (
    <div
    className="hero-background"
    style={{
        backgroundImage: `url(${images[currentImage]})`,
      }} 
    >
        <Header />

        {/* Button container */}
        <div className="hero-btn-container">
            <button className="hero-button">Download App</button>
            <button className="hero-button">Sign In</button>
        </div>
    </div>
  )
}

export default Hero
