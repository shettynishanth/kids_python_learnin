'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Chatbot from '../../components/Chatbot';

export default function Homework() {
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [currentAssignment, setCurrentAssignment] = useState(0);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const router = useRouter();

  const assignments = [
    {
      id: 1,
      title: 'Sum of Two Numbers',
      instructions: `Write a Python function that takes two numbers as input and returns their sum.`,
      emoji: '➕',
    },
    {
      id: 2,
      title: 'Factorial of a Number',
      instructions: `Write a Python function to calculate the factorial of a number.`,
      emoji: '🎉',
    },
    {
      id:3,
      title:'dived of two number',
      instructions: `Write a Python function that takes two numbers as input and returns their sum.`,
      emoji:'*',
    }
  ];

  const evaluateCode = async (code) => {
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) throw new Error('Failed to fetch response');
      const data = await response.json();
      return data.feedback;
    } catch (error) {
      console.error('Error:', error);
      return 'Error evaluating code';
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code before submitting.');
      return;
    }
    const aiFeedback = await evaluateCode(code);
    setFeedback(aiFeedback);
    if (!completedAssignments.includes(currentAssignment)) {
      setCompletedAssignments([...completedAssignments, currentAssignment]);
    }
  };

  const nextAssignment = () => {
    setCurrentAssignment((prev) => (prev + 1) % assignments.length);
    setCode('');
    setFeedback('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-pink-500 text-white p-6">
      <motion.h1 
        className="text-5xl font-extrabold mb-8 drop-shadow-lg text-center" 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
      >
        🎓 Fun Homework Time! 🚀
      </motion.h1>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl bg-white rounded-lg p-2 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-purple-600">Progress</span>
          <span className="text-lg font-bold text-purple-600">
            {completedAssignments.length}/{assignments.length} Completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <motion.div
            className="bg-purple-600 h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedAssignments.length / assignments.length) * 100}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      {/* Assignment Card */}
      <motion.div className="bg-white p-6 rounded-lg shadow-lg text-black w-full max-w-2xl mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">
          {assignments[currentAssignment].emoji} {assignments[currentAssignment].title}
        </h2>
        <p className="text-lg text-gray-700">{assignments[currentAssignment].instructions}</p>
      </motion.div>

      {/* Code Input Card */}
      <motion.div className="bg-white p-6 rounded-lg shadow-lg text-black w-full max-w-2xl mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">✍️ Write Your Code</h2>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your Python code here..."
          className="w-full h-48 p-4 border border-gray-300 rounded-lg mb-4 font-mono text-lg"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          🚀 Submit Code
        </button>
      </motion.div>

      {/* Feedback Card */}
      {feedback && (
        <motion.div className="bg-white p-6 rounded-lg shadow-lg text-black w-full max-w-2xl mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-purple-600">🤖 AI Feedback</h2>
          <p className="text-lg text-gray-700">{feedback}</p>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={nextAssignment}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          ⏭️ Next Assignment
        </button>

        <button
          onClick={() => router.push('/')}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          🏠 Back to Home
        </button>
      </div>

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6">
        <Chatbot />
      </div>
    </div>
  );

}
