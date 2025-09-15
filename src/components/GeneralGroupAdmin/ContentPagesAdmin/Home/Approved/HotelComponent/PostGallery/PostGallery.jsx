import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DataStore } from "aws-amplify/datastore";
import {Post} from '../../../../../../../models';
import Gallery from './Gallery/Gallery';
// Style was imported... (I don't know where it was first imported)


const PostGallery = () => {
  const { postId } = useParams();
  const [media, setMedia] = useState([]);

  const fetchPostMedia = async () => {
    try {
      if (postId) {
        const foundPost = await DataStore.query(Post, postId);
        if (foundPost && foundPost.media) {
          setMedia(foundPost.media);
        }else {
            setMedia([]);
        }
      }
    } catch (error) {
      console.error('Error fetching media for full view images:', error);
    }
  };

  useEffect(() => {
    fetchPostMedia();
  }, [postId]);

  return (
    <div className="posttGalleryContainer">
        <Gallery 
            media={media} 
        />
    </div>
  );
};

export default PostGallery;