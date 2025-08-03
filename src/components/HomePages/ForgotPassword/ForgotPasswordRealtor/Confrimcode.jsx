import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import "./Forgotpassword.css";
import Header from '../../Header/Header';
import { confirmResetPassword } from 'aws-amplify/auth';

const ConfirmCode = () => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {}; // Get email from query params
  
  // const email = new URLSearchParams(location.search).get('email'); // Get email from query params
  

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
      navigate(-2); // Navigate to login page after successful reset
    } catch (error) {
      setError(error.message || 'Error confirming reset password');
      console.error('Error confirming reset password:', error);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Header */}
      <Header/>

      {/* Title */}
      <h1>Reset Password</h1>

      {/* Form */}
      <form className="auth-form">
          <label htmlFor="code">Confirmation Code</label>
          <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code sent to your email"
          />
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
                  className="eye-icon-confirmcode"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                   {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
          </div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <button
              type="submit"
              onClick={handleConfirmResetPassword}
              disabled={loading}
          >
              {loading ? 'Submitting...' : 'Submit'}
          </button>
          <button
              className="back-to-signin-btn"
              onClick={() => navigate(-2)}
          >
              Back to Sign In
          </button>
      </form>
    </div>
  );
};

export default ConfirmCode;