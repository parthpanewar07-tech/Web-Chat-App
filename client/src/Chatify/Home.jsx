import React, { useState } from 'react';
import { Search, Camera, MoreVertical, Plus, Check, CheckCheck } from 'lucide-react';

const mockChats = [
  {
    id: 1,
    name: 'Elena Rodriguez',
    avatar: 'https://i.pravatar.cc/150?u=elena',
    lastMessage: 'The new design looks absolutely stunning! ✨',
    timestamp: '10:42 AM',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Alex Chen',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    lastMessage: 'Are we still on for the meeting at 2 PM?',
    timestamp: '09:15 AM',
    unread: 0,
    online: false,
    status: 'read' // read, delivered, sent
  },
  {
    id: 3,
    name: 'Design Team',
    avatar: 'https://i.pravatar.cc/150?u=team',
    lastMessage: 'David: I uploaded the latest Figma file.',
    timestamp: 'Yesterday',
    unread: 5,
    online: true,
  },
  {
    id: 4,
    name: 'Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    lastMessage: 'Thanks for your help! 🙏',
    timestamp: 'Yesterday',
    unread: 0,
    online: false,
    status: 'delivered'
  },
  {
    id: 5,
    name: 'Michael Scott',
    avatar: 'https://i.pravatar.cc/150?u=michael',
    lastMessage: 'That\'s what she said!',
    timestamp: 'Monday',
    unread: 0,
    online: true,
    status: 'read'
  },
  {
    id: 6,
    name: 'Jessica Williams',
    avatar: 'https://i.pravatar.cc/150?u=jessica',
    lastMessage: 'Can you send me the photos from last night?',
    timestamp: 'Sunday',
    unread: 1,
    online: false,
  }
];

export default function Home({ onOpenChat }) {
  const [activeTab, setActiveTab] = useState('chats');

  return (
    <div className="flex flex-col h-full w-full page-enter relative bg-[#121212]">
      {/* Top Bar */}
      <div className="glass-nav px-4 pt-12 pb-4 flex flex-col z-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Chat<span className="text-gold">ify</span>
          </h1>
          <div className="flex space-x-4 text-white">
            <button className="p-2 rounded-full hover:bg-white/10 transition">
              <Search size={22} className="text-white" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition">
              <Camera size={22} className="text-white" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition">
              <MoreVertical size={22} className="text-white" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex w-full relative">
          <div className="flex w-full justify-between pb-2">
            <button 
              className={`flex-1 text-center pb-2 font-medium transition-colors ${activeTab === 'chats' ? 'text-white' : 'text-subtle'}`}
              onClick={() => setActiveTab('chats')}
            >
              Chats
            </button>
            <button 
              className={`flex-1 text-center pb-2 font-medium transition-colors ${activeTab === 'status' ? 'text-white' : 'text-subtle'}`}
              onClick={() => setActiveTab('status')}
            >
              Status
            </button>
            <button 
              className={`flex-1 text-center pb-2 font-medium transition-colors ${activeTab === 'calls' ? 'text-white' : 'text-subtle'}`}
              onClick={() => setActiveTab('calls')}
            >
              Calls
            </button>
          </div>
          {/* Animated Tab Indicator */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10 rounded-full">
            <div 
              className="absolute h-full bg-gold rounded-full transition-transform duration-300 ease-out gold-glow"
              style={{ 
                width: '33.33%', 
                transform: `translateX(${activeTab === 'chats' ? '0%' : activeTab === 'status' ? '100%' : '200%'})`
              }}
            />
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pt-2 pb-24 z-10 px-2">
        {mockChats.map((chat, index) => (
          <div 
            key={chat.id} 
            onClick={() => onOpenChat(chat)}
            className={`stagger-${(index % 5) + 1} flex items-center p-3 mb-1 mx-2 rounded-2xl transition-all duration-200 active:scale-[0.98] active:bg-white/5 hover:bg-white/5 cursor-pointer`}
          >
            {/* Avatar */}
            <div className="relative">
              <img 
                src={chat.avatar} 
                alt={chat.name} 
                className="w-14 h-14 rounded-full object-cover border border-white/10"
              />
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#121212] rounded-full"></div>
              )}
            </div>

            {/* Content */}
            <div className="ml-4 flex-1 overflow-hidden">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-white text-[16px] truncate">{chat.name}</h3>
                <span className={`text-[12px] font-medium ${chat.unread > 0 ? 'text-gold' : 'text-subtle'}`}>
                  {chat.timestamp}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center flex-1 overflow-hidden">
                  {chat.unread === 0 && chat.status && (
                    <span className="mr-1 opacity-70">
                      {chat.status === 'read' ? <CheckCheck size={16} className="text-blue-400" /> : <Check size={16} className="text-subtle" />}
                    </span>
                  )}
                  <p className={`text-[14px] truncate ${chat.unread > 0 ? 'text-white font-medium' : 'text-subtle'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
                
                {/* Unread Badge */}
                {chat.unread > 0 && (
                  <div className="ml-2 min-w-[20px] h-5 rounded-full bg-gold flex items-center justify-center px-1.5 shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                    <span className="text-[11px] font-bold text-black">{chat.unread}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button className="absolute bottom-6 right-6 w-14 h-14 rounded-2xl glass-panel flex items-center justify-center z-30 transition-transform active:scale-95 shadow-lg shadow-black/50 overflow-hidden group">
        <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Plus size={28} className="text-gold z-10" />
      </button>
    </div>
  );
}
