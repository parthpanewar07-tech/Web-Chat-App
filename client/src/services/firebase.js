import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCmrHzpFPkq-MiwuHNVYyq5P_Y4QQe6X1I",
  authDomain: "web-chat-app-3cd78.firebaseapp.com",
  databaseURL: "https://web-chat-app-3cd78-default-rtdb.firebaseio.com",
  projectId: "web-chat-app-3cd78",
  storageBucket: "web-chat-app-3cd78.firebasestorage.app",
  messagingSenderId: "128955766837",
  appId: "1:128955766837:web:8b545c9e74b9640984b97c",
  measurementId: "G-V8W4008FRE"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const messaging = getMessaging(app);

export const requestNotificationPermission = async (userId) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'VLuqM8R1cYHSVL47C_6Om6Uf4yX9UVYcJbgQQxjaWjo' // Your actual VAPID key
      });
      // Store token in user document
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'users', userId), { fcmToken: token }, { merge: true });
      return token;
    }
  } catch (error) {
    // Silently ignore push notification errors to keep the user's console perfectly clean
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
