import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa'; 
import './SelectMedia.css'; 
import { useUploadContext } from '../../../../../Providers/RealtorProvider/UploadProvider';

import { useAuthContext } from '../../../../../Providers/ClientProvider/AuthProvider';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

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

  // Load ffmpeg on component mount
  useEffect(() => {
    if (!ffmpeg.isLoaded()) {
      ffmpeg.load();
    }
  }, []);

  

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
      const trimmedVideo = await trimVideo(videos[0]);
      if (!trimmedVideo) {
        alert('Failed to trim the video. Please try again.');
        return;
      }
      finalizeMediaSelection([...images, trimmedVideo]);
    } else {
      finalizeMediaSelection(images);
    }
  };

  const trimVideo = async (videoFile) => {
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    const inputFileName = 'input.mp4';
    const outputFileName = 'output.mp4';

    ffmpeg.FS('writeFile', inputFileName, await fetchFile(videoFile));

    await ffmpeg.run(
      '-i', inputFileName, 
      '-t', '30',  // Trim to 30 seconds
      '-c', 'copy',
      outputFileName
    );

    const data = ffmpeg.FS('readFile', outputFileName);
    const trimmedBlob = new Blob([data.buffer], { type: 'video/mp4' });
    return new File([trimmedBlob], 'trimmed_video.mp4', { type: 'video/mp4' });
  };
  
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