import React, { memo } from 'react';
import { FileText } from 'lucide-react';

const ChatBubble = memo(function ChatBubble({ message, isMe, senderName }) {
  const time = message.timestamp?.toDate 
    ? message.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
        
        {senderName && !isMe && (
          <span className="text-[12px] text-white/50 mb-1 ml-2 font-medium">{senderName}</span>
        )}

        <div 
          className={`px-4 py-2.5 overflow-hidden ${
            isMe 
              ? 'bg-[#1A1A1A] text-white border border-accent-red/30 rounded-[16px] rounded-br-[4px]' 
              : 'bg-[#2A2A2A] text-white rounded-[16px] rounded-bl-[4px]'
          }`}
        >
          {/* Media Content */}
          {message.mediaUrl && (
            <div className={`${message.text ? 'border-b border-white/10 pb-2 mb-2' : ''}`}>
              {message.mediaType === 'image' ? (
                <a href={message.mediaUrl} target="_blank" rel="noreferrer">
                  <img 
                    src={message.mediaUrl} 
                    alt="attachment" 
                    className="max-w-full max-h-72 object-cover cursor-pointer rounded-lg"
                  />
                </a>
              ) : (
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-white/70" />
                  <a 
                    href={message.mediaUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[14px] underline text-white"
                  >
                    View File
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Text Content */}
          {message.text && (
            <div className="flex flex-col">
              <p className="text-[15px] leading-[1.4] break-words whitespace-pre-wrap">
                {message.text}
              </p>
              <span className={`text-[10px] mt-1 ${isMe ? 'text-accent-red/60 text-right' : 'text-white/40 text-left'}`}>
                {time}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ChatBubble;
