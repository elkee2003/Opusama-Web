import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa'; 
import './SelectMedia.css'; 
import { useUploadContext } from '../../../../../Providers/RealtorProvider/UploadProvider';
import { useAuthContext } from '../../../../../Providers/ClientProvider/AuthProvider';

const SelectMedia = () => {
  const { setMedia } = useUploadContext();
  const navigate = useNavigate();
  const { dbRealtor, authUser } = useAuthContext();

  useEffect(() => {
    if (authUser && !dbRealtor) {
      alert('Kindly fill in your data to access pages. Thank you.');
      navigate('/realtorcontent/profile');
    }
  }, [dbRealtor]);

  // Pick Multiple Images Function (Videos Removed)
  const pickMediaAsync = async (event) => {
    const files = Array.from(event.target.files);
    const images = files.filter((file) => file.type.startsWith('image/'));

    if (images.length < 3) {
      alert('Select at least 3 images.');
      return;
    }

    if (images.length > 10) {
      alert('You can select up to 10 images.');
      return;
    }

    // Finalize media selection
    finalizeMediaSelection(images);
  };

  // Function to finalize media selection
  const finalizeMediaSelection = (files) => {
    const selectedMedia = files.map((file) => ({
      uri: URL.createObjectURL(file),
      name: file.name,
      type: "image",
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
          accept="image/*"  // Only images allowed
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