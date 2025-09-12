import React, { useState, useEffect, useRef } from 'react';
import './BookedProperty.css';
import { useParams } from 'react-router-dom';
import { DataStore } from "aws-amplify/datastore";
import { GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Post } from '../../../../../../../models';

function BookedPropertyMap() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [directions, setDirections] = useState(null);

  // Fetch the post to get lat/lng
  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) return;
        const foundPost = await DataStore.query(Post, postId);
        if (foundPost) {
          setPost(foundPost);
        }
      } catch (err) {
        console.error("Error fetching post", err);
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
        (err) => {
          console.error(err);
          setCurrentPosition({ lat: 4.8156, lng: 7.0498 }); // Port Harcourt fallback
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Request route once we have both current position & post location
  useEffect(() => {
    if (currentPosition && post) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: currentPosition,
          destination: { lat: post.lat, lng: post.lng },
          travelMode: window.google.maps.TravelMode.DRIVING, // can be WALKING, BICYCLING, TRANSIT
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
          } else {
            console.error(`Directions request failed due to ${status}`);
          }
        }
      );
    }
  }, [currentPosition, post]);

  if (!post) return <p>Loading property location...</p>;

  return (
    <div className='bookedPropertyMapCon'>
      <GoogleMap
        mapContainerClassName="googleMapContainer"
        center={{ lat: post.lat, lng: post.lng }}
        zoom={14}
        onLoad={setMap}
        onUnmount={() => setMap(null)}
      >
        {/* Marker for post location */}
        <Marker position={{ lat: post.lat, lng: post.lng }} />

        {/* Also show User location */}
        {currentPosition && (
          <Marker
            position={currentPosition}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        )}
        {/* Render the route */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* Floating My Location button */}
      <button
        className='myLocationButton'
        onClick={() => {
          if (map && currentPosition) {
            map.panTo(currentPosition);
            map.setZoom(14);
          }
        }}
      >
        📍
      </button>
    </div>
  )
}

export default BookedPropertyMap;