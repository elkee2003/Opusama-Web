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
import { VendorBalance, VendorTransaction, Booking, Realtor } from '../../../../models';
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

    const {
        transactionReference,
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

            const response = await fetch(`${apiUrl}/verify-payment?reference=${reference}`);
            
            const result = await response.json();

            if (!result.success || !result.data) {
                alert("Verification failed, please contact support.");
                setLoading(false);
                return;
            }

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

                // ✅ 5. Handle Vendor Payout Logic
                try {
                    const bookingId = dbUser ? currentBooking?.id : currentBookingForGuest?.id;
                    if (!bookingId) throw new Error("No booking found for payout processing");

                    // 🔹 Fetch booking and realtor
                    const booking = await DataStore.query(Booking, bookingId);
                    if (!booking) throw new Error(`Booking with ID ${bookingId} not found`);

                    const realtor = await DataStore.query(Realtor, booking.realtorID);
                    if (!realtor) throw new Error("Realtor not found");

                    const amount = booking.realtorPrice;
                    const narration = `Payout for booking ${booking.id}`;

                    // 🔹 1️⃣ Update or create VendorBalance
                    let vendorBalance = (await DataStore.query(VendorBalance))
                        .find(vb => vb.realtorID === realtor.id);

                    if (!vendorBalance) {
                        vendorBalance = await DataStore.save(new VendorBalance({
                        realtorID: realtor.id,
                        totalEarned: amount,
                        totalPaid: 0,
                        pendingBalance: amount,
                        lastPayoutDate: null,
                        }));
                    } else {
                        vendorBalance = await DataStore.save(VendorBalance.copyOf(vendorBalance, updated => {
                        updated.totalEarned += amount;
                        updated.pendingBalance = updated.totalEarned - updated.totalPaid;
                        }));
                    }

                    // 🔹 2️⃣ Always create CREDIT transaction when booking completes
                    await DataStore.save(new VendorTransaction({
                        vendorBalanceID: vendorBalance.id,
                        realtorID: realtor.id,
                        bookingID: booking.id,
                        type: "CREDIT",
                        amount,
                        status: "COMPLETED",
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    }));

                    console.log("Vendor CREDIT logged");

                    // 🔹 3️⃣ If realtor uses direct payment, trigger payout
                    if (realtor.directPayment && realtor.accountNumber && realtor.bankCode) {
                        console.log("Direct payment → sending Paystack payout");

                        const payoutPayload = {
                            account_number: realtor.accountNumber,
                            bank_code: realtor.bankCode,
                            amount,
                            narration,
                        };

                        const payoutRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/send-payout`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payoutPayload),
                        });

                        const payoutResult = await payoutRes.json();
                        console.log("Payout result:", payoutResult);

                        if (payoutResult.success) {
                        // 🔹 Update VendorBalance after successful payout
                        vendorBalance = await DataStore.save(VendorBalance.copyOf(vendorBalance, updated => {
                            updated.totalPaid += amount;
                            updated.pendingBalance = updated.totalEarned - updated.totalPaid;
                            updated.lastPayoutDate = new Date().toISOString();
                        }));

                        // 🔹 Log PAYOUT transaction
                        await DataStore.save(new VendorTransaction({
                            vendorBalanceID: vendorBalance.id,
                            realtorID: realtor.id,
                            bookingID: booking.id,
                            type: "PAYOUT",
                            amount,
                            status: "COMPLETED",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        }));

                        console.log("Vendor PAYOUT logged successfully");
                        } else {
                        console.warn("Payout failed:", payoutResult.error);
                        await DataStore.save(new VendorTransaction({
                            vendorBalanceID: vendorBalance.id,
                            realtorID: realtor.id,
                            bookingID: booking.id,
                            type: "PAYOUT",
                            amount,
                            status: "FAILED",
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        }));
                        }
                    } else {
                        console.log("Funds retained (directPayment = false)");
                    }

                    // 🔹 Optional: Notify Realtor
                    await DataStore.save(new Notification({
                      recipientID: realtor.id,
                      recipientType: "REALTOR",
                      type: "PAYOUT",
                      message: `₦${amount.toLocaleString()} credited to your account.`,
                      read: false,
                    }));

                } catch (err) {
                    console.error("Error handling vendor payout:", err);
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
        if (loading) return; 
        setLoading(true); 

        const paystack = new PaystackPop();

         // ✅ Fallback to guest info if no dbUser
        const email = dbUser ? userMail : guestEmail;
        const name = dbUser ? firstName : guestFirstName;
        const phone = dbUser ? phoneNumber : guestPhoneNumber;

        if (!email || !phone) {
            alert('Please provide your email and phone number before continuing.');
            setLoading(false);
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

                setLoading(false);
            },
            onClose: function () {
                setTransactionStatus('Failed');
                setTransactionReference(null);
                alert('Transaction was not completed.');
                setLoading(false);
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

                <button 
                    className="payBtnContainer" 
                    onClick={payWithPaystack}
                    disabled={loading}
                >
                    <p className="payBtnTxt">
                        {loading ? "Processing..." : "Pay Now"}
                    </p>
                </button>
            </div>
        </div>
    );
};

export default PaymentComponent;