import React from 'react';
import Header from '../Header/Header';
import Hero from '../Hero/Hero';
import Signin from '../Signin/Signin';
import Contact from '../Contact/Contact';
import Offers from '../Offers/Offers';
import Footer from '../Footer/Footer';

function Home (){
    return (
        <>
            <Header/>
            <Hero/>
            <Signin/>
            <Contact/>
            <Offers/>
            <Footer/>
        </>
    )
}

export default Home;