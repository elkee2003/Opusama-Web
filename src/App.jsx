import { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import RouteChangeTracker from './components/Analytics/RouteChangeTracker';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthRoutes from './components/Routes/HomePageRoutes/AuthRoutes';
import ClientRoutes from './components/Routes/ClientRoutes/ClientRoutes';
import RealtorRoutes from './components/Routes/RealtorRoutes/RealtorRoutes';
import AdminRoute from './components/Routes/AdminRoutes/AdminRoutes';
// AuthProvider is for both user and realtor
import AuthProvider from '../Providers/ClientProvider/AuthProvider';
import UserProfileProvider from '../Providers/ClientProvider/ProfileProvider';
import ShowingProvider from '../Providers/ClientProvider/ShowingProvider';
import BookingProvider from '../Providers/ClientProvider/BookingProvider';
import BookingShowingProvider from '../Providers/ClientProvider/BookingShowingProvider';
import GoogleMapsProvider from '../Providers/ClientProvider/GoogleMapsProvider';

// Provider for Realtor
import RealtorProfileProvider from '../Providers/RealtorProvider/ProfileProvider';
import UploadContextProvider from '../Providers/RealtorProvider/UploadProvider';
import AdminRoutes from './components/Routes/AdminRoutes/AdminRoutes';

ReactGA.initialize(import.meta.env.VITE_MEASUREMENT_ID);

function App() {

  useEffect(() => {
    ReactGA.send("pageview"); // Sends initial page view
  }, []);

  return (
    <div className='App'>
      <Router>
        <RouteChangeTracker />
        <AuthProvider>
          {/* Client Providers */}
          <UserProfileProvider>
            <BookingProvider>
              <ShowingProvider>
                <BookingShowingProvider>
                  {/* Realtor Providers */}
                  <RealtorProfileProvider>
                    <UploadContextProvider>
                      <GoogleMapsProvider>
                        <Routes>
                          <Route path="/*" element={<AuthRoutes />} />

                          {/* Client Route */}
                          <Route path="/clientcontent/*" element={<ClientRoutes />} />
                                
                          {/* Realtor Route */}
                          <Route path="/realtorcontent/*" element={<RealtorRoutes />} />

                          {/* Admin Route */}
                          <Route path="/admin/*" element={<AdminRoutes />} />
                        </Routes>
                      </GoogleMapsProvider>
                    </UploadContextProvider>
                  </RealtorProfileProvider>
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
