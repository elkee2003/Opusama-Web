import React, { useState } from 'react';
import './Signin.css';

const Sigin = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add logic for form submission (e.g., API call)
    };

  return (
    <div className="signin-container">
        <form onSubmit={handleSubmit} className="signin-form">
                <h2 className="signin-title">Sign In</h2>

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
        </form>
    </div>
  )
}

export default Sigin
