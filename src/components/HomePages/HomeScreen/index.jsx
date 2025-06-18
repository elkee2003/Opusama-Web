import React from 'react';
import Header from '../Header/Header';
import Hero from '../Hero/Hero';
import AboutUs from '../AboutUs/AboutUs';
import Offers from '../Offers/Offers';
import Signin from '../Signin/Signin';
import Contact from '../Contact/Contact';
import Footer from '../Footer/Footer';

function Home (){
    return (
        <>
            <Header/>
            <Hero/>
            <AboutUs/>
            <Offers/>
            <Signin/>
            <Contact/>
            <Footer/>
        </>
    )
}

export default Home;