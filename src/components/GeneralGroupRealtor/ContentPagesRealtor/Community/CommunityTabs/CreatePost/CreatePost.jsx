import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './CreatePost.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from "aws-amplify/datastore";
import { CommunityDiscussion } from '../../../../../../models';

const CreatePost = () => {
    const [isFocus, setIsFocus] = useState(false);
    const navigate = useNavigate();
    const { dbRealtor } = useAuthContext();


    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [media, setMedia] = useState([]);

    const categoryData = [
        { label: 'Neigbourhood Insights', value: 'Neigbourhood Insights' },
        { label: 'House Hunting Tips', value: 'House Hunting Tips' },
        { label: 'Scam Alerts', value: 'Scam Alerts' },
        { label: 'Moving & Relocation Advice', value: 'Moving & Relocation Advice' },
        { label: 'General Real Estate Discussion', value: 'General Real Estate Discussion' },
    ];

    const handleSubmit = async () => {
        if (!category || !title || !content) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            await DataStore.save(
                new CommunityDiscussion({
                    category,
                    title,
                    content,
                    media,
                    instigatorID: dbRealtor?.id
                })
            );
            alert('Post created successfully!');
            // Clear form after submission
            setCategory('');
            setTitle('');
            setContent('');
            setMedia([]);
            navigate(-1)
        } catch (e) {
            console.error('Error saving post:', e);
            alert('Failed to create post');
        }
    };

  return (
    <div className="createPostCon">
        <p className='createPostHeader'>Create Post</p>
        <Select
            className={'dropDownCreatePost'}
            options={categoryData}
            placeholder="Select Category"
            value={categoryData.find((option) => option.value === category)}
            onChange={(selectedOption) => setCategory(selectedOption.value)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
        />

        {/* Title */}
        <textarea
            className="formCommunTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your post a title..."
        />

        {/* Content */}
        <textarea
            className="formCommunContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, insights, or questions here..."
        />

        {/* Post Button */}
        <div className="communityPostCon">
            <button 
                className="communityPostBtn" 
                onClick={handleSubmit}
            >
                Post
            </button>
        </div>
    </div>
  );
};

export default CreatePost;