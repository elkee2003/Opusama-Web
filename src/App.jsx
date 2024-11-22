import { useState } from 'react'
// import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Signin from './components/Signin/Signin';
import Contact from './components/Contact/Contact';
import Offers from './components/Offers/Offers';
import Footer from './components/Footer/Footer';


function App() {

  return (
    <div className='App'>
      <Hero/>
      <Signin/>
      <Contact/>
      <Offers/>
      <Footer/>
    </div>
  )
}

export default App
