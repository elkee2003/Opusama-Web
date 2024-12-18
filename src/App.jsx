import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/Header/Header';
// import Hero from './components/Hero/Hero';
import Signin from './components/Signin/Signin'
// import Contact from './components/Contact/Contact';
// import Offers from './components/Offers/Offers';
// import Footer from './components/Footer/Footer';
import Home from './components/HomeScreen';
import ContentClientTabs from './components/ContentTabsClient';
import ContentRealtorTabs from './components/ContentTabsRealtor';
import SignupClient from './components/Signup/SignupClient/Signup';
import SignupRealtor from './components/Signup/SignupRealtor/Signup';
import ConfirmEmailClient from './components/ConfirmEmail/ConfirmEmailClient/Confirmemail';
import ConfirmEmailRealtor from './components/ConfirmEmail/ConfirmEmailRealtor/Confirmemail';
import ForgotPasswordClient from './components/ForgotPassword/ForgotPasswordClient/Forgotpassword';
import ForgotPasswordRealtor from './components/ForgotPassword/ForgotPasswordRealtor/Forgotpassword';
import ConfirmCodeClient from './components/ForgotPassword/ForgotPasswordClient/Confrimcode';
import ConfirmCodeRealtor from './components/ForgotPassword/ForgotPasswordRealtor/Confrimcode';


function App() {

  return (
    <div className='App'>
      <Router>
        <Routes>

          <Route path='/' element={<Home/>} />
          
          <Route path="/clientcontent" element={<ContentClientTabs />} />

          <Route path="/realtorcontent" element={<ContentRealtorTabs />} />

          <Route path="/signupclient" element={<SignupClient />} />

          <Route path="/signuprealtor" element={<SignupRealtor />} />

          <Route path="/confirmemailclient" element={<ConfirmEmailClient />} />
          <Route path="/confirmemailrealtor" element={<ConfirmEmailRealtor />} />

          <Route path="/forgotpasswordclient" element={<ForgotPasswordClient />} />

          <Route path="/forgotpasswordrealtor" element={<ForgotPasswordRealtor />} />

          <Route path="/confirmcodeclient" element={<ConfirmCodeClient />} />

          <Route path="/confirmcoderealtor" element={<ConfirmCodeRealtor />} />

        </Routes>
      </Router>
    </div>
  )
}

export default App
