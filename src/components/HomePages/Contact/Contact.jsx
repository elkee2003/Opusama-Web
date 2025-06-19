import React from 'react';
import { FaEnvelope, FaPhone, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter, FaTiktok } from "react-icons/fa6";
import './Contact.css'

const Contact = () => {
  return (
    <section
      id='contact'
      className="c-wrapper"
    >
      <div className="paddings innerWidth flexCenter c-container">
        <div className="flexColStart c-left">
          <span className="greenText">Our Contacts</span>
          <span className="primaryText">Easy to Contact us</span>
          <span className="secondaryText">
            Whether you're listing your space, joining the movement, or need help exploring your next experience — we're always here.
          </span>
          <span className="secondaryText">
            Reach out to us via email, mobile, WhatsApp or Instagram, and we'll get back to you as soon as possible.
          </span>

          {/* Contact details */}
          <div className="contact-details">

            {/* Email and phone in one row */}
            <div className="contact-row">
              <a
                href="mailto:support@opusama.com?subject=Support%20Request&body=Hi%20Opusama%20Support%2C%0A%0AI%20need%20assistance%20with%20the%20following%20issue%3A%0A%0A%5BPlease%20describe%20your%20issue%20here%5D%0A%0AThank%20you%20for%20your%20support.%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D"
              >
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <span>support@opusama.com</span>
                </div>
              </a>

              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+234 902 252 2504</span>
              </div>
            </div>

            {/* Instagram and WhatApp */}
            <div className='contact-row'>
                {/* WhatsApp */}
                <a 
                  href="https://wa.me/2349022522504" 
                  // className="contact-item"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <div className="contact-item">
                      <FaWhatsapp className="contact-icon" />
                      <span>+234 902 252 2504</span>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/opusamaapp/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="contact-item">
                      <FaInstagram className="contact-icon" />
                      <span>@opusamaapp</span>
                  </div>
                </a>
            </div>

            {/* Twitter & Tiktok */}
            <div className="contact-row">
              {/* Twitter */}
              <a
                href="https://x.com/opusamaapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="contact-item">
                    <FaXTwitter className="contact-icon" />
                    <span>@opusamaapp</span>
                </div>
              </a>

              {/* Tiktok*/}
              <a
                href="https://www.tiktok.com/@opusamapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="contact-item">
                    <FaTiktok className="contact-icon" />
                    <span>@opusamaapp</span>
                </div>
              </a>
            </div>

            <span className="secondaryText bold-txt">
              Opusama. Own the City. Live the Experience.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;