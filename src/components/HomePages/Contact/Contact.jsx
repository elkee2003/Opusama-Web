import React from 'react';
import { FaEnvelope, FaPhone, FaInstagram, FaWhatsapp, FaLongArrowAltLeft } from 'react-icons/fa';
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
            Tap any of the options below — we're all ears and ready to help.
          </span>

          <div className='swipe-left-con'>
            <FaLongArrowAltLeft className='swipe-left-icon'/>
            <p>swipe to see more options</p>
          </div>

          {/* Contact details */}
          <div className="contact-details">
            {/* Email */}
            <a
              href="mailto:support@opusama.com?subject=Support%20Request&body=Hi%20Opusama%20Support%2C%0A%0AI%20need%20assistance%20with%20the%20following%20issue%3A%0A%0A%5BPlease%20describe%20your%20issue%20here%5D%0A%0AThank%20you%20for%20your%20support.%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D"
            >
              <div className='contact-item-con'>
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <span>support@opusama.com</span>
                </div>
              </div>
            </a>

            {/* Phone Number */}
            <div className='contact-item-con'>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+234 902 252 2504</span>
              </div>
            </div>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/2349022522504" 
              // className="contact-item"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <div className='contact-item-con'>
                <div className="contact-item">
                    <FaWhatsapp className="contact-icon" />
                    <span>+234 902 252 2504</span>
                </div>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/opusamaapp/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className='contact-item-con'>
                <div className="contact-item">
                    <FaInstagram className="contact-icon" />
                    <span>@opusamaapp</span>
                </div>
              </div>
            </a>

            {/* Twitter */}
              <a
                href="https://x.com/opusamaapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className='contact-item-con'>
                  <div className="contact-item">
                      <FaXTwitter className="contact-icon" />
                      <span>@opusamaapp</span>
                  </div>
                </div>
              </a>

            {/* Tiktok*/}
              <a
                href="https://www.tiktok.com/@opusamapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className='contact-item-con'>
                  <div className="contact-item">
                      <FaTiktok className="contact-icon" />
                      <span>@opusamaapp</span>
                  </div>
                </div>
              </a>
          </div>

          {/* Write up */}
          <div className="secondaryText bold-txt">
            Opusama. Own the City. Live the Experience.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;