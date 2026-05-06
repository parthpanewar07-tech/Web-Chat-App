import React, { useEffect, useState, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import MessageInput from './MessageInput';
import ChatBubble from './ChatBubble';
import { ChevronLeft } from 'lucide-react';

export default function ChatArea() {
  const { activeChat, setActiveChat } = useChat();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeChat && activeChat.unreadCount[currentUser.uid] > 0) {
      const chatRef = doc(db, 'chats', activeChat.id);
      updateDoc(chatRef, {
        [`unreadCount.${currentUser.uid}`]: 0
      }).catch(err => {});
    }
  }, [activeChat, currentUser.uid]);

  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

    const messagesRef = collection(db, 'chats', activeChat.id, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      scrollToBottom();
    });

    return unsubscribe;
  }, [activeChat?.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (!activeChat) return null;

  const otherUserIds = activeChat.participants.filter(id => id !== currentUser.uid);

  return (
    <div className="flex-1 flex flex-col h-full relative">
      {/* Header */}
      <div className="h-[72px] px-4 bg-[#121212] border-b border-[#2A2A2A] flex items-center shrink-0 absolute top-0 left-0 right-0 z-10 gap-3">
        <button 
          onClick={() => setActiveChat(null)}
          className="sm:hidden p-1 -ml-1 text-white/80 hover:text-white flex items-center shrink-0"
        >
          <ChevronLeft size={28} strokeWidth={2} />
        </button>

        {/* Profile Image & Status */}
        {(() => {
          let chatTitle = 'Chat';
          if (activeChat.type === 'group') {
            chatTitle = activeChat.groupDetails?.name || 'Group';
          } else {
            const otherUserId = activeChat.participants.find(id => id !== currentUser.uid);
            chatTitle = activeChat.participantDetails[otherUserId]?.displayName || 'User';
          }
          
          const isTyping = activeChat.typing && Object.entries(activeChat.typing).some(([uid, typing]) => typing && uid !== currentUser.uid);

          return (
            <>
              <div className="w-[42px] h-[42px] rounded-full bg-[#2A2A2A] flex items-center justify-center text-[18px] font-bold text-white shrink-0">
                {chatTitle[0]?.toUpperCase()}
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-[16px] font-semibold text-white leading-tight">{chatTitle}</h3>
                <span className={`text-[13px] ${isTyping ? 'text-accent-gold' : 'text-white/50'}`}>
                  {isTyping ? 'Typing...' : 'Online'}
                </span>
              </div>
            </>
          );
        })()}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pt-[80px] pb-4 px-4 custom-scrollbar">
        <div className="space-y-1.5">
          {messages.map((msg, index) => {
            const isMe = msg.senderId === currentUser.uid;
            const senderName = (!isMe && activeChat.type === 'group') 
              ? activeChat.participantDetails[msg.senderId]?.displayName 
              : null;
              
            return <ChatBubble 
              key={msg.id} 
              message={msg} 
              isMe={isMe} 
              senderName={senderName} 
            />;
          })}
        </div>
        
        {/* Typing Indicator */}
        {activeChat.typing && Object.entries(activeChat.typing).some(([uid, isTyping]) => isTyping && uid !== currentUser.uid) && (
          <div className="flex items-center mt-3 ml-2">
            <div className="bg-[#2A2A2A] px-4 py-3 rounded-[16px] w-16">
               <div className="flex gap-1 items-center justify-center h-full">
                 <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                 <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                 <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="shrink-0 pb-6 sm:pb-4 pt-2">
        <MessageInput chatId={activeChat.id} otherUserIds={otherUserIds} />
      </div>
    </div>
  );
}
