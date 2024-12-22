import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ConfirmEmail.css';
import Header from '../../Header/Header';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

const ConfirmEmail = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // Extract username (email) from the passed state
    const username = location.state?.username || '';

    const handleConfirm = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        try {
            // Simulating the confirmSignUp logic
            await confirmSignUp({ username, confirmationCode });
            alert('Sign-up confirmed successfully!');
            navigate(-2); // Navigate two steps back
        } catch (error) {
            alert(`Error confirming sign-up: ${error.message || 'An unknown error occurred'}`);
        }
        setLoading(false);
    };

    const handleResendCode = async () => {
        if (resendLoading) return;

        setResendLoading(true);
        try {
            // Call Amplify's resendSignUpCode with username
            await resendSignUpCode({ username });
            alert('Verification code sent to your email.');
        } catch (error) {
            alert(`Error resending code: ${error.message || 'An unknown error occurred'}`);
        }
        setResendLoading(false);
    };

    return (
        <div className="auth-container">
            <Header />
            <h1 className="auth-title">Confirm Your Email (Realtor)</h1>

            {/* Form */}
            <form onSubmit={handleConfirm} className="auth-form">
                <label htmlFor="confirmationCode" className="auth-label">
                    Confirmation Code
                </label>
                <input
                    type="text"
                    id="confirmationCode"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    placeholder="Enter the code sent to your email"
                    className="auth-input"
                    required
                />
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'Confirming...' : 'Confirm'}
                </button>
            </form>

            {/* Resend code */}
            <button onClick={handleResendCode}
            disabled={resendLoading} 
            className="auth-secondary-button">
                {resendLoading ? 'Resending...' : 'Resend Code'}
            </button>
        </div>
    );
};

export default ConfirmEmail;