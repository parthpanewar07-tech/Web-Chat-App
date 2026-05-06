import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { ChatProvider } from '../context/ChatContext';

export default function Home() {
  return (
    <ChatProvider>
      <MainLayout />
    </ChatProvider>
  );
}
