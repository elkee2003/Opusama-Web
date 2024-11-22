import React, {useEffect, useState} from 'react';
import './Header.css';

const Header = () => {

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
          const header = document.querySelector(".h-wrapper");
          if (window.scrollY > 100) {
            header.classList.add("scrolled");
            setIsScrolled(true);
          } else {
            header.classList.remove("scrolled");
            setIsScrolled(false);
          }
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
    }, []);

  return (
    <section className="h-wrapper">
        <div className="flexCenter paddings innerWidth h-container">
            <img 
                src={isScrolled ? './opusama.png' : './opusamawhite.png'}
                alt="logo" 
                width={150} 
            />

            <div className="flexCenter">
                <nav className="h-menu flexCenter">
                <a href="">
                    Home
                </a>
                <a href="">
                    Offers
                </a>
                <a href="">
                    Get Started
                </a>
                </nav>
                <button 
                    className='button'
                    style={{
                        color: "white",
                        background: "var(--blue-gradient)",
                    }}
                >
                    <a href="">Contact Us</a>
                </button>
            </div>
        </div>
    </section>
  )
}

export default Header
