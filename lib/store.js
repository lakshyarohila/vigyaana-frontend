'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getRequest, postRequest } from '@/lib/api';
import toast from 'react-hot-toast';
import useAuthStore from '@/lib/store';
import { Send, Smile, X, Clock, Check, CheckCheck } from 'lucide-react';

export default function CommunityPage() {
  const { user, checkAuth } = useAuthStore();
  const { data: session, status } = useSession(); // NextAuth session
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const messagesEndRef = useRef();
  const refreshIntervalRef = useRef();

  // Debug: Log authentication data
  useEffect(() => {
    console.log('=== AUTH DEBUG ===');
    console.log('Auth Store User:', user);
    console.log('NextAuth Session:', session);
    console.log('NextAuth Status:', status);
    console.log('================');
  }, [user, session, status]);

  // Common emojis for the picker
  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '👍', '👎', '👌', '🤞', '✌️', '🤟', '🤘', '👏', '🙌', '👐',
    '🔥', '💯', '💪', '❤️', '💙', '💚', '💛', '🧡', '💜', '🖤',
    '💡', '⭐', '🌟', '✨', '🎉', '🎊', '🎈', '🎁', '🏆', '🥇'
  ];

  // Helper function to get current user info (works for both auth methods)
  const getCurrentUser = () => {
    if (user) {
      // Custom auth user from your store
      return {
        id: user.id || user._id,
        name: user.name || user.username || user.email?.split('@')[0] || 'User',
        email: user.email,
        isCustomAuth: true
      };
    } else if (session?.user) {
      // NextAuth/Google user
      return {
        id: session.user.id || session.user.sub || session.user.email,
        name: session.user.name || session.user.email?.split('@')[0] || 'User',
        email: session.user.email,
        isCustomAuth: false
      };
    }
    return null;
  };

  // Check authentication on component mount
  useEffect(() => {
    const initAuth = async () => {
      if (status === 'loading') return; // Wait for NextAuth to finish loading
      
      setIsLoading(true);
      setAuthError(null);

      try {
        // If we have a NextAuth session but no user in store, try to sync
        if (session && !user) {
          console.log('NextAuth session found, checking backend auth...');
          await checkAuth();
        }
        
        // If we still don't have any user data, set error
        const currentUser = getCurrentUser();
        if (!currentUser) {
          setAuthError('Please log in to access the community chat');
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setAuthError('Authentication failed. Please try logging in again.');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [session, user, status, checkAuth]);

  const fetchMessages = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.log('No authenticated user, skipping message fetch');
      return;
    }

    try {
      console.log('Fetching messages for user:', currentUser);
      
      // Make request with proper credentials
      const options = {
        withCredentials: true,
        headers: {}
      };

      // If using NextAuth session, include Authorization header
      if (session?.accessToken) {
        options.headers.Authorization = `Bearer ${session.accessToken}`;
      }

      const res = await getRequest('/community', options);
      console.log('Messages fetched successfully:', res);
      setMessages(res);
      setIsOnline(true);
      setAuthError(null);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      
      // Handle authentication errors
      if (error.status === 401 || error.message?.includes('token') || error.message?.includes('auth')) {
        setAuthError('Authentication expired. Please log in again.');
        // Try to refresh auth
        if (user && !session) {
          // Custom auth - try to recheck
          await checkAuth();
        }
      } else {
        setIsOnline(false);
        if (messages.length === 0) {
          toast.error('Failed to load messages: ' + (error.message || 'Unknown error'));
        }
      }
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error('Authentication error. Please log in again.');
      return;
    }

    const tempMessage = {
      id: Date.now(),
      content: newMessage,
      user: { name: currentUser.name },
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      status: 'sending'
    };

    // Add message optimistically
    setMessages(prev => [tempMessage, ...prev]);
    setNewMessage('');

    try {
      console.log('Sending message with user:', currentUser);
      
      // Make request with proper credentials
      const options = {
        withCredentials: true,
        headers: {}
      };

      // If using NextAuth session, include Authorization header
      if (session?.accessToken) {
        options.headers.Authorization = `Bearer ${session.accessToken}`;
      }

      const res = await postRequest('/community', { content: newMessage }, options);
      console.log('Message sent successfully:', res);
      
      // Replace temp message with real one
      setMessages(prev => 
        prev.map(msg => msg.id === tempMessage.id ? { ...res, status: 'sent' } : msg)
      );
      setAuthError(null);
    } catch (err) {
      console.error('Failed to send message:', err);
      
      // Handle authentication errors
      if (err.status === 401 || err.message?.includes('token') || err.message?.includes('auth')) {
        setAuthError('Authentication expired. Please log in again.');
        toast.error('Authentication error. Please log in again.');
      } else {
        toast.error(err.message || 'Send failed');
      }
      
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      setNewMessage(tempMessage.content); // Restore message
    }
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-refresh every 5 seconds, but only if user is authenticated
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || authError) {
      console.log('No user or auth error, not starting auto-refresh');
      return;
    }

    fetchMessages();
    
    refreshIntervalRef.current = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [user, session, authError]); // Dependencies include both auth sources

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString();
  };

  const getMessageStatus = (message) => {
    const currentUser = getCurrentUser();
    if (!currentUser || message.userId !== currentUser.id) return null;
    if (message.status === 'sending') return <Clock size={12} className="text-gray-400" />;
    if (message.status === 'sent') return <Check size={12} className="text-gray-400" />;
    return <CheckCheck size={12} className="text-blue-400" />;
  };

  // Show loading state
  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1c4645] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  // Show authentication error
  if (authError || !getCurrentUser()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-gray-600 text-lg mb-2">{authError || 'Please log in to access the community chat'}</p>
          <p className="text-gray-400 text-sm mb-4">You need to be authenticated to view and send messages</p>
          
          {/* Debug info */}
          <div className="text-xs text-gray-300 mt-4 max-w-md mx-auto">
            <p>Store User: {user ? '✅' : '❌'}</p>
            <p>NextAuth Session: {session ? '✅' : '❌'}</p>
            <p>Status: {status}</p>
          </div>
          
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-[#1c4645] text-white rounded-lg hover:bg-[#2a5a58] transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const currentUser = getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white p-4 border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1c4645]">💬 Community Chat</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p className="text-sm text-gray-600">
                {isOnline ? 'Connected' : 'Reconnecting...'}
              </p>
              <span className="text-xs text-gray-400">
                • {currentUser.name} ({currentUser.isCustomAuth ? 'Custom' : 'Google'})
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center mt-16">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-500 text-lg">No messages yet</p>
            <p className="text-gray-400 text-sm">Start the conversation!</p>
          </div>
        )}

        {[...messages].reverse().map((msg, index) => {
          const isOwn = msg.userId === currentUser.id;
          const showAvatar = index === 0 || messages.reverse()[index - 1]?.userId !== msg.userId;
          
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-300`}
            >
              {/* Avatar placeholder */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                showAvatar ? 'visible' : 'invisible'
              }`} style={{ backgroundColor: `hsl(${(msg.user.name || 'User')?.charCodeAt(0) * 10 % 360}, 70%, 50%)` }}>
                {(msg.user.name || 'U')?.charAt(0)?.toUpperCase()}
              </div>

              {/* Message bubble */}
              <div className={`max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                {showAvatar && (
                  <p className={`text-xs text-gray-500 mb-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                    {msg.user.name || 'Unknown User'}
                  </p>
                )}
                
                <div className={`px-4 py-2 rounded-2xl shadow-sm relative group ${
                  isOwn 
                    ? 'bg-[#1c4645] text-white rounded-br-sm' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  
                  {/* Time and status */}
                  <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <span className={`text-xs ${isOwn ? 'text-gray-300' : 'text-gray-400'}`}>
                      {formatTime(msg.createdAt)}
                    </span>
                    {getMessageStatus(msg)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="emoji-picker-container mb-3">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-h-40 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Pick an emoji</span>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-10 gap-1">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiClick(emoji)}
                    className="text-lg hover:bg-gray-100 rounded p-1 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Row */}
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows="1"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#1c4645] focus:border-transparent resize-none text-black bg-gray-50"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            
            {/* Emoji button */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1c4645] transition-colors"
            >
              <Smile size={20} />
            </button>
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || !currentUser}
            className="bg-[#1c4645] hover:bg-[#2a5a58] disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-colors flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}