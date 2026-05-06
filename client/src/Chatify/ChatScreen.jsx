import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Phone, Video, Smile, Paperclip, Camera, Mic, Send, CheckCheck, MoreVertical } from 'lucide-react';

const mockMessages = [
  { id: 1, text: 'Hey there! How is the new design coming along?', sender: 'them', time: '10:30 AM' },
  { id: 2, text: 'I just finished the first draft of the UI.', sender: 'me', time: '10:35 AM', status: 'read' },
  { id: 3, text: 'The new design looks absolutely stunning! ✨', sender: 'them', time: '10:42 AM' },
];

export default function ChatScreen({ chat, onClose }) {
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Simulate other person typing after we send a message
    if (messages[messages.length - 1].sender === 'me') {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: 'That sounds great! Can\'t wait to see it live.',
          sender: 'them',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    }]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full w-full page-enter relative bg-[#121212] z-40">
      {/* Header */}
      <div className="glass-nav px-2 pt-12 pb-3 flex items-center justify-between z-20">
        <div className="flex items-center">
          <button 
            onClick={onClose}
            className="p-2 mr-1 rounded-full hover:bg-white/10 transition active:scale-90"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          
          <div className="flex items-center cursor-pointer">
            <div className="relative">
              <img 
                src={chat?.avatar || 'https://i.pravatar.cc/150'} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
              {chat?.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#121212] rounded-full"></div>
              )}
            </div>
            <div className="ml-3">
              <h2 className="font-semibold text-white text-[16px] leading-tight">{chat?.name || 'Contact'}</h2>
              <p className="text-[12px] text-subtle leading-tight">
                {isTyping ? <span className="text-gold">typing...</span> : chat?.online ? 'Online' : 'last seen recently'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-1 pr-2">
          <button className="p-2 rounded-full hover:bg-white/10 transition">
            <Video size={20} className="text-white" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition">
            <Phone size={20} className="text-white" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition">
            <MoreVertical size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 hide-scrollbar flex flex-col space-y-4">
        {/* Date header */}
        <div className="flex justify-center mb-2">
          <span className="glass-panel px-3 py-1 rounded-full text-[11px] font-medium text-subtle">
            Today
          </span>
        </div>

        {messages.map((msg, index) => {
          const isMe = msg.sender === 'me';
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-slide-up`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div 
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl message-bubble shadow-sm ${
                  isMe 
                    ? 'glass-bubble-sent rounded-tr-sm' 
                    : 'glass-bubble-received rounded-tl-sm'
                }`}
              >
                <p className="text-[15px] leading-snug">{msg.text}</p>
              </div>
              <div className="flex items-center mt-1 space-x-1 px-1">
                <span className="text-[10px] text-subtle">{msg.time}</span>
                {isMe && (
                  <CheckCheck size={14} className={msg.status === 'read' ? 'text-blue-400' : 'text-subtle'} />
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start animate-fade-in">
            <div className="glass-bubble-received px-4 py-3 rounded-2xl rounded-tl-sm flex space-x-1 items-center">
              <div className="w-1.5 h-1.5 rounded-full typing-dot" />
              <div className="w-1.5 h-1.5 rounded-full typing-dot" />
              <div className="w-1.5 h-1.5 rounded-full typing-dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 w-full glass-bottom-bar px-3 py-3 pb-8 sm:pb-3">
        <div className="flex items-end space-x-2">
          <div className="flex-1 flex items-center glass-input-area px-2 py-1 min-h-[44px]">
            <button className="p-2 text-subtle hover:text-gold transition">
              <Smile size={22} />
            </button>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message..."
              className="flex-1 bg-transparent border-none focus:outline-none text-white text-[15px] max-h-24 resize-none py-2.5 px-1 hide-scrollbar"
              rows={1}
            />
            <button className="p-2 text-subtle hover:text-white transition">
              <Paperclip size={20} className="-rotate-45" />
            </button>
            {!inputText.trim() && (
              <button className="p-2 text-subtle hover:text-white transition">
                <Camera size={20} />
              </button>
            )}
          </div>
          
          <button 
            onClick={inputText.trim() ? handleSend : undefined}
            className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              inputText.trim() 
                ? 'bg-gold text-[#121212] active:scale-90 shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                : 'glass-panel text-white active:scale-90'
            }`}
          >
            {inputText.trim() ? (
              <Send size={20} className="ml-1" />
            ) : (
              <Mic size={22} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
