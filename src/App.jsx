import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthRoutes from './components/Routes/HomePageRoutes/AuthRoutes';
import ClientRoutes from './components/Routes/ClientRoutes/ClientRoutes';
import RealtorRoutes from './components/Routes/RealtorRoutes/RealtorRoutes';
import AuthProvider from '../Providers/ClientProvider/AuthProvider';
import UserProfileProvider from '../Providers/ClientProvider/ProfileProvider';
import ShowingProvider from '../Providers/ClientProvider/ShowingProvider';
import BookingProvider from '../Providers/ClientProvider/BookingProvider';
import BookingShowingProvider from '../Providers/ClientProvider/BookingShowingProvider';

function App() {

  return (
    <div className='App'>
      <Router>
        <AuthProvider>
          {/* Client Providers */}
          <UserProfileProvider>
            <BookingProvider>
              <ShowingProvider>
                <BookingShowingProvider>
                  <Routes>

                    <Route path="/*" element={<AuthRoutes />} />

                    <Route path="/clientcontent/*" element={<ClientRoutes />} />
                          
                    <Route path="/realtorcontent/*" element={<RealtorRoutes />} />
                    
                  </Routes>
                </BookingShowingProvider>
              </ShowingProvider>
            </BookingProvider>
          </UserProfileProvider>
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App
