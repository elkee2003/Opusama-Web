import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ForgotPassword.css";
import Header from '../../Header/Header';
import { resetPassword } from 'aws-amplify/auth';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        try {
            const response = await resetPassword({ username: email });
            alert('Reset code sent!');

            // Navigate to the confirm code screen and pass email as a parameter
            navigate('/confirmcodeclient', { state: { email } });
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
            <h1>Forgot Password (Client)</h1>

            {/* Form */}
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