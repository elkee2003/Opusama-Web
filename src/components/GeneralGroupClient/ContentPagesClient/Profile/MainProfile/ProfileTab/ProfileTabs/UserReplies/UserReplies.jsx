import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../../../../../../../Providers/ClientProvider/AuthProvider';
import { DataStore } from "aws-amplify/datastore";
import { CommunityDiscussion, CommunityReply, CommunityLike, Realtor, User } from '../../../../../../../../models';

function UserReplies() {
  return (
    <div>
      <p>Loading Replies...</p>
    </div>
  )
}

export default UserReplies

