import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <p className="footer-text">
                    &copy; {new Date().getFullYear()} Opusama. All rights reserved.
                </p>
                <div className="footer-links">
                    <a 
                        href="https://sites.google.com/view/opusama-termsofservice/home"
                        className="footer-link"
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        Terms of Service
                    </a>

                    <a 
                        href="https://sites.google.com/view/opusama/home"
                        className="footer-link"
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        Privacy Policy
                    </a>

                    <a href="/contact" className="footer-link">
                        Contact Us
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;