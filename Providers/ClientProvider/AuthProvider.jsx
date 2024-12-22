import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { router } from 'expo-router';
import { DataStore, Predicates } from 'aws-amplify/datastore';
import { User } from '@/src/models';

// Create the Auth Context
const AuthContext = createContext({});

// Auth Provider Component
const AuthProvider = ({ children }) => {
  // State variables
  const [authUser, setAuthUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [sub, setSub] = useState(null);

  console.log('Current Sub:', sub, 'Database User:', dbUser);

  // Fetch the currently authenticated user
  const currentAuthenticatedUser = async () => {
    try {
      const user = await getCurrentUser();
      setAuthUser(user);
      const subId = user?.userId; // Adjust based on your auth structure
      setSub(subId);
    } catch (err) {
      console.log('Error fetching authenticated user:', err);
    }
  };

  // Fetch the current user from the database
  const dbCurrentUser = async () => {
    if (!sub) return; // Ensure `sub` is available before querying DataStore
    try {
      const dbUserQuery = await DataStore.query(User, (user) => user.sub.eq(sub));

      if (dbUserQuery.length === 0) {
        await DataStore.clear(); // Clear DataStore if no user is found
        setDbUser(null);
      } else {
        setDbUser(dbUserQuery[0]);
      }
    } catch (error) {
      console.error('Error fetching database user:', error);
    }
  };

  // Effect to fetch authenticated user on mount or when `sub` changes
  useEffect(() => {
    currentAuthenticatedUser();
  }, [sub]);

  // Effect to fetch database user when `sub` changes
  useEffect(() => {
    if (sub) dbCurrentUser();
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
        router.push('/login');
      }
    };

    const hubListener = Hub.listen('auth', handleAuthEvents);
    return () => hubListener(); // Cleanup listener on unmount
  }, []);

  // Observe changes to the database user
  useEffect(() => {
    if (!dbUser) return;

    const subscription = DataStore.observe(User, dbUser.id).subscribe(({ element, opType }) => {
      if (opType === 'UPDATE') {
        setDbUser(element);
      }
    });

    return () => subscription.unsubscribe();
  }, [dbUser]);

  // Observe deletion of the user record
  useEffect(() => {
    if (!dbUser) return;

    const deleteSubscription = DataStore.observe(User).subscribe(({ element, opType }) => {
      if (opType === 'DELETE' && element.id === dbUser.id) {
        setDbUser(null);
      }
    });

    return () => deleteSubscription.unsubscribe();
  }, [dbUser]);

  return (
    <AuthContext.Provider value={{ authUser, dbUser, setDbUser, sub }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// Custom Hook to access Auth Context
export const useAuthContext = () => useContext(AuthContext);