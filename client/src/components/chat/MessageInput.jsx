import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Paperclip, Smile, X, Loader2, Plus } from 'lucide-react';
import { addDoc, collection, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import EmojiPicker from 'emoji-picker-react';
import { v4 as uuidv4 } from 'uuid';

export default function MessageInput({ chatId, otherUserIds }) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const { currentUser } = useAuth();
  
  const fileInputRef = useRef(null);
  const emojiRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Close emoji picker on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = async (e) => {
    e?.preventDefault();
    if ((!text.trim() && !mediaFile) || isSending) return;

    const messageText = text.trim();
    setText('');
    setIsSending(true);
    setShowEmoji(false);

    try {
      let mediaUrl = null;
      let mediaType = null;

      if (mediaFile) {
        const fileExtension = mediaFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const storageRef = ref(storage, `chats/${chatId}/${fileName}`);
        
        const uploadTask = uploadBytesResumable(storageRef, mediaFile);
        
        mediaUrl = await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', null, reject, async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          });
        });
        
        mediaType = mediaFile.type.startsWith('image/') ? 'image' : 'file';
        setMediaFile(null);
      }

      const messageData = {
        text: messageText,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
        status: 'sent',
        readBy: [currentUser.uid]
      };

      if (mediaUrl) {
        messageData.mediaUrl = mediaUrl;
        messageData.mediaType = mediaType;
      }

      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, messageData);

      const chatRef = doc(db, 'chats', chatId);
      const updates = {
        lastMessage: mediaUrl ? (mediaType === 'image' ? 'Photo' : 'File') : messageText,
        lastMessageTime: serverTimestamp(),
        [`typing.${currentUser.uid}`]: false
      };
      
      otherUserIds.forEach(id => {
        updates[`unreadCount.${id}`] = increment(1);
      });

      await updateDoc(chatRef, updates);

    } catch (err) {
      setText(messageText);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = async () => {
    try {
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        [`typing.${currentUser.uid}`]: true
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(async () => {
        try { await updateDoc(chatRef, { [`typing.${currentUser.uid}`]: false }); } catch (e) {}
      }, 2000);
    } catch (err) {}
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    handleTyping();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const onEmojiClick = (emojiObject) => {
    setText(prev => prev + emojiObject.emoji);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  return (
    <div className="relative px-2">
      {/* Emoji Picker Popover */}
      {showEmoji && (
        <div ref={emojiRef} className="absolute bottom-full left-0 mb-4 z-50">
          <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
        </div>
      )}

      {/* Media Preview */}
      {mediaFile && (
        <div className="mb-3 bg-[#1A1A1A] rounded-[16px] p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 truncate">
            {mediaFile.type.startsWith('image/') ? <ImageIcon size={20} className="text-white shrink-0"/> : <Paperclip size={20} className="text-white shrink-0"/>}
            <span className="text-sm text-white truncate">{mediaFile.name}</span>
          </div>
          <button 
            onClick={() => setMediaFile(null)} 
            className="text-white hover:opacity-70 transition-opacity shrink-0 ml-4"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 p-1">
        
        {/* Input Bar */}
        <div className="flex-1 bg-[#1A1A1A] rounded-[24px] flex items-end px-4 py-1.5 min-h-[44px]">
           <button 
             type="button" 
             onClick={() => fileInputRef.current?.click()}
             className="text-white/60 hover:text-white transition-colors pb-1 mr-3"
           >
             <Plus size={24} strokeWidth={1.5} />
           </button>
           
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={handleFileChange} 
             className="hidden" 
             accept="image/*,.pdf,.doc,.docx"
           />
           
           <textarea
             value={text}
             onChange={handleTextChange}
             onKeyDown={handleKeyDown}
             placeholder="Message"
             className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-24 text-white placeholder-white/50 text-[16px] outline-none py-1.5 custom-scrollbar"
             rows="1"
           />

           <button 
             type="button" 
             onClick={() => setShowEmoji(!showEmoji)}
             className="text-white/60 hover:text-white transition-colors pb-1 ml-2"
           >
             <Smile size={24} strokeWidth={1.5} />
           </button>
        </div>

        {/* Send Button */}
        {text.trim() || mediaFile ? (
          <button 
            onClick={handleSend}
            disabled={isSending}
            className="w-11 h-11 rounded-full bg-accent-red flex items-center justify-center text-white shadow-[0_4px_14px_rgba(229,9,20,0.4)] disabled:opacity-50 transition-all hover:bg-[#ff1a25] active:scale-95 shrink-0"
          >
            {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-1" strokeWidth={2} />}
          </button>
        ) : null}
      </div>
    </div>
  );
}
