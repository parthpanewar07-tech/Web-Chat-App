import React, { useState, useEffect } from 'react';
import './chatify.css';
import Splash from './Splash';
import Home from './Home';
import ChatScreen from './ChatScreen';

export default function ChatifyApp() {
  const [view, setView] = useState('splash');
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    // Simulate splash screen delay
    const timer = setTimeout(() => {
      setView('home');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const openChat = (chat) => {
    setActiveChat(chat);
    setView('chat');
  };

  const closeChat = () => {
    setActiveChat(null);
    setView('home');
  };

  return (
    <div className="chatify-container">
      <div className="mobile-mockup">
        {view === 'splash' && <Splash />}
        {view === 'home' && <Home onOpenChat={openChat} />}
        {view === 'chat' && <ChatScreen chat={activeChat} onClose={closeChat} />}
      </div>
    </div>
  );
}
