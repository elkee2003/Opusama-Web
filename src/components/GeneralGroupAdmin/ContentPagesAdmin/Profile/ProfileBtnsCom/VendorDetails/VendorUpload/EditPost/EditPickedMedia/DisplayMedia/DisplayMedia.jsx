import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaTimesCircle } from 'react-icons/fa';
import { useUploadContext } from '../../../../../../../../../../../Providers/RealtorProvider/UploadProvider';

const DisplayMedia = () => {
  const { media, removeMedia } = useUploadContext();
  const navigate = useNavigate();

  // Function to navigate to forms
  const goToForms = async () => {
    const videos = media.filter(item => item.type === 'video');
    const imageCount = media.filter(item => item.type === 'image').length;

    if (videos.length > 1) {
      alert("You can only select at most one video.");
      return;
    }
    
    if (videos.length === 1) {
      const isValid = await checkVideoDuration(videos[0].uri);
      if (!isValid) {
        alert('The selected video is longer than 2 mins. Click to trim it before proceeding.');
        return;
      }
    }

    if (videos.length === 1 && imageCount <= 10) {
      navigate('/admin/vendor_selected_address');
    } else if (videos.length === 0 && imageCount >= 1) {
      navigate('/admin/vendor_selected_address');
    } else {
      alert('Select at least 1 image OR 1 video with any number of images (up to 10).');
    }
  };

  // Function to check video duration
  const checkVideoDuration = (videoUri) => {
    return new Promise((resolve) => {
      const videoElement = document.createElement('video');
      videoElement.src = videoUri;
      videoElement.onloadedmetadata = () => {
        resolve(videoElement.duration <= 121);
      };
    });
  };

  // Function to remove a specific media item
  const handleRemove = (event, index) => {
    event.stopPropagation();
    removeMedia(index);
  };

  const handleMediaClick = (item, index) => {
    navigate("/admin/edit_view_media", { state: { mediaItem: item, index } });
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
                    <div className="videoOverlay" onClick={() => handleMediaClick(item)} />
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