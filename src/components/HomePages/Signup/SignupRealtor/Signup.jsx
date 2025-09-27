import React, { useState } from 'react';
import './Signup.css';
import Header from '../../Header/Header';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { signUp } from 'aws-amplify/auth';


const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
    const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // useNavigation
    const navigate = useNavigate();

    // Automatically assign a role (for user app example)
    const role = "realtor";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Validate password function
    const validatePassword = (password) => {
        return password.length >= 8 && /\d/.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        const { email, password, confirmPassword } = formData;

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

        // Ensure passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        // Ensure terms are accepted
        if (!acceptedTerms) {
            setError("Kindly accept the Terms of Use and Privacy Policy.");
            return;
        }

        // Clear error if all validations pass
        setError('');
        setLoading(true);

        try {
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username:email,
                password,
                options: {
                  userAttributes: {
                    email,
                    'custom:role': role, // Automatically add the custom role attribute
                  },
                  autoSignIn: true 
                }
            });

            navigate('/confirmemailrealtor', { state: { username: email } });
        } catch (error) {
            setError(error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id='signup' className="signup-container">

            {/* Nav Header */}
            <Header/>

            {/* Signup section */}
            <h1 className="primaryText signup-title">Create Account (Vendor)</h1>

            {/* Form */}
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

                {/* Error message */}
                {error && (
                    <div className="error-message">
                    {error}
                    </div>
                )}

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
                    disabled={loading}
                >
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default Signup;