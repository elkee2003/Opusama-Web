import React, {useEffect, useState} from 'react';
import './Header.css';
import { Link } from 'react-scroll';


const Header = () => {

    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);

    // useeffect to calculate for the navbar to be fixed
    useEffect(() => {
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


    // Functions for the hamburger menu
    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };

    const closeMenu = () =>{
      setMenuOpen(false)
    }

    // useeffect for calculating the size of the width of the screen to close the hamburger menu.
    useEffect(()=>{
      const handleResize = ()=>{
        const isMobile = window.innerWidth <= 800;
        setIsMobileView(isMobile);
        
        if (isMobile) {
          closeMenu();
        }
      };

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
          <Link 
            to="hero" 
            smooth={true} 
            duration={500}
            offset={-70}
            onClick={closeMenu}
          >
            <img 
                src={isScrolled ? './opusama.png' : './opusamawhite.png'}
                alt="logo" 
                width={150} 
            />
          </Link>

          <div className="hamburger" onClick={toggleMenu}>
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>

          <div className="flexCenter">
              <nav className={`h-menu flexCenter ${menuOpen ? "open" : ""}`}>

                {/* Hero */}
                <Link 
                  to="hero" 
                  smooth={true} 
                  duration={500}
                  offset={-70}
                  onClick={closeMenu}
                >
                    Home
                </Link>

                {/* Offers */}
                <Link 
                  to="offers" 
                  smooth={true} 
                  duration={500}
                  offset={-70}
                  onClick={closeMenu}
                >
                    Offers
                </Link>

                {/* Sign-in / Get Started */}
                <Link 
                  to="signin" 
                  smooth={true} 
                  duration={500}
                  offset={-90}
                  onClick={closeMenu}
                >
                    Get Started
                </Link>

                {isMobileView && (
                  <Link 
                    to="contact" 
                    smooth={true} 
                    duration={500}
                    offset={-70}
                    onClick={closeMenu}
                  >
                      Contact Us
                  </Link>
                )}
              </nav>
              <button 
                  className='button'
                  style={{
                      color: "white",
                      background: "var(--blue-gradient)",
                  }}
              >
                  <Link 
                    to="contact" 
                    smooth={true} 
                    duration={500}
                    offset={-70}
                    onClick={closeMenu}
                  >
                    Contact Us
                  </Link>
              </button>
          </div>
      </div>
    </section>
  )
}

export default Header
