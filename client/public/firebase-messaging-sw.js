importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCmrHzpFPkq-MiwuHNVYyq5P_Y4QQe6X1I",
  authDomain: "web-chat-app-3cd78.firebaseapp.com",
  projectId: "web-chat-app-3cd78",
  storageBucket: "web-chat-app-3cd78.firebasestorage.app",
  messagingSenderId: "128955766837",
  appId: "1:128955766837:web:8b545c9e74b9640984b97c",
  measurementId: "G-V8W4008FRE"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/vite.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
