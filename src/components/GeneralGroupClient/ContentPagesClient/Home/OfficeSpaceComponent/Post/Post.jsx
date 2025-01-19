import React, {useState, useEffect} from 'react';
import './Post.css';
import { useNavigate } from 'react-router-dom';
import { getUrl } from 'aws-amplify/storage';

function Post({post}) {
    const navigate = useNavigate();
    const [imageUris, setImageUris] = useState([]);
    const formattedPrice = Number(post.price)?.toLocaleString();

    // Fetch signed URLs for each image in post.media
    const fetchImageUrls = async () => {
        try {
        const urls = await Promise.all(
            post.media.map(async (path) => {
            const result = await getUrl({
                path,
                options: {
                validateObjectExistence: true, 
                expiresIn: null, // No expiration limit
                },
            });
    
            // Use `result.url` 
            return result.url.toString(); 

            })
        );
    
        const validUrls = urls.filter(url => url !== null);
        setImageUris(validUrls);
        } catch (error) {
        console.error('Error fetching image URLs:', error);
        }
    };

    useEffect(()=>{
        if (post.media?.length > 0) {
        fetchImageUrls();
        }
    }, [post.media]);

  return (
    <div >
        {/* Image Container */}
        <div 
            className={'imageContainer'}
            onClick={()=>navigate(`/clientcontent/realtorprofile/${post.realtorID}`)}
        >
          {/* Image */}
          {imageUris[0] ? (
            <img src={imageUris[0]} alt="Post" className={'image'} />
          ) : (
            <img src={'/defaultImage.png'} alt="Default" className={'image'} />
          )}
        </div>

        {/* Username */}
        <div 
            className={'contact'}
            onClick={()=>navigate('/realtor/realtorprofilepage')}
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
        {post.address && (
          <p className={'location'}>
            {post.address}
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
