import React from 'react';
import { useNavigate } from 'react-router-dom';

function AuthenticatorPage() {
    const navigate = useNavigate();
  return (
    <div className="emptyProfileCon">
        <h1 className="title">Sign In</h1>

        {/* Circle for image */}
        <div className="profilePicContainer" />

        {/* Empty inputs */}
        <div className="emptyInputCon">
            <div className="emptyInput" />
            <div className="emptyInput" />
            <p className="emptyInputAuthTxt">
                You must have a client account to access this page.
            </p>
        </div>
        <button
            className="emptyBtnCon"
            onClick={() => navigate('/?section=signin')}
        >
            <p className="emptyBtnTxt">Sign In</p>
        </button>
    </div>
  )
}

export default AuthenticatorPage;