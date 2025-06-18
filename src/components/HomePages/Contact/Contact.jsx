import React from 'react';
import { FaEnvelope, FaPhone, FaInstagram, FaWhatsapp } from 'react-icons/fa';
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
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>support@opusama.com</span>
              </div>

              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+234 902 252 2504</span>
              </div>
            </div>

            {/* Instagram and WhatApp */}
            <div className='contact-row'>
                {/* WhatsApp */}
                <div className="contact-item">
                    <FaWhatsapp className="contact-icon" />
                    <span>+234 902 252 2504</span>
                </div>

                {/* Instagram */}
                <div className="contact-item">
                    <FaInstagram className="contact-icon" />
                    <span>@opusamaapp</span>
                </div>
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