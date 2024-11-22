import { useState } from 'react'
// import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Sigin from './components/Signin/Sigin';
import Contact from './components/Contact/Contact';
import Offers from './components/Offers/Offers';


function App() {

  return (
    <div className='App'>
      <Hero/>
      <Sigin/>
      <Contact/>
      <Offers/>
    </div>
  )
}

export default App
