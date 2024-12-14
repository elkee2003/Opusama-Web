import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/Header/Header';
// import Hero from './components/Hero/Hero';
import Signin from './components/Signin/Signin'
// import Contact from './components/Contact/Contact';
// import Offers from './components/Offers/Offers';
// import Footer from './components/Footer/Footer';
import Home from './components/HomeScreen';
import Signup from './components/Signup/Signup';
import ConfirmEmail from './components/ConfirmEmail/Confirmemail';
import ForgotPassword from './components/ForgotPassword/Forgotpassword';
import ConfirmCode from './components/ForgotPassword/Confrimcode';


function App() {

  return (
    <div className='App'>
      <Router>
        <Routes>

          <Route path='/' element={<Home/>} />
          
          {/* <Route path="/signin" element={<Signin />} /> */}

          <Route path="/signup" element={<Signup />} />

          <Route path="/confirmemail" element={<ConfirmEmail />} />

          <Route path="/forgotpassword" element={<ForgotPassword />} />

          <Route path="/confirmcode" element={<ConfirmCode />} />

        </Routes>
      </Router>
    </div>
  )
}

export default App
