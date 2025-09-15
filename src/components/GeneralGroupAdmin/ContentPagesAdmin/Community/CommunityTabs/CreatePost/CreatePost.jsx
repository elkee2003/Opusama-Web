import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './CreatePost.css'; 
import { useDropzone } from 'react-dropzone';
import imageCompression from "browser-image-compression";
import { CiImageOn } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import UploadMedia from './UploadMedia';
import { useAuthContext } from '../../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from "aws-amplify/datastore";
import { uploadData } from "aws-amplify/storage";
import { CommunityDiscussion } from '../../../../../../models';

const CreatePost = () => {
    const [isFocus, setIsFocus] = useState(false);
    const navigate = useNavigate();
    const { dbUser } = useAuthContext();


    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [media, setMedia] = useState([]);
    const [uploading, setUploading] = useState(false);

    const categoryData = [
        { label: 'Experience & Review', value: 'Experience & Review' },
        { label: 'Food, Fun & Nightlife', value: 'Food, Fun & Nightlife' },
        { label: 'Safety & Scam Alerts', value: 'Safety & Scam Alerts' },
        { label: 'City Life & Questions', value: 'City Life & Questions' },
        { label: 'Announcement', value: 'Announcement' },
    ];


    // ✅ Dropzone config with compression
    const onDrop = async (acceptedFiles) => {
        if (media.length + acceptedFiles.length > 2) {
            alert("You can only upload up to 2 images.");
            return;
        }

        const compressedFiles = await Promise.all(
            acceptedFiles.map(async (file) => {
                try {
                    const options = {
                        maxSizeMB: 1,           // target size: 1MB
                        maxWidthOrHeight: 1280, // resize if larger than 1280px
                        useWebWorker: true,
                    };

                    const compressed = await imageCompression(file, options);

                    // Create preview from compressed file
                    return Object.assign(compressed, {
                        preview: URL.createObjectURL(compressed),
                    });
                } catch (err) {
                    console.error("Compression error:", err);
                    // fallback to original file if compression fails
                    return Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    });
                }
            })
        );

        setMedia((prev) => [...prev, ...compressedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': [] },
        maxFiles: 2,
        onDrop,
    });

    const handleSubmit = async () => {
        if (!category || !title || !content) {
            alert('Please fill in all required fields');
            return;
        }

        if (uploading) return; 
        setUploading(true);

        try {
            // 1. Upload media to S3
            const uploadPromises = media.map(async (file) => {
            // fetch file as blob
            const response = await fetch(file.preview);
            const blob = await response.blob();

            const fileExtension = file.type.startsWith("image") ? "jpg" : "mp4";
            const fileKey = `public/community/${dbUser?.id}/${crypto.randomUUID()}.${fileExtension}`;

            const result = await uploadData({
                path: fileKey,
                data: blob,
                options: {
                contentType: file.type,
                },
            }).result;

            return result.path; // returns the uploaded file path
            });

            const mediaUrls = await Promise.all(uploadPromises);

             // 2. Save post with uploaded media URLs
            await DataStore.save(
            new CommunityDiscussion({
                category,
                title,
                content,
                media: mediaUrls, 
                instigatorID: dbUser?.id,
            })
            );

            alert("Post created successfully!");

            // 3. Reset form
            setCategory("");
            setTitle("");
            setContent("");
            setMedia([]);
            navigate(-1);
        } catch (e) {
            console.error("Error saving post:", e);
            alert("Failed to create post");
        } finally {
            setUploading(false); 
        }

        // try {
        //     await DataStore.save(
        //         new CommunityDiscussion({
        //             category,
        //             title,
        //             content,
        //             media,
        //             instigatorID: dbUser?.id
        //         })
        //     );
        //     alert('Post created successfully!');
        //     // Clear form after submission
        //     setCategory('');
        //     setTitle('');
        //     setContent('');
        //     setMedia([]);
        //     navigate(-1)
        // } catch (e) {
        //     console.error('Error saving post:', e);
        //     alert('Failed to create post');
        // }
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

        {/* Media Dropzone */}
        <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop your images here ...</p>
            ) : (
                <div className='drag-drop-image-con'>
                    <p>Drag & drop up to 2 images here, or click to select</p>
                    <CiImageOn className='addImgIcon'/>
                </div>
            )}
        </div>

        {/* Media display */}
        <UploadMedia media={media} setMedia={setMedia}/>

        {/* Post Button */}
        <div className="communityPostCon">
            <button 
                className="communityPostBtn"
                onClick={handleSubmit}
                disabled={uploading}
            >
                {uploading ? "Posting..." : "Post"}
            </button>
        </div>
    </div>
  );
};

export default CreatePost;