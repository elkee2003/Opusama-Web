import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { useNavigate } from "react-router-dom";
import { DataStore, Predicates } from 'aws-amplify/datastore';
import { User, Realtor } from '../../src/models';

// Create the Auth Context
const AuthContext = createContext({});

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // State variables
  const [authUser, setAuthUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [dbRealtor, setDbRealtor] = useState(null);
  const [sub, setSub] = useState(null);
  const [userMail, setUserMail] = useState(null);

  console.log('Current Sub:', sub, 'Database User:', dbUser, 'Database Realtor:', dbRealtor);

  // Fetch the currently authenticated user
  const currentAuthenticatedUser = async () =>{
      try {
        const user = await getCurrentUser();
        setAuthUser(user)
        const subId = authUser?.userId;
        setSub(subId);
        const email = authUser?.signInDetails?.loginId;
        setUserMail(email);
      } catch (err) {
        console.log(err);
      }
  }
  
  // Fetch the current user from the database
  const fetchDbUser = async () => {
    if (!sub) return;
    try {
      const userResult = await DataStore.query(User, (user) => user.sub.eq(sub));
      // DataStore.delete(User, Predicates.ALL)
      // DataStore.clear()
      if (userResult.length === 0) {
        
        setDbUser(null);
      } else {
        setDbUser(userResult[0]);
      }
    } catch (error) {
      console.error('Error fetching database user:', error);
    }
  };

  // Fetch the current realtor from the database
  const fetchDbRealtor = async () => {
    if (!sub) return;
    try {
      const realtorResult = await DataStore.query(Realtor, (realtor) => realtor.sub.eq(sub));
      // DataStore.delete(Realtor, Predicates.ALL)
      // DataStore.clear()
      if (realtorResult.length === 0) {
        
        setDbRealtor(null);
      } else {
        setDbRealtor(realtorResult[0]);
      }
    } catch (error) {
      console.error('Error fetching database realtor:', error);
    }
  };

  // Effect to fetch authenticated user on mount or when `sub` changes
  useEffect(() => {
    currentAuthenticatedUser();
  }, [sub]);

  // Effect to fetch database user when `sub` changes
  useEffect(() => {
    if (sub) {
      fetchDbUser();
      fetchDbRealtor();
    };
  }, [sub]);

  // Listen for Auth events
  useEffect(() => {
    const handleAuthEvents = (data) => {
      const { event } = data.payload;
      if (event === 'signedIn') {
        currentAuthenticatedUser();
      } else if (event === 'signedOut') {
        setAuthUser(null);
        setSub(null);
        setDbUser(null);
        setDbRealtor(null);
        navigate('/');
      }
    };

    const hubListener = Hub.listen('auth', handleAuthEvents);

    return () => hubListener(); // Cleanup listener on unmount
  }, []);

  useEffect(()=>{
      if(!sub){
        return;
      }

      fetchDbUser();
      fetchDbRealtor();
  }, [sub]);


  // Observe changes to the User model
  useEffect(() => {
    if (!dbUser) return;

    const subscription = DataStore.observe(User, dbUser.id).subscribe(({ element, opType }) => {
      if (opType === 'UPDATE') {
        setDbUser(element);
      }
    });

    return () => subscription.unsubscribe();
  }, [dbUser]);

  // Observe deletion of the user model record
  useEffect(() => {
    if (!dbUser) return;

    const deleteSubscription = DataStore.observe(User).subscribe(({ element, opType }) => {
      if (opType === 'DELETE' && element.id === dbUser.id) {
        setDbUser(null);
      }
    });

    return () => deleteSubscription.unsubscribe();
  }, [dbUser]);

  // Observe changes to the Realtor model
  useEffect(() => {
    if (!dbRealtor) return;

    const subscription = DataStore.observe(Realtor, dbRealtor.id).subscribe(({ element, opType }) => {
      if (opType === 'UPDATE') {
        setDbRealtor(element);
      }
    });

    return () => subscription.unsubscribe();
  }, [dbRealtor]);

  // Observe deletion of the realtor model record
  useEffect(() => {
    if (!dbRealtor) return;

    const deleteSubscription = DataStore.observe(Realtor).subscribe(({ element, opType }) => {
      if (opType === 'DELETE' && element.id === dbRealtor.id) {
        setDbRealtor(null);
      }
    });

    return () => deleteSubscription.unsubscribe();
  }, [dbRealtor]);


  return (
    <AuthContext.Provider value={{ authUser, dbUser, setDbUser, dbRealtor, setDbRealtor, sub, userMail }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// Custom Hook to access Auth Context
export const useAuthContext = () => useContext(AuthContext);