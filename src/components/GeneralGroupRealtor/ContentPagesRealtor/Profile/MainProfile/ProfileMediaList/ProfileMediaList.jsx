import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileMediaGrid from '../ProfileMediaGrid/ProfileMediaGrid';
import { useAuthContext } from '../../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from 'aws-amplify/datastore';
import { Post } from '../../../../../../models';
import './ProfileMediaList.css';

const ProfileMediaList = () => {

    const {dbRealtor} = useAuthContext()
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () =>{

        setLoading(true);
        try{
            const realtorPosts = await DataStore.query(Post, (p)=>p.realtorID.eq(dbRealtor.id));

            const sortedPosts = realtorPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setPosts(sortedPosts);
        }catch(e){
            Alert.alert('Error fetching posts', e.message)
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchPosts();

        const subscription = DataStore.observe(Post).subscribe(({opType})=>{
        if(opType === 'INSERT' || opType === 'UPDATE' || opType === 'DELETE'){
            fetchPosts();
        }
        });

        return () => subscription.unsubscribe();
    },[]);

    if (loading) {
    return (
        <div className="loading-container">
        <div className="spinner" />
        <h2>Loading...</h2>
        </div>
    );
    }

  return (
    <div className="mediaListCon">
      <ProfileMediaGrid posts={posts}/>
    </div>
  );
};

export default ProfileMediaList;