import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { LogOut, Plus, Search, Edit, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../services/firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

export default function Sidebar() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { chats, activeChat, setActiveChat, loadingChats } = useChat();
  const [newChatEmail, setNewChatEmail] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [chatType, setChatType] = useState('direct'); // 'direct' or 'group'
  const [isAddingChat, setIsAddingChat] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    try {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, { status: 'offline', lastSeen: serverTimestamp() }, { merge: true });
      }
      await signOut(auth);
    } catch (err) {
      // Ignored
    }
  };

  const handleCreateChat = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (chatType === 'direct') {
        if (!newChatEmail.trim()) return;
        if (newChatEmail === currentUser.email) {
          setError("You cannot chat with yourself.");
          setLoading(false);
          return;
        }

        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', newChatEmail.trim()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('User not found.');
          setLoading(false);
          return;
        }

        const targetUser = querySnapshot.docs[0].data();

        const existingChat = chats.find(c => 
          c.type === 'direct' && c.participants.includes(targetUser.uid)
        );

        if (existingChat) {
          setActiveChat(existingChat);
          setIsAddingChat(false);
          setNewChatEmail('');
          setLoading(false);
          return;
        }

        const newChatData = {
          type: 'direct',
          participants: [currentUser.uid, targetUser.uid],
          participantDetails: {
            [currentUser.uid]: { displayName: currentUser.displayName, photoURL: currentUser.photoURL || '' },
            [targetUser.uid]: { displayName: targetUser.displayName, photoURL: targetUser.photoURL || '' }
          },
          lastMessage: '',
          lastMessageTime: serverTimestamp(),
          unreadCount: { [currentUser.uid]: 0, [targetUser.uid]: 0 },
        };

        const docRef = await addDoc(collection(db, 'chats'), newChatData);
        setActiveChat({ id: docRef.id, ...newChatData });

      } else if (chatType === 'group') {
        if (!newGroupName.trim() || !newChatEmail.trim()) {
          setError("Group name and at least one email are required.");
          setLoading(false);
          return;
        }

        const emails = newChatEmail.split(',').map(e => e.trim()).filter(e => e !== '' && e !== currentUser.email);
        if (emails.length === 0) {
          setError("Please add valid emails other than yourself.");
          setLoading(false);
          return;
        }

        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', 'in', emails.slice(0, 10))); // max 10 for 'in' query
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('No valid users found.');
          setLoading(false);
          return;
        }

        const participantIds = [currentUser.uid];
        const participantDetails = {
          [currentUser.uid]: { displayName: currentUser.displayName, photoURL: currentUser.photoURL || '' }
        };
        const unreadCount = { [currentUser.uid]: 0 };

        querySnapshot.forEach(doc => {
          const u = doc.data();
          participantIds.push(u.uid);
          participantDetails[u.uid] = { displayName: u.displayName, photoURL: u.photoURL || '' };
          unreadCount[u.uid] = 0;
        });

        if (participantIds.length < 2) {
           setError('No valid users found to add.');
           setLoading(false);
           return;
        }

        const newChatData = {
          type: 'group',
          participants: participantIds,
          participantDetails,
          groupDetails: {
            name: newGroupName.trim(),
            admin: currentUser.uid,
          },
          lastMessage: '',
          lastMessageTime: serverTimestamp(),
          unreadCount,
        };

        const docRef = await addDoc(collection(db, 'chats'), newChatData);
        setActiveChat({ id: docRef.id, ...newChatData });
      }

      setIsAddingChat(false);
      setNewChatEmail('');
      setNewGroupName('');
    } catch (err) {
      setError('Failed to create chat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col pt-6 pb-2 px-4 relative z-10 border-r border-white/10 sm:border-r-0">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0 px-2">
        <h1 className="text-[28px] font-bold tracking-tight text-white">Chatify</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/about')} className="text-white/80 hover:text-white transition-colors">
            <Settings size={22} strokeWidth={2} />
          </button>
          <button onClick={handleLogout} className="text-white/80 hover:text-white transition-colors">
            <LogOut size={22} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-2 mb-4 shrink-0">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1A1A] text-white rounded-[14px] py-2.5 pl-10 pr-4 outline-none placeholder:text-white/40 focus:ring-1 focus:ring-accent-red/50 transition-all text-[15px]"
          />
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsAddingChat(!isAddingChat)}
        className="absolute bottom-6 right-6 w-[56px] h-[56px] bg-accent-red rounded-full flex items-center justify-center text-white hover:bg-[#ff1a25] transition-colors shadow-[0_4px_16px_rgba(229,9,20,0.4)] z-50 cursor-pointer"
      >
        <Edit size={24} strokeWidth={2} />
      </button>

      {/* Add Chat Form */}
      {isAddingChat && (
        <form onSubmit={handleCreateChat} className="bg-[#1A1A1A] rounded-[16px] p-5 mb-4 z-40 relative mx-2">
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-4">
            <button 
              type="button" 
              onClick={() => setChatType('direct')}
              className={`flex-1 text-sm py-1.5 rounded-lg transition-colors ${chatType === 'direct' ? 'bg-white/20 text-white' : 'text-white/60'}`}
            >
              Direct
            </button>
            <button 
              type="button" 
              onClick={() => setChatType('group')}
              className={`flex-1 text-sm py-1.5 rounded-lg transition-colors ${chatType === 'group' ? 'bg-white/20 text-white' : 'text-white/60'}`}
            >
              Group
            </button>
          </div>

          {chatType === 'group' && (
            <input 
              type="text" 
              placeholder="Group Name" 
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white mb-3"
            />
          )}
          <input 
            type="text" 
            placeholder={chatType === 'group' ? "Comma separated emails" : "User Email"} 
            value={newChatEmail}
            onChange={(e) => setNewChatEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white mb-3"
          />
          {error && <p className="text-white/80 text-xs mb-3">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="flex-1 bg-white text-black font-semibold text-sm py-2.5 rounded-xl">
              {loading ? '...' : 'Create'}
            </button>
            <button type="button" onClick={() => setIsAddingChat(false)} className="flex-1 bg-transparent border border-white/20 text-white text-sm py-2.5 rounded-xl">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loadingChats ? (
          <div className="flex justify-center p-8 text-white/50">Loading...</div>
        ) : chats.length === 0 ? (
          <div className="text-center p-8 text-white/50 text-sm">No chats yet.</div>
        ) : (
          <div className="space-y-1 px-2">
            {chats.filter(chat => {
              if (!searchQuery.trim()) return true;
              let title = chat.type === 'group' ? chat.groupDetails?.name : chat.participantDetails[chat.participants.find(id => id !== currentUser.uid)]?.displayName;
              return title?.toLowerCase().includes(searchQuery.toLowerCase());
            }).map(chat => {
              let title = '';
              let icon = null;

              if (chat.type === 'group') {
                title = chat.groupDetails?.name || 'Unnamed Group';
              } else {
                const otherUserId = chat.participants.find(id => id !== currentUser.uid);
                const otherUser = chat.participantDetails[otherUserId];
                title = otherUser?.displayName || 'Unknown User';
              }
              icon = title[0]?.toUpperCase();

              const isSelected = activeChat?.id === chat.id;

              return (
                <div 
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`flex items-center p-3 rounded-[16px] cursor-pointer transition-colors ${isSelected ? 'bg-[#1A1A1A]' : 'hover:bg-[#1A1A1A]/60'}`}
                >
                  <div className="w-[50px] h-[50px] rounded-full bg-[#2A2A2A] flex items-center justify-center text-[20px] font-bold text-white mr-3.5 shrink-0">
                    {icon}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-semibold text-white text-[16px] mb-0.5 truncate">{title}</h4>
                    <p className="text-[14px] text-white/50 truncate">
                      {chat.lastMessage || 'Hey 👋'}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end justify-start h-full ml-2">
                     <span className="text-[12px] text-white/40 mt-1">
                        {chat.lastMessageTime?.toDate 
                           ? chat.lastMessageTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                           : ''}
                     </span>
                     {chat.unreadCount[currentUser.uid] > 0 && (
                        <div className="w-[10px] h-[10px] rounded-full bg-accent-red mt-1.5"></div>
                     )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
