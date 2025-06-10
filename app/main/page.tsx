'use client';

import Link from "next/link";
import { useState } from "react";

export default function Main() {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<string[]>([]);

    const handleSubmit = () => {
        if (inputValue.trim()) {
            setMessages([...messages, inputValue]);
            setInputValue('');
        }
    };
    const handleDelete = (index: number) => {
        setMessages(messages.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-2xl px-6 py-8">
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
                                    group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"/>
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
                    {messages.map((message, index) => (
                        <div 
                            key={index}
                            className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm
                                     border-2 border-gray-100 dark:border-gray-700
                                     flex items-center justify-between gap-4"
                        >
                            <p className="text-gray-800 dark:text-gray-200 flex-1">{message}</p>
                            <button
                                onClick={() => handleDelete(index)}
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