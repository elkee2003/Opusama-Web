import React, { useState, useEffect } from 'react';

const Latest = () => {

  return (
    <div className="shortAlertListContainer">
        <p>Latest</p>

        {/* Refresh Btn */}
        <div className='refreshCommunCon'>
            {/* <button onClick={handleRefresh} className='refreshButton'>
                {refreshing ? "Refreshing..." : "Refresh"}
            </button> */}
        </div>
    </div>
  );
};

export default Latest;