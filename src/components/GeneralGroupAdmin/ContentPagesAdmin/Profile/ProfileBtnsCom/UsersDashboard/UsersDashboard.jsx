import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './UsersDashboard.css';
import { DataStore } from 'aws-amplify/datastore';
import { User, Realtor } from '../../../../../../models';

function UserDashboard() {
    const navigate = useNavigate();
    const [userCount, setUserCount] = useState(0);
    const [realtorCount, setRealtorCount] = useState(0);

    // Fetch Users
    const fetchUsers = async () => {
        try {
        const users = await DataStore.query(User);
        setUserCount(users.length);
        } catch (error) {
        console.error('Error fetching users:', error);
        }
    };

    // Fetch Realtors
    const fetchRealtors = async () => {
        try {
        const realtors = await DataStore.query(Realtor);
        setRealtorCount(realtors.length);
        } catch (error) {
        console.error('Error fetching realtors:', error);
        }
    };

    // Fetch counts on mount + subscribe to real-time updates
    useEffect(() => {
        fetchUsers();
        fetchRealtors();

        const userSubscription = DataStore.observe(User).subscribe(() => fetchUsers());
        const realtorSubscription = DataStore.observe(Realtor).subscribe(() => fetchRealtors());

        return () => {
        userSubscription.unsubscribe();
        realtorSubscription.unsubscribe();
        };
    }, []);

    const totalCount = userCount + realtorCount;

  return (
    <div className="dashboard-container">
        <h2 className='dashboard-header'>
            Dashboard
        </h2>

        <div className="dashboard-cards">
            {/* User */}
            <div 
                onClick={()=>navigate('/admin/user_dashboard')}
                className="dashboard-card"
            >
                <p className="count">{userCount}</p>
                <p className="label">Users</p>
            </div>

            {/* Vendor */}
            <div 
                onClick={()=> navigate('/admin/vendor_dashboard')}
                className="dashboard-card"
            >
                <p className="count">{realtorCount}</p>
                <p className="label">Vendors</p>
            </div>

            {/* Total */}
            <div 
                className="dashboard-card total"
            >
                <p className="count">{totalCount}</p>
                <p className="label">Total</p>
            </div>
        </div>
    </div>
  )
}

export default UserDashboard;
