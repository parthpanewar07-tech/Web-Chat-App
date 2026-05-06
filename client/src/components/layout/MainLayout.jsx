import React from 'react';
import Sidebar from '../chat/Sidebar';
import ChatArea from '../chat/ChatArea';
import { useChat } from '../../context/ChatContext';

export default function MainLayout() {
  const { activeChat } = useChat();

  return (
    <div className="h-[100dvh] w-full flex overflow-hidden text-white font-sans sm:flex-row flex-col bg-transparent">
      {/* Chat List */}
      <div className={`w-full sm:w-[400px] flex-shrink-0 flex-col h-full relative ${activeChat ? 'hidden sm:flex' : 'flex'}`}>
        <Sidebar />
      </div>

      {/* Chat Screen */}
      <div className={`flex-1 flex-col h-full overflow-hidden relative ${!activeChat ? 'hidden sm:flex' : 'flex'}`}>
        {activeChat ? (
          <ChatArea />
        ) : (
          <div className="hidden sm:flex flex-col items-center justify-center h-full w-full opacity-60">
            <h2 className="text-2xl font-light tracking-wide">No Chat Selected</h2>
          </div>
        )}
      </div>
    </div>
  );
}
