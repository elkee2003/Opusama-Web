import React, {useState, useEffect} from 'react';
import '../../TabStyles/Post.css';
import { useNavigate } from 'react-router-dom';
import { getUrl } from 'aws-amplify/storage';

function Post({post}) {
    const navigate = useNavigate();
    const [mediaUris, setMediaUris] = useState([]);
    const formattedPrice = Number(post.price)?.toLocaleString();

    // Fetch ONLY the first media item
    const fetchFirstMediaUrl = async () => {
      if (!post.media?.length) return;

      const path = post.media[0];

      try {
        const result = await getUrl({
          path,
          options: {
            validateObjectExistence: true,
            expiresIn: null,
          },
        });

        setMediaUris([
          {
            url: result.url.toString(),
            type: path.endsWith('.mp4') ? 'video' : 'image',
          },
        ]);
      } catch (error) {
        console.error('Error fetching media URL:', error);
      }
    };

    useEffect(() => {
      fetchFirstMediaUrl();
    }, [post.media]);

    // function to navigate
    const handleNavigate = (postId) => {
      // sessionStorage.setItem("scrollPosition", window.scrollY); 
      navigate(`/clientcontent/hoteldetailedpost/${postId}`);
    };

  return (
    <div className='singlePostContainer' >
        {/* Image Container */}
        <div 
            className={'imageContainer'}
            onClick={() => handleNavigate(post.id)}
        >
          {mediaUris.length > 0 ? (
            mediaUris[0].type === 'video' ? (
              <div className='pVideoWrapper'>
                <video
                  className="pMedia"
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <source src={mediaUris[0].url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div 
                  className="pVideoOverlay" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/clientcontent/hoteldetailedpost/${post.id}`);
                  }}
                />
              </div>
            ) : (
              <img 
                src={mediaUris[0].url} 
                alt="Post" 
                className='pImage' 
                loading='lazy'
              />
            )
            ) : (
              <div className="pImageLoading">
                {/* Default Image */}
                <img src={'/defaultImage.png'} alt="Default" className='pImage' />

                {/* Spinner */}
                <div className="spinnerOverlay" />
              </div>
            )}
        </div>

        {/* Username */}
        <div 
            className={'contact'}
            onClick={()=>navigate(`/clientcontent/realtorprofile/${post.realtorID}`)}
        >
            <p className={'name'}>{post.firstName}</p>
        </div>

        {post.type && (
            <p className={'bedroom'}>{post.type}</p>
        )}

        {/* Bed & Bedrooms */}
        {post.bed && (
            <p className={'bedroom'}>Beds: {post.bed} </p>
        )}

        {post.bedrooms && (
          <p className={'bedroom'}>Bedroom(s):{post.bedrooms} </p>
        )}

        {/* Location */}
        {post.generalLocation && (
          <p className={'location'}>
            {post.generalLocation}
          </p>
        )}

        {/* Type & Description */}
        <p 
            className={'description'}
        >
            {post.description.length <= 150 ? post.description : `${post.description.substring(0, 150)}...`}
        </p>

        {/* Old Price & New Price */}
        {/* Rent */}
        <div className={'priceRow'}>
          <p className={'price'}> 
            ₦{formattedPrice} {post.timeFrame && `/ ${post.timeFrame}`}
          </p>
        </div>
    </div>
  )
}

export default Post;
