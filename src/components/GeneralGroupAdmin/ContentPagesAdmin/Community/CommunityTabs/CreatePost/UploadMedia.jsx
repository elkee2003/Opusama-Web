import React from 'react';
import './CreatePost.css'; 
import { TiDelete } from "react-icons/ti";

function UploadMedia({media, setMedia}) {
  return (
    <div className='media-con'>
        {media.map((file, index) => (
            <div key={index} className='media-item'>
                <img
                    src={file.preview}
                    alt={`upload-${index}`}
                    className='preview-img'
                />
                <TiDelete 
                    className="remove-btn"
                    onClick={() =>
                        setMedia((prev) => prev.filter((_, i) => i !== index))
                    }
                />
            </div>
            
        ))}
    </div>
  )
}

export default UploadMedia
