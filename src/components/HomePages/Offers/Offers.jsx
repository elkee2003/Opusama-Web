import React, {useState, useEffect} from 'react';
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

const Offers = () => {

    const [currentImage, setCurrentImage] = useState(0);
    const [currentPhoto, setCurrentPhoto] = useState(0);
    const isLargeScreen = useMediaQuery("(min-width: 1000px)");
    const isMediumScreen = useMediaQuery("(min-width: 500px) and (max-width: 1099px)");
    const isSmallScreen = useMediaQuery("(min-width: 250px) and (max-width: 499px)");

    const isLargeEcran = useMediaQuery("(min-width: 1000px)");
    const isMediumEcran = useMediaQuery("(min-width: 500px) and (max-width: 1099px)");
    const isSmallEcran = useMediaQuery("(min-width: 250px) and (max-width: 499px)");

    const largeScreenImages = [
        "/backgroundBig.png"
    ]

    const mediumScreenImages = [
        "/backgroundBig.png"
    ]
    const smallScreenImages = [
        "/backgroundSmall.png"
    ]

    // for numerous images
    const largeEcranPhotos = [
        '/image1.png',
        '/image2.jpeg',
        '/image3.jpg',
        '/image4.png',
    ]

    const mediumEcranPhotos = [
        '/image1.png',
        '/image2.jpeg',
        '/image3.jpg',
        '/image4.png',
    ]
    const smallEcranPhotos = [
        '/image1.png',
        '/image2.jpeg',
        '/image3.jpg',
        '/image4.png',
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

    // Choose images based on screen size
    let photos;
    if (isLargeEcran) {
        photos = largeEcranPhotos;
    } else if (isMediumEcran) {
        photos = mediumEcranPhotos;
    } else if (isSmallEcran) {
        photos = smallEcranPhotos;
    } else {
        photos = [];
    }

    // Preload images
    useEffect(() => {
        photos.forEach((src) => {
        const img = new Image();
        img.src = src;
        });
    }, [photos]);

    // Change background image every 6 seconds
    useEffect(() => {
        let isMounted = true;

        const changeImage = () => {
        const nextIndex = (currentImage + 1) % photos.length;
        const img = new Image();
        img.src = photos[nextIndex];
        img.onload = () => {
            if (isMounted) {
            setCurrentImage(nextIndex);
            }
        };
        };

        const interval = setInterval(changeImage, 6000);
        return () => {
        isMounted = false;
        clearInterval(interval);
        };
    }, [currentImage, photos]);
  return (
    <section
        id='offers'
        className="offer-wrapper"
        style={{
            backgroundImage: `url(${images[currentImage]})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        }} 
    >
        <div className="paddings innerWidth flexColStart offer-container">
            <h1 className="primaryText offer-section-header-txt">What We Offer</h1>
            <p className="secondaryText offer-section-txt">
                Opusama is a bridge between discovery and experience — where people and places meet.
            </p>
            

            <div className='offer-section'>
                <div className="offer-items">

                    <div 
                        className='offer-image-con'
                        style={{
                            backgroundImage: `url(${photos[currentImage]})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }} 
                    />

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