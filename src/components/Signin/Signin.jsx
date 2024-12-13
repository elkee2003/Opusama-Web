import React, { useState } from 'react';
import './Signin.css';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
    const [activeUserType, setActiveUserType] = useState('client');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // function for form onchange
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // function for form to submit
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`${activeUserType} form submitted:`, formData);
        // Add logic for form submission (e.g., API call)
    };

    // useNavigation
    const navigate = useNavigate();

    const navigateToCreateAccount = () => {
        navigate('/signup');
    };

    const navigateToForgotPassword = () => {
        navigate('/forgotpassword');
    };

  return (
    <div
        id='signin'
        className="signin-container"
    >

        {/* Title Section */}
        <h1 className="primaryText signin-title-left">Sign In Screen</h1>

        {/* Buttons for selecting user type */}
        <div className="signin-switcher">
            <button
            className={`switcher-button ${activeUserType === 'client' ? 'active' : ''}`}
            onClick={() => setActiveUserType('client')}
            >
            Client
            </button>
            <button
            className={`switcher-button ${activeUserType === 'agent' ? 'active' : ''}`}
            onClick={() => setActiveUserType('agent')}
            >
            Agent
            </button>
        </div>

        {/* Sign-in form */}
        <form onSubmit={handleSubmit} className="signin-form">
                <h2 className="signin-title">
                    {
                        activeUserType === 'client' ? 'Client Sign In' : 'Agent Sign In'
                    }
                </h2>

                <label htmlFor="email" className="signin-label">
                Email
                </label>
                <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="signin-input"
                required
                />

                <label htmlFor="password" className="signin-label">
                Password
                </label>
                <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="signin-input"
                required
                />

                <button type="submit" className="signin-button">
                Sign In
                </button>

                {/* Create Account and Forgot Password buttons */}
                <div className="secondary-button-container">
                    <button type="button" className="secondary-button" onClick={navigateToForgotPassword}>
                        Forgot Password?
                    </button>
                    <button type="button" className="secondary-button" onClick={navigateToCreateAccount}>
                        Create Account
                    </button>
                </div>
        </form>
    </div>
  )
}

export default Signin
