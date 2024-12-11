import React, {useEffect, useState} from 'react';
import './Header.css';


const Header = () => {

    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // const handleScroll = () => {
        //   const header = document.querySelector(".h-wrapper");
        //   if (window.scrollY > 100) {
        //     header.classList.add("scrolled");
        //     setIsScrolled(true);
        //   } else {
        //     header.classList.remove("scrolled");
        //     setIsScrolled(false);
        //   }
        // };

        const handleScroll = () => {
          if (window.scrollY > 100 && window.innerWidth > 800) {
            setIsScrolled(true);
            
          } else {
            setIsScrolled(false);
          }
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };

    const closeMenu = () =>{
      setMenuOpen(false)
    }

    useEffect(()=>{
      const handleResize = ()=>{
          if (window.innerWidth <= 800){
              closeMenu()
          }
      }
      window.addEventListener('resize', handleResize)

      return ()=>{
          window.removeEventListener("resize", handleResize)
      }
    },[])

    useEffect(()=>{
      if(window.innerWidth <= 1200){
          closeMenu()
      }
    },[])

  return (
    <section className={`h-wrapper ${isScrolled ? "scrolled" : ""}`}>
      <div className={`flexCenter paddings innerWidth h-container`}>
          <img 
              src={isScrolled ? './opusama.png' : './opusamawhite.png'}
              alt="logo" 
              width={150} 
          />

          <div className="hamburger" onClick={toggleMenu}>
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>

          <div className="flexCenter">
              <nav className={`h-menu flexCenter ${menuOpen ? "open" : ""}`}>
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
