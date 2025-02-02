'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, MessageCircle } from 'lucide-react';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState('robot');
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const savedCharacter = localStorage.getItem('selectedCharacter');
    if (savedCharacter) setSelectedCharacter(savedCharacter);
  }, []);

  useEffect(() => {
    chatContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (userInput) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userInput }] }),
      });
      if (!response.ok) throw new Error('Failed to fetch response');
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error:', error);
      return 'Sorry, something went wrong.';
    }
  };

  const handleUserSend = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');

    try {
      const aiResponse = await handleSend(input);
      setMessages((prev) => [...prev, { text: aiResponse, sender: 'ai', character: selectedCharacter }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chatbot Circle Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </motion.button>

      {/* Chatbot Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed bottom-24 right-6 w-96 bg-white border border-gray-300 rounded-lg shadow-xl flex flex-col" 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-t-lg text-center font-bold">
              AI Chatbot
            </div>
            <div className="p-4 h-72 overflow-y-auto space-y-2 scrollbar-thin" ref={chatContainerRef}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {msg.sender === 'ai' && (
                    <img src={`/images/${msg.character}.png`} alt={msg.character} className="w-8 h-8 rounded-full mr-2" />
                  )}
                  <span className={`px-3 py-2 text-sm rounded-lg shadow-md ${msg.sender === 'user' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {msg.text}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-300 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Type a message..."
                disabled={isLoading}
              />
              <button
                onClick={handleUserSend}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}