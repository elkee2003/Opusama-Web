import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/HomeScreen';

import SignupClient from './components/Signup/SignupClient/Signup';
import SignupRealtor from './components/Signup/SignupRealtor/Signup';
import ConfirmEmailClient from './components/ConfirmEmail/ConfirmEmailClient/Confirmemail';
import ConfirmEmailRealtor from './components/ConfirmEmail/ConfirmEmailRealtor/Confirmemail';
import ForgotPasswordClient from './components/ForgotPassword/ForgotPasswordClient/Forgotpassword';
import ForgotPasswordRealtor from './components/ForgotPassword/ForgotPasswordRealtor/Forgotpassword';
import ConfirmCodeClient from './components/ForgotPassword/ForgotPasswordClient/Confrimcode';
import ConfirmCodeRealtor from './components/ForgotPassword/ForgotPasswordRealtor/Confrimcode';

// import Layout and Sidebar for client
import ClientLayout from './components/GeneralGroupClient/ContentLayout'
import HomeClient from './components/GeneralGroupClient/ContentPagesClient/Home/Home';
import Explore from './components/GeneralGroupClient/ContentPagesClient/Explore/Explore';
import Bookings from './components/GeneralGroupClient/ContentPagesClient/Bookings/Bookings';
import ClientProfile from './components/GeneralGroupClient/ContentPagesClient/Profile/Profile';

// import Layout and Sidebar Pages for Realtor
import RealtorLayout from './components/GeneralGroupRealtor/ContentLayout';
import HomeRealtor from './components/GeneralGroupRealtor/ContentPagesRealtor/Home/Home';
import Upload from './components/GeneralGroupRealtor/ContentPagesRealtor/Upload/Upload';
import Alert from './components/GeneralGroupRealtor/ContentPagesRealtor/Alert/Alert';
import RealtorProfile from './components/GeneralGroupRealtor/ContentPagesRealtor/Profile/Profile';


function App() {

  return (
    <div className='App'>
      <Router>
        <Routes>

          <Route path='/' element={<Home/>} />
      

          <Route path="/signupclient" element={<SignupClient />} />

          <Route path="/signuprealtor" element={<SignupRealtor />} />

          <Route path="/confirmemailclient" element={<ConfirmEmailClient />} />
          <Route path="/confirmemailrealtor" element={<ConfirmEmailRealtor />} />

          <Route path="/forgotpasswordclient" element={<ForgotPasswordClient />} />

          <Route path="/forgotpasswordrealtor" element={<ForgotPasswordRealtor />} />

          <Route path="/confirmcodeclient" element={<ConfirmCodeClient />} />

          <Route path="/confirmcoderealtor" element={<ConfirmCodeRealtor />} />

          {/* <Route path='/clientcontent' element={<ClientLayout/>} >
            <Route path='home' element={<HomeClient />} />
            <Route path='explore' element={<Explore />} />
            <Route path='bookings' element={<Bookings />} />
            <Route path='profile' element={<ClientProfile />} />
          </Route> */}

        </Routes>
      </Router>
    </div>
  )
}

export default App
