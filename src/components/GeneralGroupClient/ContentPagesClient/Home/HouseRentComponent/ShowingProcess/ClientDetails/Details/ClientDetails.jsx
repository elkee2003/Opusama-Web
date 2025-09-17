import React, { useState, useEffect } from 'react';
import './ClientDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import UsernameInput from './UsernameInput/UsernameInput';
import { useBookingShowingContext } from '../../../../../../../../../Providers/ClientProvider/BookingShowingProvider';
import { useAuthContext } from '../../../../../../../../../Providers/ClientProvider/AuthProvider';
import { useNavigate } from 'react-router-dom';

const ClientDetails = ({ post }) => {
  const navigate = useNavigate();
  const { dbUser } = useAuthContext();
  const {
    opusingFor, 
    setOpusingFor, 
    otherUsername, 
    setOtherUsername,
    opusedBy, 
    setOpusedBy,
    adults,
    setAdults,
    kids,
    setKids,
    infants,
    setInfants,
    numberOfPeople, 
    setNumberOfPeople,
    numberOfItems, 
    setNumberOfItems,
    postTotalPrice, 
    setOverAllPrice, 
    guestFirstName,
    setGuestFirstName,
    guestLastName,
    setGuestLastName,
    guestPhoneNumber,
    setGuestPhoneNumber,
    note,
    setNote,
    setSubscription,
    errorMessage,
    onValidateHotelInput,
    onValidateRecreationInput,
    onValidatePropertyInput,
    onValidateFoodInput,
  } = useBookingShowingContext();

  // For PropertyType of Recreation
  const [temporaryPrice, setTemporaryPrice] = useState(postTotalPrice);

  // const handleProceedToBooking = () => {
  //   if (post?.propertyType === 'Hotel / Shortlet') {
  //     if (onValidateHotelInput()) {
  //       navigate(`/clientcontent/bookingdetails`);
  //     }
  //   } else if(post?.propertyType === 'Recreation' || post?.propertyType === 'Nightlife') {
  //     if(onValidateRecreationInput()){
  //       navigate(`/clientcontent/reviewinfo`);
  //     }
  //   } else {
  //     if (onValidatePropertyInput()) {
  //       navigate(`/clientcontent/reviewinfo`);
  //     }
  //   }
  // };

  // useEffect to empty input depending on what is choosen myself or another
  useEffect(() => {
    if (opusingFor === "another") {
      setGuestFirstName("");
      setGuestLastName("");
      setGuestPhoneNumber("");
    }
  }, [opusingFor, setGuestFirstName, setGuestLastName, setGuestPhoneNumber]);

  // useEffect for clearing otherusername
  useEffect(() => {
    if (opusingFor === "myself") {
      setOtherUsername("");
    }
  }, [opusingFor, setOtherUsername]);

  // useEffect for saving opused by with dbUser.id
  useEffect(() => {
    if (opusingFor === "another") {
      setOpusedBy(dbUser?.id || "");
    } else if (opusingFor === "myself") {
      setOpusedBy("");
    }
  }, [opusingFor, dbUser, setOpusedBy]);

  // Validator Function
  const getValidator = () => {
    if (post?.propertyType === 'Hotel / Shortlet') return onValidateHotelInput;
    if (post?.propertyType === 'Recreation' || post?.propertyType === 'Nightlife' || post?.propertyType === 'Event')
      return onValidateRecreationInput;
    return onValidatePropertyInput;
  };

  const handleProceedToBooking = () => {
    const validate = getValidator();

    // Subscription booking
    if (post?.isSubscription){
      setSubscription(true);

      // Manual subscription
      if(post?.bookingMode === 'manual'){
        if (post?.propertyType === 'Recreation' && onValidateRecreationInput()){
          navigate(`/clientcontent/bookingdetails`);
          return;
        }
        if (post?.propertyType === 'Food & Drinks' && onValidateFoodInput()) {
          navigate(`/clientcontent/bookingdetails`);
          return;
        }
      }

      // Auto subscription (must always validate)
      if (post?.bookingMode === 'auto_date' || post?.bookingMode === 'auto_datetime' || post?.bookingMode === 'auto_event'){
        if(validate()) {
          navigate(`/clientcontent/bookingdetails`);
        }
        return;
      }
    }

    // Manual booking
    if(post?.bookingMode === 'manual'){
      if (validate()) {
        if (post?.propertyType === 'Hotel / Shortlet' || post?.propertyType === 'Recreation' || post?.propertyType === 'Nightlife') {
          navigate(`/clientcontent/bookingdetails`);
        } else {
          navigate(`/clientcontent/reviewinfo`);
        }
      }
      return;
    }

    // Auto Date or Auto Date_Time booking
    if (post?.bookingMode === 'auto_date' || post?.bookingMode === 'auto_datetime'){
      if (validate()) {
        navigate(`/clientcontent/bookingdetails`);
      }
      return;
    }
    
    // Auto Event
    if (post?.bookingMode === 'auto_event'){
      if (onValidateRecreationInput()) {
        navigate(`/clientcontent/reviewinfo`);
      }
      return;
    }

    // IF condition for old posts
    if (post?.propertyType === 'Hotel / Shortlet') {
      if (onValidateHotelInput()) {
        navigate(`/clientcontent/bookingdetails`);
      }
    } else if(post?.propertyType === 'Recreation' || post?.propertyType === 'Nightlife') {
      if(onValidateRecreationInput()){
        navigate(`/clientcontent/reviewinfo`);
      }
    } else {
      if (onValidatePropertyInput()) {
        navigate(`/clientcontent/reviewinfo`);
      }
    }
  };

  useEffect(()=>{
    if (post?.propertyType === 'Recreation' || post?.propertyType === 'Nightlife'|| post?.propertyType === 'Event') {
      const newTotalPrice = postTotalPrice * numberOfPeople;
      setTemporaryPrice(newTotalPrice);
      setOverAllPrice(newTotalPrice); // Save for global access
    }

    if (post?.propertyType === 'Food & Drinks') {
      const newTotalPrice = postTotalPrice * numberOfItems;
      setTemporaryPrice(newTotalPrice);
      setOverAllPrice(newTotalPrice);
    }
  },[numberOfPeople, numberOfItems, postTotalPrice, setOverAllPrice, post?.propertyType])

  return (
    <div className='clientContainer'>
      <h1 className='header'>
        {post?.propertyType === 'Hotel / Shortlet' ? 'Guest Details' : 'Client Details'}
      </h1>

      {/* Backbutton */}
      <button 
        className='detailBkContainer' 
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon 
          icon={faArrowLeft}
          className='detailBckIcon' 
          size="2x"
        />
      </button>

      <div className="card">
        <label className="txtInputHeader">Opusing for:</label>

        <div className="row">
          <label>
            <input 
              type="radio" 
              value="myself" 
              checked={opusingFor === "myself"} 
              onChange={() => setOpusingFor("myself")} 
            /> Myself
          </label>
          <label style={{ marginLeft: "1rem" }}>
            <input 
              type="radio" 
              value="another" 
              checked={opusingFor === "another"} 
              onChange={() => setOpusingFor("another")} 
            /> Another
          </label>
        </div>
      </div>

      <div className='scrollContainer'>
        {post?.propertyType === 'Hotel / Shortlet' && (
          <div className='card'>
            <div className='row'>
              <div>
                <p className='guest'>Adults</p>
                <p className='age'>Ages 16 or above</p>
              </div>
              <div className='value'>
                <button className='btnValue' onClick={() => setAdults(Math.max(0, adults - 1))}>
                  -
                </button>
                <span className='num'>{adults}</span>
                <button className='btnValue' onClick={() => setAdults(adults + 1)}>
                  +
                </button>
              </div>
            </div>
            <hr className='divider' />

            <div className='row'>
              <div>
                <p className='guest'>Children</p>
                <p className='age'>Ages 2 - 15</p>
              </div>
              <div className='value'>
                <button className='btnValue' onClick={() => setKids(Math.max(0, kids - 1))}>
                  -
                </button>
                <span className='num'>{kids}</span>
                <button className='btnValue' onClick={() => setKids(kids + 1)}>
                  +
                </button>
              </div>
            </div>
            <hr className='divider' />

            <div className='row'>
              <div>
                <p className='guest'>Infants</p>
                <p className='age'>Under 2</p>
              </div>
              <div className='value'>
                <button className='btnValue' onClick={() => setInfants(Math.max(0, infants - 1))}>
                  -
                </button>
                <span className='num'>{infants}</span>
                <button className='btnValue' onClick={() => setInfants(infants + 1)}>
                  +
                </button>
              </div>
            </div>
            <hr className='divider' />
          </div>
        )}

        {/* Counting for Recreation and Nightlife */}
        {(post?.propertyType === 'Recreation' || post?.propertyType === 'Nightlife' || post?.propertyType === 'Event') && (
          <div className='card'>
            <div className='row'>
              <div>
                <p className='guest'>Number of People</p>
                {/* <p className='age'>Ages 16 or above</p> */}
              </div>
              <div className='value'>
                <button className='btnValue' onClick={() => setNumberOfPeople(Math.max(0, numberOfPeople - 1))}>
                  -
                </button>
                <span className='num'>{numberOfPeople}</span>
                <button className='btnValue' onClick={() => setNumberOfPeople(numberOfPeople + 1)}>
                  +
                </button>
              </div>
            </div>

            <div className='row'>
              <p className='age'>Price:</p>
              <p className='value'>₦{temporaryPrice}</p>
            </div>
          </div>
        )}
        {/* Counting for Food & Drinks */}
        {(post?.propertyType === 'Food & Drinks') && (
          <div className='card'>
            <div className='row'>
              <div>
                <p className='guest'>Number of items</p>
                {/* <p className='age'>Ages 16 or above</p> */}
              </div>
              <div className='value'>
                <button className='btnValue' onClick={() => setNumberOfItems(Math.max(0, numberOfItems - 1))}>
                  -
                </button>
                <span className='num'>{numberOfItems}</span>
                <button className='btnValue' onClick={() => setNumberOfItems(numberOfItems + 1)}>
                  +
                </button>
              </div>
            </div>

            <div className='row'>
              <p className='age'>Price:</p>
              <p className='value'>₦{temporaryPrice}</p>
            </div>
          </div>
        )}

        <div className='cardBottom'>
          {opusingFor === 'myself' ? (
            <>
              <label className='txtInputHeader'>First Name:</label>
              <input
                className='txtInput'
                value={guestFirstName}
                onChange={(e) => setGuestFirstName(e.target.value)}
                placeholder="First name of guest(s)"
              />

              <label className='txtInputHeader'>Last Name:</label>
              <input
                className='txtInput'
                value={guestLastName}
                onChange={(e) => setGuestLastName(e.target.value)}
                placeholder="Last name of guest(s)"
              />

              <label className='txtInputHeader'>Phone Number:</label>
              <input
                className='txtInput'
                value={guestPhoneNumber}
                onChange={(e) => setGuestPhoneNumber(e.target.value)}
                placeholder="Phone number"
                type="tel"
              />
            </>
          ) : (
            <>
              <label className='txtInputHeader'>Username:</label>
              <UsernameInput
                value={otherUsername}
                onChange={setOtherUsername}
                placeholder="Enter username"
              />
            </>
          )}

          <label className='txtInputHeader'>
            {post?.propertyType === 'Hotel / Shortlet' ? 'Purpose of Stay' : 'Short Note'}
          </label>
          <textarea
            className='txtInput'
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Purpose of stay (Optional)"
          />
        </div>
      </div>
      <p className='error'>
        {errorMessage}
      </p>

      <button 
        className='nxtBtn' 
        style={{
          backgroundColor: post?.propertyType === 'Hotel / Shortlet' ? '#23a508' : '#060220',
        }}
        onClick={handleProceedToBooking}
      >
        <span className='nxtIcon'>→</span>
      </button>
    </div>
  );
};

export default ClientDetails;