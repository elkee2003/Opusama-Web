import React, {useState, useEffect, useMemo} from 'react';
import { useNavigate } from "react-router-dom";
import "./Hero.css";

// Custom hook to get screen size category
const useScreenCategory = () => {
  const [category, setCategory] = useState("large");

  useEffect(() => {
    const checkCategory = () => {
      const width = window.innerWidth;
      if (width >= 1100) setCategory("large");
      else if (width >= 500) setCategory("medium");
      else setCategory("small");
    };

    checkCategory();
    window.addEventListener("resize", checkCategory);
    return () => window.removeEventListener("resize", checkCategory);
  }, []);

  return category;
};


const Hero = () => {

    const navigate = useNavigate();

    const [currentImage, setCurrentImage] = useState(0);

    const screenCategory = useScreenCategory();

    const imageSets = useMemo(() => ({
        large: [
        "/hero1.jpg", "/hero2.jpg", "/hero3.jpg", "/hero4.jpg",
        "/hero5.jpg", "/hero6.jpg", "/hero7.jpg", "/hero8.jpg",
        ],
        medium: [
        "/hero1.jpg", "/hero2.jpg", "/hero3.jpg", "/hero4.jpg",
        "/hero5.jpg", "/hero6.jpg", "/hero7.jpg", "/hero8.jpg",
        ],
        small: [
        "hero1small.jpg", "hero2small.jpg", "hero3.jpg", "hero4small.jpg",
        "hero5.jpg", "hero6.jpg", "/hero7small.jpg", "/hero8small.jpg",
        ],
    }), []);

    const images = imageSets[screenCategory] || [];

    // Preload images on category change only
    useEffect(() => {
        images.forEach((src) => {
        const img = new Image();
        img.src = src;
        });
    }, [screenCategory]);

    // Background image changer
    useEffect(() => {
        let isMounted = true;

        const changeImage = () => {
        const nextIndex = (currentImage + 1) % images.length;
        const img = new Image();
        img.src = images[nextIndex];
        img.onload = () => {
            if (isMounted) setCurrentImage(nextIndex);
        };
        };

        const interval = setInterval(changeImage, 4000);
        return () => {
        isMounted = false;
        clearInterval(interval);
        };
    }, [currentImage, images]);

    // const navigateToSignIn = () => {
    //     const signInElement = document.getElementById('signin');
    //     if (signInElement) {
    //         const elementTop = signInElement.getBoundingClientRect().top + window.scrollY - 80; // Adjust for any fixed headers
    //         window.scrollTo({ top: elementTop, behavior: 'smooth' });
    //     }
    // };

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
        {/* <div className="hero-btn-container"> */}

            {/* <button className="hero-button">
                Download App
            </button> */}
            
            {/* <button className="hero-button" onClick={navigateToSignIn}>
                Sign In
            </button> */}
        {/* </div> */}

        {/* Explore */}
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
