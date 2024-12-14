import React from 'react';
import './Footer.css';

const Footer = () => {

    const navigateToContact = () => {
        const signInElement = document.getElementById('contact');
        if (signInElement) {
            const elementTop = signInElement.getBoundingClientRect().top + window.scrollY - 80; // Adjust for any fixed headers
            window.scrollTo({ top: elementTop, behavior: 'smooth' });
        }
    };

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

                    
                    <button className="footer-link"
                    onClick={navigateToContact}>
                        Contact Us
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;