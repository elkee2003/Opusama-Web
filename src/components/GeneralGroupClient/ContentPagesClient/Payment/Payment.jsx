import React, {useState} from 'react';
import './Payment.css';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import { v4 as uuidv4 } from 'uuid';
import PaystackPop from '@paystack/inline-js';
import Logo from '/opusamaSolo.png';
import { useProfileContext } from '../../../../../Providers/ClientProvider/ProfileProvider';
import { useAuthContext } from '../../../../../Providers/ClientProvider/AuthProvider';
import { useBookingShowingContext } from '../../../../../Providers/ClientProvider/BookingShowingProvider';
import QRCode from "qrcode";
import { Booking } from '../../../../models';
import { uploadData } from "aws-amplify/storage";
import { DataStore } from "aws-amplify/datastore";

const PaymentComponent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {
        firstName,
        phoneNumber,
        setIsPaymentSuccessful,
        paymentPrice,
    } = useProfileContext();

    const {transactionReference,
        setTransactionReference, setTransactionStatus,
        onStatusChange, currentBooking,
        // For guest users
        overAllPrice,
        guestFirstName,
        setGuestFirstName,
        guestLastName,
        setGuestLastName,
        guestPhoneNumber,
        setGuestPhoneNumber,
        guestEmail,
        setGuestEmail,
        guestEventName,
        numberOfPeople,
        accommodationType,
        propertyType,
        currentBookingForGuest,
        resetBookingState
    } = useBookingShowingContext();

    console.log('current full:',currentBookingForGuest, 'just id:', currentBookingForGuest?.id)

    console.log('current dbuser:', currentBooking, 'currentdbuserID:', currentBooking?.id)

    const { userMail, dbUser } = useAuthContext();

    // Verify payment
    const verifyPayment = async (reference) => {
        try {
            setLoading(true);

            const apiUrl = import.meta.env.VITE_API_BASE_URL;

            // const response = await fetch(`${apiUrl}/api/verify-payment`);
            const response = await fetch(`${apiUrl}/verify-payment?reference=${reference}`);
            
            const result = await response.json();

            if (result.success && result.data.status === "success") {
                console.log("Verified payment:", result.data);

                const ticketId = `TICKET-${uuidv4()}`;
                const ticketStatus = "unused";

                setIsPaymentSuccessful(true);

                // ✅ 1. Generate QR data
                const qrData = JSON.stringify({
                    ticketId,
                    accommodationType: accommodationType || "",
                    propertyType: propertyType || "",
                });

                // Use DataURL + convert to Blob
                const qrDataUrl = await QRCode.toDataURL(qrData);
                const qrBlob = await fetch(qrDataUrl).then(res => res.blob());

                // ✅ 2. Upload QR to S3
                const fileKey = `public/qrCodes/${ticketId}.png`;
                const uploadResult = await uploadData({
                    path: fileKey,
                    data: qrBlob,
                    options: { contentType: "image/png" },
                }).result;

                const qrUrl = uploadResult.path;

                // ✅ 3. Save to Booking in DataStore
                await onStatusChange("PAID", reference, "Successful", ticketId, ticketStatus, qrUrl);

                setIsPaymentSuccessful(true);

                // ✅ 4. Call Lambda to send ticket email
                try {
                    const lambdaUrl = "https://qti5lr8sb2.execute-api.eu-north-1.amazonaws.com/staging/sendGuestTicket";

                    const payload = {
                        guestEmail: dbUser ? userMail : guestEmail,
                        guestName: dbUser ? firstName : `${guestFirstName} ${guestLastName}`,
                        eventName: guestEventName,
                        numberOfPeople: numberOfPeople || 1,
                        ticketId,
                        qrUrl,
                    };

                    await fetch(lambdaUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    });

                    console.log("Ticket email sent successfully!");
                } catch (err) {
                    console.error("Error sending ticket email:", err);
                }

                setTimeout(() => {
                    resetBookingState();
                    
                    if (!dbUser) {
                        navigate("/clientcontent/home"); 
                    } else {
                        navigate(-1);
                    }
                }, 1000);
            } else {
                    console.warn("Verification failed:", result);
            }
        } catch (error) {
                console.error("Error verifying payment:", error);
        } finally {
                setLoading(false);
        }
    };

    
    const payWithPaystack = () => {
        const paystack = new PaystackPop();

         // ✅ Fallback to guest info if no dbUser
        const email = dbUser ? userMail : guestEmail;
        const name = dbUser ? firstName : guestFirstName;
        const phone = dbUser ? phoneNumber : guestPhoneNumber;

        if (!email || !phone) {
            alert('Please provide your email and phone number before continuing.');
            return;
        }

        paystack.newTransaction({
            // Test key
            // key: 'pk_test_64145fd844453c5288c6c45bb26a3cbdf439575a',

            // Live Key
            key: 'pk_live_41dc1952adece7d813efac252ad7d86ad8a6bd54',
            email,
            amount: (dbUser ? paymentPrice : overAllPrice) * 100, // Naira to Kobo
            currency: 'NGN',
            ref: 'ps_' + Date.now(),
            metadata: {
                custom_fields: [
                    {
                        display_name: name || 'Guest',
                        variable_name: 'phone',
                        value: phone,
                    },
                ],
            },
            callback: function (response) {
                console.log('Payment success:', response);

                alert('Payment Successful! Ref: ' + response.reference);

                setTransactionReference(response.reference);

                setTransactionStatus('Processing');

                verifyPayment(response.reference);
            },
            onClose: function () {
                setTransactionStatus('Failed');
                setTransactionReference(null);
                alert('Transaction was not completed.');
            },
        });
    };

    return (
        <div className="payContainer">
            <button className="payBckContainer" onClick={() => navigate(-1)}>
                <IoMdArrowBack className="payBckIcon" />
            </button>

            <div className="payLogoCon">
                <img src={Logo} alt="Logo" className="payLogo" />
            </div>

            <div className="sub">
                <input
                    type="text"
                    className="payInput"
                    placeholder={`Amount: ₦${dbUser ? paymentPrice : overAllPrice}`}
                    value={dbUser ? paymentPrice : overAllPrice}
                    readOnly
                />

                <button className="payBtnContainer" onClick={payWithPaystack}>
                    <p className="payBtnTxt">Pay Now</p>
                </button>
            </div>
        </div>
    );
};

export default PaymentComponent;