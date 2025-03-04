import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa'; 
import './SelectMedia.css'; 
import { useUploadContext } from '../../../../../Providers/RealtorProvider/UploadProvider';

import { useAuthContext } from '../../../../../Providers/ClientProvider/AuthProvider';

const SelectMedia = () => {
  const {setMedia, media} = useUploadContext();
  const navigate = useNavigate();

  const {dbRealtor, authUser} = useAuthContext();

  useEffect(()=>{
      if(authUser){
          if(!dbRealtor){
              alert(
                  'Kindly fill in your data to access pages. Thank you.'
              );
              navigate('/realtorcontent/profile')
          }
      };
      
  },[dbRealtor])

  

  // Pick Multiple Media Function (Images and Videos)
  const pickMediaAsync = async (event) => {
    const files = Array.from(event.target.files);
    const images = [];
    const videos = [];
  
    // Classify the files into images and videos
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        images.push(file);
      } else if (file.type.startsWith('video/')) {
        videos.push(file);
      }
    });
  
    if (videos.length > 1) {
      alert('You can only select one video.');
      return; // Stop execution
    }
  
    if (images.length + videos.length > 10) {
      alert('You can select up to 10 images and videos combined.');
      return;
    } else if (images.length < 3 && videos.length === 0) {
      alert('Select at least 3 images or 1 video and any number of images.');
      return;
    }
  
    // If a video is selected, validate its duration first
    if (videos.length === 1) {
      const isVideoValid = await checkVideoDuration(videos[0]);
      if (!isVideoValid) {
        alert('Video too long. Please trim the video to 30 seconds or less before selecting.');
        return; // Stop execution
      }
    }
  
    // Proceed to finalize media selection
    finalizeMediaSelection([...images, ...videos]);
  };
  
  // Function to check video duration asynchronously
  const checkVideoDuration = (videoFile) => {
    return new Promise((resolve) => {
      const videoURL = URL.createObjectURL(videoFile);
      const videoElement = document.createElement('video');
      videoElement.src = videoURL;
      videoElement.onloadedmetadata = () => {
        resolve(videoElement.duration <= 30);
      };
    });
  };

  // Function to finalize media selection
  const finalizeMediaSelection = (files) => {
    const selectedMedia = files.map((file) => ({
      uri: URL.createObjectURL(file),
      name: file.name,
      type: file.type.startsWith("video/") ? "video" : "image",
    }));

    setMedia((prevMedia) => [...prevMedia, ...selectedMedia]);
    navigate('/realtorcontent/displaymedia');
  };


  //   if (files.length < 3) {
  //     alert('Select at least 3 media files');
  //   } else if (files.length > 15) {
  //     alert('You can only select up to 15 media files');
  //   } else {
  //     // Map the selected files to an array with their URIs and names
  //     const selectedMedia = files.map((file) => ({
  //       uri: URL.createObjectURL(file),
  //       name: file.name,
  //     }));
  //     // Maintain the selection order by appending new files in the same sequence they were picked
  //     setMedia((prevMedia) => [...prevMedia, ...selectedMedia]);
  //     navigate('/realtorcontent/displaymedia'); 
  //   }
  // };

  return (
    <div className="selectMContainer">
      <label className="upload-label">
        <FaCamera className="selectMIcon" />
        <input
          type="file"
          accept="image/*,video/*" // Allow both images and videos
          multiple
          className="file-input"
          onChange={pickMediaAsync}
          style={{ display: 'none' }} // Hide the default file input
        />
        <p>Click here</p>
        <span>Upload Images of Property</span>
        
      </label>
      <p className="disclaimer">
        Only property owners or authorized representatives may upload listings. Misrepresentation may lead to account suspension or deletion.
      </p>
    </div>
  );
};

export default SelectMedia;