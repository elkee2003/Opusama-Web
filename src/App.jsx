import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthRoutes from './components/Routes/HomePageRoutes/AuthRoutes';
import ClientRoutes from './components/Routes/ClientRoutes/ClientRoutes';
import RealtorRoutes from './components/Routes/RealtorRoutes/RealtorRoutes';

function App() {

  return (
    <div className='App'>
      <Router>
        <Routes>

          <Route path="/*" element={<AuthRoutes />} />

          <Route path="/clientcontent/*" element={<ClientRoutes />} />

          <Route path="/realtorcontent/*" element={<RealtorRoutes />} />
          
        </Routes>
      </Router>
    </div>
  )
}

export default App
