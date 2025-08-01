import React, {useEffect, useState} from 'react';
import './Header.css';
import { Link } from 'react-scroll';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import useDarkScreen from '../useDarkScreen/useDarkScreen';


const Header = () => {

    const location = useLocation();

    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);
    const navigate = useNavigate();
    const isDarkScreen = useDarkScreen()

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

    const navigateAndScroll = (path, section) => {
      if (window.location.pathname !== path) {
        navigate(path);
        setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            const elementTop = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: elementTop, behavior: "smooth" });
          }
        }, 100); // Delay to ensure the DOM is rendered
      } else {
        const element = document.getElementById(section);
        if (element) {
          const elementTop = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: elementTop, behavior: "smooth" });
        }
      }
      closeMenu();
    };

    // useEffect for calculating the size of the width of the screen to close the hamburger menu.
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

    // useEffect for scrolling to signin section if user is not signed in, in the detailed page for each top tab.
    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const section = params.get('section');

      if (section) {
        const element = document.getElementById(section);
        if (element) {
          const elementTop = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: elementTop, behavior: "smooth" });
        }
      }
    }, [location]);

  return (
    <section className={`h-wrapper ${isScrolled ? "scrolled" : ""} ${isDarkScreen ? "dark-screen" : ""} `}>
      <div className={`flexCenter paddings innerWidth h-container`}>
          <span
            onClick={() => navigateAndScroll('/', 'hero')}
          >
            <img 
                src={isScrolled ? './opusama.png' : './opusamawhite.png'}
                alt="logo" 
                width={130} 
            />
          </span>

          <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Toggle navigation menu" role="button" tabIndex="0">
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>

          <div className="flexCenter">
              <nav className={`h-menu flexCenter ${menuOpen ? "open" : ""}`}>

                {/* Hero */}
                <span onClick={() => navigateAndScroll('/', 'hero')}>
                  Home
                </span>

                {/* AboutUs */}
                <span onClick={() => navigateAndScroll('/', 'aboutUs')}>
                  About Us
                </span>

                {/* Offers */}
                <span onClick={() => navigateAndScroll('/', 'offers')}>
                  Offers
                </span>

                {/* Sign-in / Get Started */}
                <span onClick={() => navigateAndScroll('/', 'signin')}>
                  Sign In
                </span>

                <span onClick={() => navigateAndScroll('/', 'signin')}>
                  Create Account
                </span>

                {isMobileView && (
                  <span onClick={() => navigateAndScroll('/', 'contact')}>
                    Contact Us
                  </span>
                )}
              </nav>
              <button 
                  className='button'
                  style={{
                      color: "white",
                      background: "var(--blue-gradient)",
                  }}
                  onClick={() => navigateAndScroll('/', 'contact')}
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
