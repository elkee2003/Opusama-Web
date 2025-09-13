import { useEffect, useState } from 'react';
import './ScannerPage.css';
import { DataStore } from 'aws-amplify/datastore';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../../../../../Providers/ClientProvider/AuthProvider';
import AuthenticatorPage from './AuthenticatorPage';
import { VendorScanner, Booking, User, Post, Realtor } from '../../../../../../models';
import { Html5QrcodeScanner } from 'html5-qrcode';

function ScannerPage() {
    const { authUser, dbUser } = useAuthContext();
    const [searchParams] = useSearchParams();
    const [scanner, setScanner] = useState(null);
    const [vendorName, setVendorName] = useState("");
    const [loading, setLoading] = useState(true);
    const [scannedData, setScannedData] = useState(null);
    const [isScannerActive, setIsScannerActive] = useState(false);

    const navigate = useNavigate();

    // Authentication for AuthUser
    if (!authUser) {
        return (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
                <AuthenticatorPage/>
            </div>
        )
    };
    

    // ✅ Fetch scanner by token
    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            alert("No token provided.");
            setLoading(false);
            return;
        }

        const fetchScanner = async () => {
            try {
                const [match] = await DataStore.query(VendorScanner, (s) =>
                s.token.eq(token)
                );

                if (!match) {
                    alert("Invalid scanner link");
                    setLoading(false);
                    return;
                }

                if (!match.isActive) {
                    alert("This scanner has been revoked.");
                    setLoading(false);
                    return;
                }

                if (match.expiresAt && new Date(match.expiresAt) < new Date()) {
                    alert("This scanner link has expired.");
                    setLoading(false);
                    return;
                }

                setScanner(match);

                // ✅ Fetch the Realtor's firstName using vendorID
                const realtor = await DataStore.query(Realtor, match.vendorID);
                if (realtor) {
                    setVendorName(realtor.firstName);
                }
            } catch (err) {
                console.error("Error fetching scanner:", err);
                alert("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchScanner();
    }, [searchParams]);

    // ✅ Realtime subscription to updates for this scanner
    useEffect(() => {
        if (!scanner) return;

        const subscription = DataStore.observe(VendorScanner, scanner.id).subscribe(
        async ({ opType, element }) => {
            if (opType === "DELETE") {
            alert("This scanner link has been deleted.");
            setScanner(null);
            return;
            }

            if (opType === "UPDATE") {
            if (!element.isActive) {
                alert("This scanner has been revoked.");
                setScanner(null);
                return;
            }

            if (element.expiresAt && new Date(element.expiresAt) < new Date()) {
                alert("This scanner link has expired.");
                setScanner(null);
                return;
            }

            // ✅ keep scanner updated if still valid
            setScanner(element);
            }
        }
        );

        return () => subscription.unsubscribe();
    }, [scanner]);

    // ✅ Check-in booking helper
    const checkInBooking = async (booking) => {
        try {
            await DataStore.save(
                Booking.copyOf(booking, (updated) => {
                    updated.status = "CHECKED_IN";
                    updated.ticketStatus = "Used";
                    if (dbUser?.id) {
                        updated.checkedInByID = dbUser.id;
                    }
                })
            );
        alert(
            `Check-in successful for ${booking.clientFirstName || "User"}`
        );
            // navigate(`/realtorcontent/accepted_details/${booking.id}`);
        } catch (err) {
            console.error("Error updating booking:", err);
            alert("Failed to update booking status.");
        }
    };

    // ✅ Handle scanned QR codes
    useEffect(() => {
        const verifyBooking = async () => {
        if (!scannedData?.ticketId) return;

        try {
            const [match] = await DataStore.query(Booking, (b) =>
            b.ticketID.eq(scannedData.ticketId)
            );

            if (!match) {
            alert("No booking found for this ticket.");
            return;
            }

            // 🔒 Check authorization
            if (match.realtorID !== scanner.vendorID) {
            alert("You are not authorized to check in this booking.");
            return;
            }

            if (match.ticketStatus === "Used") {
            alert("This ticket has already been used.");
            } else {
            await checkInBooking(match);
            }
        } catch (err) {
            console.error("Error verifying booking:", err);
            alert("Something went wrong while verifying ticket.");
        }
        };

        verifyBooking();
    }, [scannedData]);

    // ✅ Initialize QR scanner
    useEffect(() => {
        if (!isScannerActive) return;

        const scannerInstance = new Html5QrcodeScanner('qr-reader', {
        fps: 10,
        qrbox: 250,
        });

        scannerInstance.render(
        (decodedText) => {
            try {
            const data = JSON.parse(decodedText);
            if (!data.ticketId) throw new Error();
            setScannedData(data);
            setIsScannerActive(false);
            scannerInstance.clear();
            } catch {
            alert('Invalid QR code format');
            }
        },
        (errorMessage) => console.warn('QR scan error:', errorMessage)
        );

        return () => {
        scannerInstance.clear().catch((err) => console.error('Failed to clear scanner:', err));
        };
    }, [isScannerActive]);

    if (loading) return <p>Loading scanner...</p>;
    if (!scanner) return <p>No valid scanner found.</p>;

  return (
    <div className='scanner-page-con'>
        <h2>{scanner.name}</h2>
        <p>
            Authorized for vendor: {vendorName || scanner.vendorID}
        </p>

        {scanner.expiresAt && (
            <p>Expires: {new Date(scanner.expiresAt).toLocaleString()}</p>
        )}

        {/* ✅ Toggle Scanner Button */}
        <button 
            onClick={() => setIsScannerActive(true)}
            className="openScannerBtn"
        >
            {isScannerActive ? 'Scanning...' : 'Open QR Scanner'}
        </button>

        {/* ✅ QR Scanner Area */}
        {isScannerActive && (
            <div 
                id="qr-reader" 
                className='qrCodeScaner'></div>
        )}

        {scannedData && (
            <div style={{ marginTop: "20px", color: "green" }}>
                <strong>Last Scan Result:</strong>
                <p>Ticket ID: {scannedData.ticketId}</p>
                <p>Accommodation: {scannedData.accommodationType}</p>
                <p>Property Type: {scannedData.propertyType}</p>
            </div>
        )}
    </div>
  );
}

export default ScannerPage;