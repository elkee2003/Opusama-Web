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
    <div className='adminTabCon'>
      <div className='adminLogoTopTabCon'>
        {/* logo */}
        <div
          className='admin-logoForSmallScreen'
          onClick={() => navigate('/')}
        >
            <img 
                src={'/opusama.png'}
                alt="logo" 
            />
        </div>

        {/* Top Tabs */}
        <div className="admin-home-Top-Tabs-container">
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

      
      <div className="admin-home-Tab-panel">
        {selectedTab === 0 && <Approved />}
        {selectedTab === 1 && <UnApproved />}
      </div>

    </div>
  )
}

export default HomeApproved;