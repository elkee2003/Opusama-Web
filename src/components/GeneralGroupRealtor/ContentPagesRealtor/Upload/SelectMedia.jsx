import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa'; 
import './SelectMedia.css'; 
import { useUploadContext } from '../../../../../Providers/RealtorProvider/UploadProvider';

import { useAuthContext } from '../../../../../Providers/ClientProvider/AuthProvider';

import * as ffmpeg from '@ffmpeg/ffmpeg';
const { createFFmpeg, fetchFile } = ffmpeg;

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
        } else if (!dbRealtor.username) {
          alert('Please fill in your username to proceed.');
          navigate('/realtorcontent/editprofile');
        }
      };
      
  },[dbRealtor])

  

  // Pick Multiple Media Function (Images and Videos)
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

    // Enforce media selection conditions
    if (videos.length > 1) {
      alert('You can only select one video.');
      return;
    }

    if (images.length + videos.length > 10) {
      alert('You can select up to 10 images and a video combined.');
      return;
    } else if (images.length < 3 && videos.length === 0) {
      alert('Select at least 3 images or 1 video and any number of images.');
      return;
    }

    // If a video is selected, check its duration
    try {
      if (videos.length === 1) {
        const isVideoValid = await checkVideoDuration(videos[0]);
        if (!isVideoValid) {
          alert('The video you selected is longer than 2 mins. Please trim it when you get to the next page.');
        }
      }
    }catch (err) {
      console.error("Error checking video duration", err);
      alert('Failed to verify video duration. Please try another file.');
      return;
    }

    // Proceed to finalize media selection
    finalizeMediaSelection([...images, ...videos]);
  };

  // Function to check video duration asynchronously
  const checkVideoDuration = (videoFile) => {
    return new Promise((resolve) => {
      const videoURL = URL.createObjectURL(videoFile);
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.src = videoURL;
      videoElement.onloadedmetadata = () => {
        resolve(videoElement.duration <= 120);
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

  return (
    <div className="selectMContainer">
      <label className="upload-label">
        <FaCamera className="selectMIcon" />
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          className="file-input"
          onChange={pickMediaAsync}
          style={{ display: 'none' }}
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