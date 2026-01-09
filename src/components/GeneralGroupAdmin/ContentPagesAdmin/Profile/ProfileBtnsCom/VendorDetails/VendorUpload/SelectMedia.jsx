import React, { useState, useEffect } from 'react';
import './SelectMedia.css'
import { useNavigate } from 'react-router-dom';
import { Autocomplete, TextField } from "@mui/material";
import { FaCamera } from 'react-icons/fa'; 
import { useUploadContext } from '../../../../../../../../Providers/RealtorProvider/UploadProvider';

import { useAuthContext } from '../../../../../../../../Providers/ClientProvider/AuthProvider';

import * as ffmpeg from '@ffmpeg/ffmpeg';
const { createFFmpeg, fetchFile } = ffmpeg;
import { DataStore } from "aws-amplify/datastore";
import { Realtor } from '../../../../../../../models';

const SelectMedia = () => {
  const navigate = useNavigate();

  const {setMedia, media, selectedRealtor, setSelectedRealtor,} = useUploadContext();

  const [realtors, setRealtors] = useState([]);

  // const {dbRealtor, authUser} = useAuthContext();

  
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
    } else if (images.length < 1 && videos.length === 0) {
      alert('Select at least 1 image or 1 video and a number of images.');
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
    navigate('/admin/displaymedia');
  };

  // useEffect to fetch Realtors
  useEffect(() => {
    const fetchRealtors = async () => {
      const result = await DataStore.query(Realtor);
      setRealtors(result);
    };

    fetchRealtors();
  }, []);

  return (
    <div className="selectMContainerAdmin">
      <Autocomplete
        className="realtor-autocomplete"
        options={realtors}
        value={selectedRealtor}
        loading={!realtors.length}

        getOptionLabel={(option) =>
          option
            ? `${option.firstName} ${option.lastName} (${option.email})`
            : ""
        }

        isOptionEqualToValue={(option, value) =>
          option.id === value.id
        }

        onChange={(event, newValue) => {
          setSelectedRealtor(newValue);
        }}

        renderInput={(params) => (
          <TextField
            {...params}
            label="Select vendor / realtor"
            placeholder="Search by name or email"
          />
        )}
      />

      {selectedRealtor && (
        <div className="media-actions">
          <button
            type="button"
            className="existing-media-btn"
            onClick={() => {
              navigate(
                `/admin/existing_media?vendorSub=${selectedRealtor.sub}`
              );
            }}
          >
            Pick existing media
          </button>

          <label className="upload-label-admin">
            <FaCamera className="selectMIconAdmin" />
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="file-input"
              onChange={pickMediaAsync}
              style={{ display: "none" }}
            />
            Upload new media
          </label>
          <p className="disclaimer-admin">
            Only property owners or authorized representatives may upload listings. Misrepresentation may lead to account suspension or deletion.
          </p>
        </div>
      )}
    </div>
  );
};

export default SelectMedia;