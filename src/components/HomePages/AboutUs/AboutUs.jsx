import React, {useState, useEffect, useMemo} from 'react';
import './AboutUs.css';

// Custom hook to check screen width
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event) => setMatches(event.matches);

    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

const AboutUs = () => {

    const [currentImage, setCurrentImage] = useState(0);
    
    // Detect screen size using multiple queries
    const isLargeScreen = useMediaQuery("(min-width: 1100px)");
    const isMediumScreen = useMediaQuery("(min-width: 500px) and (max-width: 1099px)");
    const isSmallScreen = useMediaQuery("(min-width: 250px) and (max-width: 499px)");

    const largeScreenImages = [
        '/image1Big.jpg',
        '/image2Big.jpg',
        '/image3Big.png',
        '/image4Big.jpg',
    ];

    const mediumScreenImages = [
        '/image1Big.jpg',
        '/image2Big.jpg',
        '/image3Big.png',
        '/image4Big.jpg',
    ]

    const smallScreenImages = [
        '/image1Small.png',
        '/image2Small.jpeg',
        '/image3Small.jpg',
        '/image4Small.png',
    ]

    // Choose images based on screen size
    const images = useMemo(() => {
            if (isLargeScreen) return largeScreenImages;
            if (isMediumScreen) return mediumScreenImages;
            if (isSmallScreen) return smallScreenImages;
            return [];
    }, [isLargeScreen, isMediumScreen, isSmallScreen]);


    // Preload images
    useEffect(() => {
        images.forEach((src) => {
        const img = new Image();
        img.src = src;
        });
    }, [images]);

    // Change background image every 6 seconds
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

        const interval = setInterval(changeImage, 6000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [currentImage, images]);

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

                {/* images */}
                <div 
                    className='bg-image'
                    style={{
                        backgroundImage: `url(${images[currentImage]})`,
                        // backgroundSize: 'contain',
                        // backgroundRepeat: 'no-repeat',
                        // backgroundPosition: 'center',
                    }} 
                />

                {/* text */}
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