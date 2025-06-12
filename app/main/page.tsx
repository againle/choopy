'use client';

import { useState , useEffect } from "react";

export default function Main() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ id: string; message: string }[]>([]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('../api/messages'); 
      if (!res.ok) {
        throw new Error(`Error fetching messages: ${res.statusText}`);
      }
      const data: { _id: string; message: string }[] = await res.json();
      // Map server data to include id and message
      setMessages(data.map(item => ({ id: item._id, message: item.message })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect (() => {
    fetchMessages();
  }, []);

  const handleSubmit = async () => {
    if (inputValue.trim()) {
      try {
        // Send new message to server
        const res = await fetch('../api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: inputValue }),
        });
        if (!res.ok) {
            console.log(res.statusText);
          throw new Error(`Error adding message: ${res.statusText}`);
        }
        const newItem: { _id: string ; message: string } = await res.json();
        // Add new message with id to local state
        setMessages(prev => [...prev, { id: newItem._id, message: newItem.message }]);
        console.log(messages);
        setInputValue('');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id: string, index: number) => {
    try {
      // Send delete request with id
      const response = await fetch('../api/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error(`Error deleting message: ${response.statusText}`);
      }
      // Remove from local state
      setMessages(prev => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-2xl px-6 py-8">
        {/* Input and Submit Button */}
        <div className="flex gap-4">
          <div className="relative group flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-200 
                dark:border-gray-700 bg-white dark:bg-gray-800 
                focus:outline-none focus:border-purple-500 dark:focus:border-purple-400
                transition-all duration-300 ease-in-out
                shadow-sm hover:shadow-md
                text-gray-800 dark:text-gray-200
                placeholder-gray-400 dark:placeholder-gray-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 
                        group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
          </div>
          <button
            onClick={handleSubmit}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 
              text-white font-medium text-lg shadow-sm hover:shadow-md
              transition-all duration-300 ease-in-out hover:opacity-90
              hover:scale-105 active:scale-95"
          >
            Submit
          </button>
        </div>

        {/* Messages List */}
        <div className="mt-8 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm
                       border-2 border-gray-100 dark:border-gray-700
                       flex items-center justify-between gap-4"
            >
              <p className="text-gray-800 dark:text-gray-200 flex-1">{msg.message}</p>
              <button
                onClick={() => handleDelete(msg.id, index)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 
                  text-white text-sm font-medium shadow-sm hover:shadow-md
                  transition-all duration-300 ease-in-out hover:opacity-90
                  hover:scale-105 active:scale-95"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
