import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DisplayMedia.css';
import { FaArrowLeft, FaArrowRight, FaTimesCircle } from 'react-icons/fa';
import { useUploadContext } from '../../../../../../../../Providers/RealtorProvider/UploadProvider';

const DisplayMedia = () => {
  const { media, removeMedia } = useUploadContext();
  const navigate = useNavigate();

  // Function to navigate to forms
  const goToForms = async () => {
    const video = media.find(item => item.type === 'video');
    const imageCount = media.filter(item => item.type === 'image').length;
    

    if (video) {
      const isValid = await checkVideoDuration(video.uri);
      if (!isValid) {
        alert('The selected video is longer than 40 seconds. Please trim it before proceeding.');
        return;
      }
    }

    if (video && imageCount <= 10) {
      navigate('/realtorcontent/selectaddress');
      // navigate('/realtorcontent/form');
    } else if (!video && imageCount >= 3) {
      navigate('/realtorcontent/selectaddress');
      // navigate('/realtorcontent/form');
    } else {
      alert('Select at least 3 images OR 1 video with any number of images (up to 10).');
    }
  };

  // Function to check video duration
  const checkVideoDuration = (videoUri) => {
    return new Promise((resolve) => {
      const videoElement = document.createElement('video');
      videoElement.src = videoUri;
      videoElement.onloadedmetadata = () => {
        resolve(videoElement.duration < 41);
      };
    });
  };

  // Function to remove a specific media item
  const handleRemove = (event, index) => {
    event.stopPropagation();
    removeMedia(index);
  };

  const handleMediaClick = (item, index) => {
    navigate("/realtorcontent/view-media", { state: { mediaItem: item, index } });
  };

  return (
    <div className="displayMContainer">
      <div className='displayInnerCon'>
        {/* Icon Container */}
        <div className="dispalyMIconContainer">
          {/* Back Icon */}
          <button className="dispalyMBackIconContainer" onClick={() => navigate(-1)}>
            <FaArrowLeft className="dispalyMIcon" />
          </button>

          {/* Forward Icon */}
          <button className="dispalyMForwardIconContainer" onClick={goToForms}>
            <FaArrowRight className="dispalyMIcon" />
          </button>
        </div>

        {/* Media Display */}
        <div className="mediaFullDisplayContainer">
          <div className="mediaDivContainer">
            {media.map((item, index) => (
              <div 
                className="dispalyMediaContainer" 
                key={index}
                onClick={() => handleMediaClick(item, index)}
              >
                {item.type === 'video' ? (
                  <div className="videoWrapper">
                    <video 
                    key={item.uri}
                      className="dispalyMedia"
                      controls
                    >
                      <source src={item.uri} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="videoOverlay" onClick={() => handleMediaClick(item)}></div>
                  </div>
                ) : (
                  <img src={item.uri} alt={`media-${index}`} className="dispalyMedia" />
                )}

                {/* Remove Button */}
                <button
                  className="dispalyMRemoveButtonContainer"
                  onClick={(event) => handleRemove(event, index)}
                >
                  <FaTimesCircle className="dispalyMRemovebtn" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayMedia;