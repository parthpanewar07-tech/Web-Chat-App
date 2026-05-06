import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loadingChats, setLoadingChats] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setChats([]);
      setActiveChat(null);
      setLoadingChats(false);
      return;
    }

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let chatsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Client-side sorting to bypass Firebase Composite Index requirement
      chatsData.sort((a, b) => {
        const timeA = a.lastMessageTime?.toMillis ? a.lastMessageTime.toMillis() : 0;
        const timeB = b.lastMessageTime?.toMillis ? b.lastMessageTime.toMillis() : 0;
        return timeB - timeA;
      });

      setChats(chatsData);
      
      if (activeChat) {
        const updatedActiveChat = chatsData.find(c => c.id === activeChat.id);
        if (updatedActiveChat) {
          setActiveChat(updatedActiveChat);
        }
      }
      setLoadingChats(false);
    });

    return unsubscribe;
  }, [currentUser]); 

  const value = {
    chats,
    activeChat,
    setActiveChat,
    loadingChats,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
