import React, {useState} from 'react';
import './HomeApproved.css'
import { Tabs, Tab, Box } from '@mui/material';
import { IoMdAdd } from "react-icons/io";
import { useAuthContext } from '../../../../../Providers/ClientProvider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import Approved from './Approved/Home';
import UnApproved from './UnApproved/Home';

function HomeApproved() {
    const navigate = useNavigate();
    const {authUser} = useAuthContext();

    const [selectedTab, setSelectedTab] = useState(0);
  
    const handleTabChange = (event, newValue) => {
      setSelectedTab(newValue);
    };

    // Navigate function
    const handleNavigate = () => {
      if(authUser){
        navigate('/clientcontent/create_post');
      }else{
        alert('Sign In to access')
        navigate('/?section=signin');
      }
    };
  
  return (
    <div>
      <div className="homeApproved-Tabs-container">
        <div >
        {/* logo */}
          <div 
              className='client-logoForSmallScreen'
          >
              <img 
                  src={'/opusama.png'}
                  alt="logo" 
                  onClick={() => navigate('/')}
              />
          </div>

          {/* Top Tabs */}
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="navigation tabs"
          >
            <Tab label="Approved" />
            <Tab label="Unapproved" />
          </Tabs>
        </div>
      </div>
      
      <div className="homeApproved-Tab-panel">
        {selectedTab === 0 && <Approved />}
        {selectedTab === 1 && <UnApproved />}
      </div>

    </div>
  )
}

export default HomeApproved;