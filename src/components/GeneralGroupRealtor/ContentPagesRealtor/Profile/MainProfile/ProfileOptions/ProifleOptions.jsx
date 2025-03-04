import React from "react";
import { useNavigate } from "react-router-dom";
import './ProfileOptions.css'
import { AiFillEdit, AiOutlineLogout, AiFillDelete } from "react-icons/ai";
import { MdSupportAgent, MdPolicy } from "react-icons/md";
import { RiFileList2Fill } from "react-icons/ri";
import { signOut } from 'aws-amplify/auth';

const ProfileOptionsPage = () => {
    const navigate = useNavigate();

    // Signout function
    async function handleSignOut() {
    try {
        await signOut({ global: true });
        navigate('/');
    } catch (error) {
        console.log('error signing out: ', error);
    }
    }

    // Signout prompt
    const onSignout = () => {
        if (window.confirm("Are you sure you want to sign out?")) {
        handleSignOut();
        }
    };

  return (
    <div className="profileOptContainer">
        {/* Title */}
        <h1 className="proOptHeader">Settings & Privacy</h1>

        {/* Buttons */}
        <div className="proOptBtnCon">
            <button
            className="proOptBtnRow"
            onClick={() => navigate("/realtorcontent/editprofile")}
            >
            <AiFillEdit className="proOptIcon" />
            <span className="proOptTxt">Edit Profile</span>
            </button>

            <button
            className="proOptBtnRow"
            onClick={() => navigate("/realtorcontent/support")}
            >
                <MdSupportAgent className="proOptIcon" />
                <span className="proOptTxt">Support</span>
            </button>

            <button
            className="proOptBtnRow"
            onClick={() => window.open('https://sites.google.com/view/opusama-termsofservice/home', '_blank')}
            >
                <RiFileList2Fill className="proOptIcon" />
                <span className="proOptTxt">Terms and Conditions</span>
            </button>

            <button
            className="proOptBtnRow"
            onClick={() => window.open('https://sites.google.com/view/opusama/home', '_blank')}
            >
                <MdPolicy className="proOptIcon" />
                <span className="proOptTxt">Privacy Policy</span>
            </button>

            <button className="proOptBtnRow" onClick={onSignout}>
                <AiOutlineLogout className="proOptIcon" />
                <span className="proOptTxt">Sign Out</span>
            </button>

            <button
            className="proOptBtnRow"
            onClick={() => navigate("/realtorcontent/deleteaccount")}
            >
                <AiFillDelete className="proOptIcon" />
                <span className="proOptTxt">Delete Account</span>
            </button>
        </div>
    </div>
  );
};

export default ProfileOptionsPage;