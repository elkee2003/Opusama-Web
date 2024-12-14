import React, { useState } from 'react';
import './Signup.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 


const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
    const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (!acceptedTerms) {
            alert("You must accept the Terms and Conditions!");
            return;
        }

        console.log("Sign-up form submitted:", formData);
        // Add logic for form submission (e.g., API call)
    };

    // useNavigation
    const navigate = useNavigate();

    const navigateToConfirmEmail = () => {
        navigate('/confirmemail');
    };

    return (
        <div id='signup' className="signup-container">

            {/* Nav Header */}
            <Header/>

            {/* Signup section */}
            <h1 className="primaryText signup-title">Create Account</h1>
            <form onSubmit={handleSubmit} className="signup-form">
                <label htmlFor="email" className="signup-label">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="signup-input"
                    required
                />

                <label htmlFor="password" className="signup-label">
                    Password
                </label>
                <div className="password-container">
                    <input
                        type={isPasswordVisible1 ? 'text' : 'password'}
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="signup-input"
                        required
                    />
                    <button
                        type="button"
                        className="eye-icon-signup"
                        onClick={() => setIsPasswordVisible1(!isPasswordVisible1)}
                    >
                        {isPasswordVisible1 ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <label htmlFor="confirmPassword" className="signup-label">
                    Confirm Password
                </label>
                <div className="password-container">
                    <input
                        type={isPasswordVisible2 ? 'text' : 'password'}
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="signup-input"
                        required
                    />
                    <button
                        type="button"
                        className="eye-icon-signup"
                        onClick={() => setIsPasswordVisible2(!isPasswordVisible2)}
                    >
                        {isPasswordVisible2 ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {/* Signup terms */}
                <div className="signup-terms">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={acceptedTerms}
                        onChange={() => setAcceptedTerms(!acceptedTerms)}
                    />
                    <label htmlFor="terms" className="signup-terms-label">
                        <span>
                            I accept the <a 
                                href="https://sites.google.com/view/opusama-termsofservice/home"
                                className="terms"
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Terms of Use
                            </a>
                        </span>
                        {' '}
                        and
                        {' '}
                        <span>
                        <a 
                            href="https://sites.google.com/view/opusama/home"
                            className="terms"
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Privacy Policy
                        </a>
                        </span>
                    </label>
                </div>

                <button 
                    type="submit"
                    className="signup-button"
                    onClick={navigateToConfirmEmail}
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Signup;