import React, { useMemo, useRef } from 'react';
import './ProfileComplete.css'
import MediaGrid from '../MediaGrid/MediaGrid';
import RealtorProfileHead from '../RealtorProfileHead/RealtorProfileHead';

const RealtorProfileComplete = ({ realtor, posts }) => {

  return (
    <div className='completeProCon'>
        {/* Realtor Profile Header */}
        <RealtorProfileHead realtor={realtor} />

        {/* Media Grid */}
        <MediaGrid posts={posts} />
    </div>
  );
};

export default RealtorProfileComplete;