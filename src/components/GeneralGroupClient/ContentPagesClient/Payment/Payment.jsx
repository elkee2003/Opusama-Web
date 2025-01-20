import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import Logo from '/opusamaSolo.png';
import { FLUTTER_WAVE_KEY } from '../../../../../keys';
import { useProfileContext } from '../../../../../Providers/ClientProvider/ProfileProvider';
import { useAuthContext } from '../../../../../Providers/ClientProvider/AuthProvider';
import './Payment.css';

const PaymentComponent = () => {
    const navigate = useNavigate();

    const {firstName, phoneNumber, setIsPaymentSuccessful, paymentPrice, setPaymentPrice} = useProfileContext();

    const {userMail} = useAuthContext();

    console.log('payprice:', paymentPrice)

    const config = {
        public_key: FLUTTER_WAVE_KEY,
        tx_ref: `flw_tx_ref_${Date.now()}`,
        amount: paymentPrice,
        currency: 'NGN',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
        email: userMail,
        phone_number: phoneNumber,
        name: firstName,
        },
        customizations: {
        title: 'My Payment Title',
        description: 'Payment for items in cart',
        logo: Logo, // Replace with a valid URL if necessary
        },
    };

    const handleFlutterPayment = useFlutterwave(config);

  return (
    <div className="payContainer">
        <button className="payBckContainer" onClick={() => navigate(-1)}>
            <IoMdArrowBack className="payBckIcon"  />
        </button>

        <div className="payLogoCon">
            <img src={Logo} alt="Logo" className="payLogo" />
        </div>

        <div className="sub">
            <input
            type="text"
            className="payInput"
            placeholder="Input amount eg: 100"
            value={paymentPrice}
            readOnly
            />

            <button
            className="payBtnContainer"
            onClick={() => {
                handleFlutterPayment({
                callback: (response) => {
                    console.log('Payment Status:', response.status);
                    console.log('Transaction Reference:', response.tx_ref);
                    if (response.status === 'successful') {
                    alert('Payment Successful! Transaction ID: ' + response.transaction_id);
                    navigate(-1); // Navigate back
                    } else if (response.status === 'cancelled') {
                    alert('Payment Cancelled.');
                    } else {
                    alert('Payment Failed. Please try again.');
                    }
                    closePaymentModal(); // Close modal programmatically
                },
                onClose: () => {
                    console.log('Payment modal closed');
                },
                });
            }}
            >
            <p className="payBtnTxt">Pay Now</p>
            </button>
        </div>
    </div>
  );
};

export default PaymentComponent;