import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultImage from "/defaultImage.png";
import { IoArrowBack } from "react-icons/io5";
import '../../../TabStyles/Gallery.css';
import { getUrl } from 'aws-amplify/storage';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const Gallery = ({ media }) => {
  const [mediaUrls, setMediaUrls] = useState([]);
  const [isSwiperReady, setIsSwiperReady] = useState(false); 
  const navigate = useNavigate();

  const fetchMediaUrls = async () => {
    try {
      const urls = await Promise.all(
        media.map(async (item) => {
          try {
            const result = await getUrl({
              path: item,
              options: {
                validateObjectExistence: true,
                expiresIn: null, // No expiration
              },
            });
            return result.url;
          } catch {
            return DefaultImage; // Fallback to a default image
          }
        })
      );
      setMediaUrls(urls);
      setIsSwiperReady(true);
    } catch (error) {
      console.error('Error fetching media URLs:', error);
    }
  };

  useEffect(() => {
    if (media && media.length > 0) {
      fetchMediaUrls();
    }else {
      setMediaUrls([]);
      setIsSwiperReady(false); // Reset Swiper readiness if no media is available
    }
  }, [media]);

  return (
    <div className="galleryContainer">
      {/* <button onClick={() => navigate(-1)} className="backIconContainer">
        <IoArrowBack />
      </button> */}
      {isSwiperReady && mediaUrls.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          className="swiper"
        >
          {mediaUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <img
                src={url || DefaultImage}
                alt={`Media ${index + 1}`}
                className="galleryImage"
                onError={(e) => (e.target.src = DefaultImage)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>Loading images...</p>
      )}
    </div>
  );
};

export default Gallery;