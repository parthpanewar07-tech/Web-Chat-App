import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, requestNotificationPermission } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let handleBeforeUnload;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Update user presence/info in Firestore
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL || '',
          status: 'online',
          lastSeen: serverTimestamp(),
        }, { merge: true });

        // Request notification permission and store FCM token
        requestNotificationPermission(user.uid);

        handleBeforeUnload = () => {
          // Cannot use serverTimestamp() in a synchronous unload event reliably
          setDoc(userRef, { status: 'offline', lastSeen: new Date() }, { merge: true });
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
      } else {
        if (handleBeforeUnload) {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        }
      }
      
      setLoading(false);
    });

    return () => {
      if (handleBeforeUnload) {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
