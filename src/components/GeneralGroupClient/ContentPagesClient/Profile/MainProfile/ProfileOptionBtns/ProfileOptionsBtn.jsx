import React from 'react'
import './ProfileOptionsBtn.css'
import { MdNavigateNext } from 'react-icons/md'; 
import { useNavigate } from 'react-router-dom';
import { signOut } from "aws-amplify/auth";

function ProfileOptionsBtn() {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const onSignout = () => {
        if (window.confirm('Are you sure you want to sign out?')) {
            handleSignOut();
        }
    };
  return (
    <div className='clientProBtnOptions'>
        <button onClick={() => window.open('https://sites.google.com/view/opusama-termsofservice/home', '_blank')} className='btnCard'>
            <p className='proBtnTxt'>
            Terms and Conditions
            </p>
            <MdNavigateNext size={24} />
        </button>
        <button onClick={() => window.open('https://sites.google.com/view/opusama/home', '_blank')} className='btnCard'>
            <p className='proBtnTxt'>
            Privacy Policy
            </p>
            <MdNavigateNext size={24} />
        </button>
        <button onClick={() => navigate('/clientcontent/support')} className='btnCard'>
            <p className='proBtnTxt'>
            Support
            </p>
            <MdNavigateNext size={24} />
        </button>
        <button onClick={onSignout} className='btnCard'>
            <p className='proBtnTxt'>
            Sign Out
            </p>
            <MdNavigateNext size={24} />
        </button>
        <button onClick={() => navigate('/clientcontent/deleteaccount')} className='btnCard'>
            <p className='proBtnTxt'>
            Delete Account
            </p>
            <MdNavigateNext size={24} />
        </button>
    </div>
  )
}

export default ProfileOptionsBtn;
