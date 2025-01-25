import React, { useState, useEffect } from 'react';
import './ShortAlertList.css'; 
import ShortAlert from '../ShortAlert/ShortAlert';
import { DataStore } from 'aws-amplify/datastore';
import { useAuthContext } from '../../../../../../../Providers/ClientProvider/AuthProvider';
import { Booking, User, Post } from '../../../../../../models'; 

const ShortAlertList = () => {
    const { dbRealtor } = useAuthContext();

    const [alerts, setAlerts] = useState([]);
    const [filteredAlerts, setFilteredAlerts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const fetchedBookings = await DataStore.query(Booking, (b) =>
                b.realtorID.eq(dbRealtor.id)
            );

            const filteredBookings = fetchedBookings
                .filter(
                (booking) =>
                    booking.status === 'PENDING' || booking.status === 'DELAYED_PAYMENT'
                )
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            const bookingWithUserID = await Promise.all(
                filteredBookings.map(async (booking) => {
                if (booking.userID) {
                    const bookedUser = await DataStore.query(User, (u) =>
                    u.id.eq(booking.userID)
                    );

                    // Fetch associated post
                    const post = booking.PostID
                    ? await DataStore.query(Post, (p) => p.id.eq(booking.PostID))
                    : null;

                    return {
                    ...booking,
                    user: bookedUser[0] || null,
                    post: post ? post[0] : null,
                    };
                }
                return { ...booking, user: null, post: null };
                })
            );
            setAlerts(bookingWithUserID);
            setFilteredAlerts(bookingWithUserID)
        } catch (e) {
            <p>Error Fetching bookings</p>;
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
            <p className="noListings">No pending alert or No matching alerts found</p>
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