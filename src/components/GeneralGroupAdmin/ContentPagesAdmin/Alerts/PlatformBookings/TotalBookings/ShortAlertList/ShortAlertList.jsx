import React, { useState, useEffect } from 'react';
import './ShortAlertList.css';
import { useNavigate } from 'react-router-dom';
import ShortAlert from '../ShortAlert/ShortAlert';
import { DataStore } from 'aws-amplify/datastore';
import { useAuthContext } from '../../../../../../../../Providers/ClientProvider/AuthProvider';
import { Booking, User, Post } from '../../../../../../../models';

const ShortAlertList = () => {
    const navigate = useNavigate();
    const { dbUser, authUser } = useAuthContext();

    const [alerts, setAlerts] = useState([]);
    const [filteredAlerts, setFilteredAlerts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [bookingCount, setBookingCount] = useState(0);

    useEffect(()=>{
        if(authUser){
            if(!dbUser){
                alert(
                    'Kindly fill in your data to access pages. Thank you.'
                );
                navigate('/realtorcontent/profile')
            } else if (!dbUser.username) {
                alert('Please fill in your username to proceed.');
                navigate('/realtorcontent/editprofile');
            }
        };
          
    },[dbUser])

    // ✅ Fetch all bookings and count
    const fetchBookings = async () => {
        setLoading(true);
        try {
            // 1️⃣ Fetch all bookings (no realtor filter)
            const fetchedBookings = await DataStore.query(Booking);

            // 2️⃣ Filter only bookings that are pending or delayed, AND have a PostID
            const filteredBookings = fetchedBookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // 3️⃣ Attach user + post info
            const bookingsWithDetails = await Promise.all(
                filteredBookings.map(async (booking) => {
                    const bookedUser = booking.userID
                    ? await DataStore.query(User, booking.userID)
                    : null;

                    const post = booking.PostID
                    ? await DataStore.query(Post, booking.PostID)
                    : null;

                    return {
                        ...booking,
                        user: bookedUser || null,
                        post: post || null,
                    };
                })
            );

            // 4️⃣ Filter again in case some bookings reference deleted posts
            const validBookings = bookingsWithDetails.filter((b) => b.post !== null);

            setAlerts(validBookings);
            setFilteredAlerts(validBookings);
            setBookingCount(validBookings.length); 
        } catch (e) {
            console.error('Error fetching bookings:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBookings();

        const subscription = DataStore.observe(Booking).subscribe(({ opType }) => {
        if (opType === 'INSERT' || opType === 'UPDATE' || opType === 'DELETE') {
            fetchBookings();
        }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchBookings();
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredAlerts(alerts);
            return;
        }

        const lowercasedQuery = query.toLowerCase();
        const filtered = alerts.filter((alert) => {
            const clientFirstName = alert?.clientFirstName?.toLowerCase() || '';
            const clientLastName = alert?.clientLastName?.toLowerCase() || '';
            return (
                clientFirstName.includes(lowercasedQuery) || clientLastName.includes(lowercasedQuery)
            );
        });

        setFilteredAlerts(filtered);
    };


  return (
    <div className="shortAlertListContainer">

        {/* Total bookings */}
        <div 
            className="bookingCountContainer"
        >
            <h3 className="bookingCountText">
            Total Bookings: <span>{bookingCount}</span>
            </h3>
        </div>

        {/* Search Bar */}
        <input
            type="text"
            placeholder="Search by client name"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="alertInputSearch"
        />

        {/* Alert List */}
        {filteredAlerts && filteredAlerts.length > 0 ? (
            <ul className="alertList">
            {filteredAlerts.map((alert) => (
                <ShortAlert key={alert.id} notification={alert} />
            ))}
            </ul>
        ) : (
            <p className="noListings">
                No Paid Booking Found
            </p>
        )}

        {/* Refresh Btn */}
        <div className='alertrefreshMidCon'>
            <button onClick={handleRefresh} className='refreshButton'>
                {refreshing ? "Refreshing..." : "Refresh"}
            </button>
        </div>
    </div>
  );
};

export default ShortAlertList;