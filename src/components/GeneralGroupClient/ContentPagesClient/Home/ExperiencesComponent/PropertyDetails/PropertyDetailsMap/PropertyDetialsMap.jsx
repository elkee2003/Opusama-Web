import React, { useState, useEffect, useRef } from 'react';
import '../../../TabStyles/PropertyDetailsMap.css';
import { useParams } from 'react-router-dom';
import { DataStore } from "aws-amplify/datastore";
import { GoogleMap, Marker, Circle, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Post } from '../../../../../../../models';

function PropertyDetailsMap() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [directions, setDirections] = useState(null);
  const [displayCoords, setDisplayCoords] = useState(null);

  // Helper to blur coordinates
  const maskCoordinates = (lat, lng) => {
    const offset = (Math.random() - 0.5) * 0.01; // ~500m
    return { lat: lat + offset, lng: lng + offset };
  };

  // Fetch the post to get lat/lng
  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) return;
        const foundPost = await DataStore.query(Post, postId);
        if (foundPost) {
          setPost(foundPost);

          // Decide what coords to display
          if (Number(foundPost.totalPrice) === 0) {
            setDisplayCoords({ lat: foundPost.lat, lng: foundPost.lng });
          } else {
            setDisplayCoords(maskCoordinates(foundPost.lat, foundPost.lng));
          }
        }
      } catch (err) {
        console.error("Error fetching post", err);
      }
    };
    fetchPost();
  }, [postId]);

  // Get user location
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

  // Request directions only if free (totalPrice === 0)
  useEffect(() => {
    if (currentPosition && post && Number(post.totalPrice) === 0) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: currentPosition,
          destination: { lat: post.lat, lng: post.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
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

  if (!post || !displayCoords) return <p>Loading property location...</p>;

  return (
    <div className='propertyDetailsMapCon'>
      <GoogleMap
        mapContainerClassName="propertyDetailsGoogleMapContainer"
        center={displayCoords}
        zoom={14}
        onLoad={setMap}
        onUnmount={() => setMap(null)}
      >
        {/* Marker or Circle */}
        {Number(post.totalPrice) > 0 ? (
          <Circle
            center={displayCoords}
            radius={700} // ~700m blur
            options={{
              strokeColor: "#4A90E2",
              strokeOpacity: 0.5,
              strokeWeight: 2,
              fillColor: "#4A90E2",
              fillOpacity: 0.2,
            }}
          />
        ) : (
          <>
            <Marker position={displayCoords}/>
          </>
        )}

        {/* Directions service + renderer (only if free post) */}
        {currentPosition && post && Number(post.totalPrice) === 0 && (
          <DirectionsService
            options={{
              origin: currentPosition,
              destination: { lat: post.lat, lng: post.lng },
              travelMode: window.google.maps.TravelMode.DRIVING,
            }}
            callback={(result, status) => {
              if (status === "OK") {
                setDirections(result);
              } else {
                console.error("Directions request failed:", status);
              }
            }}
          />
        )}

        {directions && (
          <DirectionsRenderer
            options={{
              directions: directions,
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#4285F4",
                strokeWeight: 5,
              },
            }}
          />
        )}
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
  );
}

export default PropertyDetailsMap;