import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa'; 
import './SelectMedia.css'; 
import { useUploadContext } from '../../../../../Providers/RealtorProvider/UploadProvider';

import { useAuthContext } from '../../../../../Providers/ClientProvider/AuthProvider';

const SelectMedia = () => {
  const {setMedia, media} = useUploadContext();
  const navigate = useNavigate();

  const {dbRealtor, dbUser} = useAuthContext();

  console.log('check:', dbRealtor?.id)
  console.log('check:', dbRealtor?.firstName)
  console.log('checkDbUserName:', dbUser?.firstName)
  console.log('dbUserID:', dbUser?.id)

  // Pick Multiple Media Function (Images and Videos)
  const pickMediaAsync = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to an array
    if (files.length < 3) {
      alert('Select at least 3 media files');
    } else if (files.length > 12) {
      alert('You can only select up to 12 media files');
    } else {
      const selectedMedia = files.map((file) => ({
        uri: URL.createObjectURL(file),
        name: file.name,
      }));
      setMedia(selectedMedia);
      navigate('/realtorcontent/displaymedia'); 
    }
  };

  return (
    <div className="selectMContainer">
      <label className="upload-label">
        <FaCamera className="selectMIcon" />
        <input
          type="file"
          accept="image/*"
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