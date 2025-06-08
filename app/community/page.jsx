'use client';

import { useEffect, useRef, useState } from 'react';
import { getRequest, postRequest } from '@/lib/api';
import toast from 'react-hot-toast';
import useAuthStore from '@/lib/store';
import { Send } from 'lucide-react';

export default function CommunityPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef();

  const fetchMessages = async () => {
    try {
      const res = await getRequest('/community');
      setMessages(res);
    } catch {
      toast.error('Failed to load messages');
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await postRequest('/community', { content: newMessage });
      setMessages([res, ...messages]); // Add new message at top
      setNewMessage('');
    } catch (err) {
      toast.error(err.message || 'Send failed');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-6 border-b border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-[#1c4645]">💬 Community Chat</h1>
        <p className="text-gray-600">Discuss with other learners in real-time</p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-10">No messages yet</p>
        )}

        {[...messages].reverse().map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xl px-4 py-2 rounded-lg shadow-sm ${
              msg.userId === user?.id
                ? 'ml-auto bg-[#1c4645] text-white'
                : 'mr-auto bg-white border border-gray-200 text-gray-800'
            }`}
          >
            <p className="text-sm font-semibold mb-1">{msg.user.name}</p>
            <p className="text-sm">{msg.content}</p>
            <p className="text-xs text-gray-400 mt-1 text-right">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white p-4 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Write a message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1c4645] text-black"
        />
        <button
          onClick={handleSend}
          className="bg-[#1c4645] hover:bg-[#2a5a58] text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
