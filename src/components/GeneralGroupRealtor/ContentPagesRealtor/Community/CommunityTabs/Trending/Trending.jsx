import React, { useState, useEffect } from 'react';
import './Trending.css'; 

const Trending = () => {

  return (
    <div className="shortAlertListContainer">
        <p>Trending</p>

        {/* Refresh Btn */}
        <div className='refreshCommunCon'>
            {/* <button onClick={handleRefresh} className='refreshButton'>
                {refreshing ? "Refreshing..." : "Refresh"}
            </button> */}
        </div>
    </div>
  );
};

export default Trending;