import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultImage from "/defaultImage.png";
import { IoArrowBack } from "react-icons/io5";
import { getUrl } from 'aws-amplify/storage';
// import '../../../TabStyles/Gallery.css';
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
                expiresIn: null,
              },
            });

            return {
              url: result.url.toString(),
              type: item.endsWith('.mp4') ? 'video' : 'image',
            };
          } catch {
            return { url: DefaultImage, type: 'image' };
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
              {url.type === 'video' ? (
                <div className="videoWrapper">
                  <video
                    className="galleryVideo"
                    controls
                    // controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <source src={url.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <img
                  src={url.url || DefaultImage}
                  alt={`Media ${index + 1}`}
                  className="galleryImage"
                  onError={(e) => (e.target.src = DefaultImage)}
                />
              )}
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