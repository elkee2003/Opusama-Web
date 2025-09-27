import React, { useState } from 'react';
import './Signin.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { getCurrentUser } from 'aws-amplify/auth';
import { signIn } from 'aws-amplify/auth';

const Signin = () => {
    // useNavigation
    const navigate = useNavigate();
    const [activeUserType, setActiveUserType] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // function for form onchange
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Validate password function
    const validatePassword = (password) => {
        return password.length >= 8 && /\d/.test(password);
    };

    // function for form to submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        // const { email, password } = formData;

        const email = formData.email.trim(); 
        const password = formData.password;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Validate password
        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long and include at least one number.');
            return;
        }

        // Clear error if all validations pass
        setError('');
        setLoading(true);

        try{
            const currentUser = await getCurrentUser();
            if (currentUser) {
                console.log("User already signed in:", currentUser);
                if (activeUserType === 'client') {
                    navigate('/clientcontent/home');
                } else {
                    navigate('/realtorcontent/home');
                }
                return; // Exit the function early
            }
        }catch (authError) {
                // If the user is not authenticated, proceed with sign-in
                console.log("No user is currently signed in. Proceeding with sign-in.");
        }
        

        try {
            const { isSignedIn, nextStep } = await signIn({ username:email, password });

            if(activeUserType === 'client'){
                navigate('/clientcontent/home')
            }else{
                navigate('/realtorcontent/home')
            };
        } catch (error) {
            setError(error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    // Navigation function to Create Account
    const navigateToCreateAccount = () => {
        if (activeUserType === 'client') {
            navigate('/signupclient');
        } else {
            navigate('/signuprealtor');
        }
    };

    // Navigation function to forgot password
    const navigateToForgotPassword = () => {
        if (activeUserType === 'client') {
            navigate('/forgotpasswordclient');
        } else {
            navigate('/forgotpasswordrealtor');
        }
    };

  return (
    <div
        id='signin'
        className="signin-container"
    >

        {/* Title Section */}
        <h1 className="primaryText signin-title-left">Sign In</h1>

        {/* Sign In button */}
        <div className="user-type-buttons">
            <button
                className={`user-type-button ${activeUserType === 'client' ? 'active' : ''}`}
                onClick={() => setActiveUserType('client')}
            >
                <p>Are you a client?</p>
                <p>Click here</p>
            </button>
            <button
                className={`user-type-button ${activeUserType === 'realtor' ? 'active' : ''}`}
                onClick={() => setActiveUserType('realtor')}
            >
                <p>Are you a vendor?</p>
                <p>Click here</p>
            </button>
        </div>

        <div className="signin-accordion">

            {/* Client Form */}
            {activeUserType === 'client' && (
            <div className="accordion-content">
                <form onSubmit={handleSubmit} className="signin-form">
                    <h2 className="signin-title">Client Sign In</h2>
                    {/* Email */}
                    <label htmlFor="email" className="signin-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="signin-input"
                        required
                    />

                    {/* Password */}
                    <label htmlFor="password" className="signin-label">Password</label>
                    <div className="password-container">
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="signin-input"
                            required
                        />
                        <button
                            type="button"
                            className="eye-icon-signin"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Error message */}
                    {error && <div className="error-message">{error}</div>}

                    {/* Signin Terms */}
                    <div className="signin-terms">
                        <div className="signin-terms-label">
                            <span>
                                By signing in you accept the <a href="https://sites.google.com/view/opusama-termsofservice/home" className="terms" target="_blank" rel="noopener noreferrer">Terms of Use</a>
                            </span> 
                            {' '}
                            and 
                            {' '}
                            <span>
                                <a href="https://sites.google.com/view/opusama/home" className="terms" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                            </span>
                        </div>
                    </div>

                    {/* Sign-in Button */}
                    <button type="submit" className="signin-button" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                    {/* Create Account and Forgot Password buttons */}
                    <div className="secondary-button-container">
                        <button type="button" className="secondary-button" onClick={navigateToForgotPassword}>Forgot Password?</button>
                        <button type="button" className="secondary-button" onClick={navigateToCreateAccount}>Create Account</button>
                    </div>
                </form>
            </div>
            )}

            {/* Realtor Form */}
            {activeUserType === 'realtor' && (
            <div className="accordion-content">
                <form onSubmit={handleSubmit} className="signin-form">
                    <h2 className="signin-title">Vendor Sign In</h2>
                    {/* Email */}
                    <label htmlFor="email" className="signin-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="signin-input"
                        required
                    />
                    {/* Password */}
                    <label htmlFor="password" className="signin-label">Password</label>
                    <div className="password-container">
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="signin-input"
                            required
                        />
                        <button
                            type="button"
                            className="eye-icon-signin"
                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    
                    {/* Error message */}
                    {error && <div className="error-message">{error}</div>}

                    {/* Signin Terms */}
                    <div className="signin-terms">
                        <div className="signin-terms-label">
                            <span>
                                By signing in you accept the <a href="https://sites.google.com/view/opusama-termsofservice/home" className="terms" target="_blank" rel="noopener noreferrer">Terms of Use</a>
                            </span> 
                            {' '}
                            and 
                            {' '}
                            <span>
                                <a href="https://sites.google.com/view/opusama/home" className="terms" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                            </span>
                        </div>
                    </div>

                    {/* Sign-in Button */}
                    <button type="submit" className="signin-button" disabled={loading}>
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                    {/* Create Account and Forgot Password buttons */}
                    <div className="secondary-button-container">
                        <button type="button" className="secondary-button" onClick={navigateToForgotPassword}>Forgot Password?</button>
                        <button type="button" className="secondary-button" onClick={navigateToCreateAccount}>Create Account</button>
                    </div>
                </form>
            </div>
            )}   
        </div>

    </div>
  )
}

export default Signin
