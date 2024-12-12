import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Signin from './components/Signin/Signin'
import Contact from './components/Contact/Contact';
import Offers from './components/Offers/Offers';
import Footer from './components/Footer/Footer';
import Home from './components/HomeScreen';
import Signup from './components/Signup/Signup';


function App() {

  return (
    <div className='App'>
      <Router>
        <Header/>
        <Routes>

          <Route path='/' element={<Home/>} />
          
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
