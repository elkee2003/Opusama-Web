import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ForgotPassword.css";
import Header from '../Header/Header';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        try {
            // Simulating forgotPassword logic
            console.log('Sending reset instructions to:', email);
            alert('Reset instructions sent!');
            navigate('/confirmcode'); // Navigate to reset password page
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            
            {/* Nav Header */}
            <Header/>

            {/* Forgot Password Section */}
            <h1>Forgot Password</h1>
            <form className="auth-form" onSubmit={handleForgotPassword}>
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;