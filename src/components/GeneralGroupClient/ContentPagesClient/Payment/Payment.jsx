import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import { v4 as uuidv4 } from 'uuid';
import PaystackPop from '@paystack/inline-js';
import Logo from '/opusamaSolo.png';
import { useProfileContext } from '../../../../../Providers/ClientProvider/ProfileProvider';
import { useAuthContext } from '../../../../../Providers/ClientProvider/AuthProvider';
import { useBookingShowingContext } from '../../../../../Providers/ClientProvider/BookingShowingProvider';
import './Payment.css';

const PaymentComponent = () => {
    const navigate = useNavigate();

    const {
        firstName,
        phoneNumber,
        setIsPaymentSuccessful,
        paymentPrice,
    } = useProfileContext();

    const {transactionReference,
        setTransactionReference, setTransactionStatus,
        onStatusChange
    } = useBookingShowingContext();

    const { userMail } = useAuthContext();

    // Verify payment
    const verifyPayment = async (reference) => {
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://opusama-backend.onrender.com';

            // const response = await fetch(`${apiUrl}/api/verify-payment`);
            const response = await fetch(`${apiUrl}/api/verify-payment?reference=${reference}`);
            
            const result = await response.json();

            if (result.success) {
                console.log('Verified payment:', result.data);

                // ✅ Generate ticket details here
                const ticketId = `TICKET-${uuidv4()}`;
                const ticketStatus = 'unused';

                 // ✅ Save to DataStore via context with full info
                onStatusChange('PAID', reference, 'Successful', ticketId, ticketStatus);

                setIsPaymentSuccessful(true); 
                
                setTimeout(() => {
                    navigate(-1);
                }, 1000);
            } else {
                console.warn('Verification failed');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
        }
    };

    
    const payWithPaystack = () => {
        const paystack = new PaystackPop();

        paystack.newTransaction({
            // Test key
            // key: 'pk_test_64145fd844453c5288c6c45bb26a3cbdf439575a',

            // Live Key
            key: 'pk_live_41dc1952adece7d813efac252ad7d86ad8a6bd54',
            email: userMail,
            amount: paymentPrice * 100, // Naira to Kobo
            currency: 'NGN',
            ref: 'ps_' + Date.now(),
            metadata: {
                custom_fields: [
                    {
                        display_name: firstName,
                        variable_name: 'phone',
                        value: phoneNumber,
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
                    placeholder={`Amount: ₦${paymentPrice}`}
                    value={paymentPrice}
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