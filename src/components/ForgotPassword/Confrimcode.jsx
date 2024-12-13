import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./ForgotPassword.css";

const ConfirmCode = () => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email'); // Get email from query params

  // Handle the password reset confirmation
  const handleConfirmResetPassword = async (e) => {
    e.preventDefault();

    if (loading) return;

    // Validate inputs
    if (!code) {
      setError('Confirmation code is required.');
      return;
    }

    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      setError('Password must be at least 8 characters long and include at least one number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
      alert('Password has been reset successfully!');
      navigate('/login'); // Navigate to login page after successful reset
    } catch (error) {
      setError(error.message || 'Error confirming reset password');
      console.error('Error confirming reset password:', error);
    }

    setLoading(false);
  };

  return (
    <div className="confirm-code-container">
      {/* Header */}
      <div className="title-container">
        <h1>Reset Password</h1>
      </div>

      {/* Input Section */}
      <div className="input-section">
        {/* Confirmation Code */}
        <label htmlFor="code">Confirmation Code</label>
        <input
          type="text"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code sent to your email"
        />

        {/* New Password */}
        <label htmlFor="newPassword">New Password</label>
        <div className="password-container">
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
          />
          <button
            type="button"
            className="eye-icon"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Submit Button */}
      <button
        type="submit"
        className="submit-btn"
        onClick={handleConfirmResetPassword}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>

      {/* Back to Sign In */}
      <button
        className="back-to-signin-btn"
        onClick={() => navigate('/login')}
      >
        Back to Sign In
      </button>
    </div>
  );
};

export default ConfirmCode;