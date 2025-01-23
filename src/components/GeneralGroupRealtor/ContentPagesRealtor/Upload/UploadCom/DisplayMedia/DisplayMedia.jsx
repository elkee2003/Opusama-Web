import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DisplayMedia.css';
import { FaArrowLeft, FaArrowRight, FaTimesCircle } from 'react-icons/fa';
import { useUploadContext } from '../../../../../../../Providers/RealtorProvider/UploadProvider';

const DisplayMedia = () => {
  const { media, removeMedia } = useUploadContext();
  const navigate = useNavigate();

  // Function to navigate to forms
  const goToForms = () => {
    if (media.length >= 3) {
      navigate('/realtorcontent/selectaddress');
    } else {
      alert('Kindly add more media files');
    }
  };

  // Function to remove a specific media item
  const handleRemove = (index) => {
    removeMedia(index);
  };

  return (
    <div className="displayMContainer">
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
            <div className="dispalyMediaContainer" key={index}>
              <img src={item.uri} alt={`media-${index}`} className="dispalyMedia" />
              <button
                className="dispalyMRemoveButtonContainer"
                onClick={() => handleRemove(index)}
              >
                <FaTimesCircle className="dispalyMRemovebtn" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayMedia;