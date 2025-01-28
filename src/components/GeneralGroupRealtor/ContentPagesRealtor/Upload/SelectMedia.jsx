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
  const pickMediaAsync = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to an array
    if (files.length < 3) {
      alert('Select at least 3 media files');
    } else if (files.length > 15) {
      alert('You can only select up to 15 media files');
    } else {
      // Map the selected files to an array with their URIs and names
      const selectedMedia = files.map((file) => ({
        uri: URL.createObjectURL(file),
        name: file.name,
      }));
      // Maintain the selection order by appending new files in the same sequence they were picked
      setMedia((prevMedia) => [...prevMedia, ...selectedMedia]);
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