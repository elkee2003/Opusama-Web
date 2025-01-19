import React, { useMemo, useRef } from 'react';
import MediaGrid from '../MediaGrid/MediaGrid';
import RealtorProfileHead from '../RealtorProfileHead/RealtorProfileHead';

const RealtorProfileComplete = ({ realtor, posts }) => {

  return (
    <div>
        {/* Realtor Profile Header */}
        <RealtorProfileHead realtor={realtor} />

        {/* Media Grid */}
        <MediaGrid posts={posts} />
    </div>
  );
};

export default RealtorProfileComplete;