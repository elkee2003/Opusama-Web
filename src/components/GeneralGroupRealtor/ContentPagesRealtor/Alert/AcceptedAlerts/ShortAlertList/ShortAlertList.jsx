import React, { useState, useEffect } from 'react';
import './ShortAlertList.css'; 
import ShortAlert from '../ShortAlert/ShortAlert';
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from 'html5-qrcode';
import { DataStore } from 'aws-amplify/datastore';
import { useAuthContext } from '../../../../../../../Providers/ClientProvider/AuthProvider';
import { Booking, User, Post } from '../../../../../../models'; 

const ShortAlertList = () => {
    const { dbRealtor } = useAuthContext();

    const navigate = useNavigate();

    const [isScannerActive, setIsScannerActive] = useState(false);
    const [scannedData, setScannedData] = useState(null);

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

            const filteredBookings = fetchedBookings.filter((booking)=>booking.status === 'ACCEPTED' || booking.status === 'PAID' || booking.status === 'VIEWING' || booking.status === 'CHECKED_IN' || booking.status === 'VISITING' || booking.status === 'VIEWED' || booking.status === 'CHECKED_OUT' || booking.status === 'VISITED' || booking.status === 'SOLD' || booking.status === 'RECEIVED' || booking.status === 'REMOVED_CLIENT').sort((a, b)=> new Date(b.createdAt) - new Date(a.createdAt));

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
            // Preserve filtered state if search is active
            if (!searchQuery) {
                setFilteredAlerts(bookingWithUserID);
            } else {
                handleSearch(searchQuery); 
            } 
        } catch (e) {
            <p>Error Fetching bookings</p>;
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const updateBookingStatus = async (bookingId, newStatus) => {
      try {
        const bookingToUpdate = await DataStore.query(Booking, bookingId);
        if (bookingToUpdate) {
          await DataStore.save(
            Booking.copyOf(bookingToUpdate, updated => {
              updated.status = newStatus;
            })
          );
        }
      } catch (e) {
        console.error('Error updating booking status:', e);
      }
    };

    // function to update TicketStatus
    const updateTicketStatusToUsed = async (bookingId) => {
        try {
            const original = await DataStore.query(Booking, bookingId);
            if (original) {
            await DataStore.save(
                Booking.copyOf(original, updated => {
                updated.ticketStatus = 'Used'; // or "used" if lowercase
                })
            );
            alert("Ticket status updated to Used");
            }
        } catch (error) {
            console.error("Error updating ticket status:", error);
            alert("Failed to update ticket status.");
        }
    };

    // updating realtime data
    useEffect(() => {
        fetchBookings();

        const subscription = DataStore.observe(Booking).subscribe(msg => {
            if (msg.opType === 'UPDATE') {
                const updated = msg.element;
                setAlerts(prev =>
                prev.map(b => (b.id === updated.id ? { ...b, ...updated } : b))
                );
            }
        });

        return () => subscription.unsubscribe();
    }, [[dbRealtor?.id]]);

    // For refresh
    const handleRefresh = () => {
        setRefreshing(true);
        fetchBookings();
    };

    // For search
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
            const clientPhoneNumber = alert?.clientPhoneNumber?.toLowerCase() || '';
            const ticketID = alert?.ticketID?.toLowerCase() || '';
            return (
                clientFirstName.includes(lowercasedQuery) || clientLastName.includes(lowercasedQuery) ||
                clientPhoneNumber.includes(lowercasedQuery) || ticketID.includes(lowercasedQuery)
            );
        });

        setFilteredAlerts(filtered);
    };


    // useEffect for QR Code
    useEffect(() => {
        if (!isScannerActive) return;

        const scanner = new Html5QrcodeScanner("qr-reader", {
            fps: 10,
            qrbox: 250
        });

        scanner.render(
            (decodedText, decodedResult) => {
                try {
                const data = JSON.parse(decodedText); // assuming it's JSON
                if (!data.ticketId) throw new Error();
                setScannedData(data);
                setIsScannerActive(false); 
                scanner.clear(); 
                } catch (e) {
                alert("Invalid QR code format");
                }
            },
            (errorMessage) => {
                console.warn("QR scan error:", errorMessage);
            }
        );

        return () => {
            scanner.clear().catch((error) => console.error("Scanner cleanup error", error));
        };
    }, [isScannerActive]);

    // useEffect to find scannedData and find booking
    useEffect(() => {
        if (scannedData?.ticketId) {
            const match = alerts.find(alert => alert.ticketID === scannedData.ticketId);

            if (!match) {
            alert("No booking found for this ticket.");
            return;
            }

            // Prevent duplicate check-in
            if (match.ticketStatus === 'Used') {
                alert("This ticket has already been used.");
            }else {
                // Update both booking status and ticket status
                updateBookingStatus(match.id, "CHECKED_IN");

                updateTicketStatusToUsed(match.id);

                alert(`Check-in successful for ${match?.clientFirstName || "User"}`);
            }

            navigate(`/realtorcontent/accepted_details/${match.id}`);
        }
    }, [scannedData]);


  return (
    <div className="shortAlertListContainer">
        {/* Search Bar */}
        <input
            type="text"
            placeholder="Search name, number or ticket"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="alertInputSearch"
        />

        {/* Scan QR Code Section */}

        {/* Toggle Scanner Button */}
        <button onClick={() => setIsScannerActive(true)} className="openScannerBtn">
            {isScannerActive ? "Scanning..." : "Open QR Scanner"}
        </button>

        {/* QR Scanner Area */}
        {isScannerActive && (
        <div id="qr-reader" className='qrCodeScaner'></div>
        )}

        {/* Alert List */}
        {filteredAlerts && filteredAlerts.length > 0 ? (
            <ul className="alertList">
            {filteredAlerts.map((alert) => (
                <ShortAlert 
                    key={alert.id}
                    notification={alert} 
                    onUpdateStatus={updateBookingStatus}
                />
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