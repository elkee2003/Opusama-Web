import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ConfirmEmail.css';
import Header from '../Header/Header';

const ConfirmEmail = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // Assuming the username is passed via state
    const username = location.state?.username || '';

    const handleConfirm = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        try {
            // Simulating the confirmSignUp logic
            console.log('Confirming sign up:', username, confirmationCode);
            alert('Sign-up confirmed successfully!');
            navigate('/login');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
        setLoading(false);
    };

    const handleResendCode = async () => {
        if (resendLoading) return;

        setResendLoading(true);
        try {
            // Simulating the resendSignUpCode logic
            console.log('Resending code to:', username);
            alert('Verification code sent!');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
        setResendLoading(false);
    };

    return (
        <div className="confirm-email-container">
            {/* Nav Header */}
            <Header/>

            {/* Confirm Email Section */}
            <h1>Confirm Your Email</h1>
            <form onSubmit={handleConfirm}>
                <label htmlFor="confirmationCode">Enter Code</label>
                <input
                    type="text"
                    id="confirmationCode"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    placeholder="Enter the code sent to your email"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Confirming...' : 'Confirm'}
                </button>
            </form>
            <button onClick={handleResendCode} disabled={resendLoading}>
                {resendLoading ? 'Resending...' : 'Resend Code'}
            </button>
            <button onClick={() => navigate('/signin')}>Back to Login</button>
        </div>
    );
};

export default ConfirmEmail;