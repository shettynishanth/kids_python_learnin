'use client'; // Mark as a Client Component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomizeTutor() {
  const [selectedCharacter, setSelectedCharacter] = useState('robot'); // Default character
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const router = useRouter();

  // Load the saved character from localStorage when the component mounts
  useEffect(() => {
    const savedCharacter = localStorage.getItem('selectedCharacter');
    if (savedCharacter) {
      setSelectedCharacter(savedCharacter);
    }
  }, []);

  // Handle character selection
  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    localStorage.setItem('selectedCharacter', character); // Save to localStorage
    setConfirmationMessage(`You selected the ${character} tutor! 🎉`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-400 to-yellow-600 text-white p-6">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-yellow-200 drop-shadow-lg">
        🎨 Customize Your AI Tutor
      </h1>
      <p className="text-xl font-medium mb-6 text-center text-yellow-100">
        Pick your favorite character to guide you on your learning journey! 🚀
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {['robot', 'superhero', 'animal'].map((character) => (
          <div
            key={character}
            className={`flex flex-col items-center p-6 border-4 rounded-lg cursor-pointer transition-all transform ${
              selectedCharacter === character
                ? 'border-yellow-400 bg-yellow-400 scale-105'
                : 'border-white bg-purple-500 hover:bg-purple-600 hover:scale-105'
            } shadow-xl`}
            onClick={() => handleCharacterSelect(character)}
          >
            <img
              src={`/images/${character}.png`}
              alt={character}
              className="w-32 h-32 mb-4 rounded-full drop-shadow-2xl"
            />
            <h2 className="text-2xl font-semibold text-white">{character}</h2>
          </div>
        ))}
      </div>

      {confirmationMessage && (
        <div className="mt-8 bg-white text-black p-4 rounded-lg shadow-lg max-w-md mx-auto text-center">
          <h3 className="text-2xl font-bold">{confirmationMessage}</h3>
        </div>
      )}

      {/* Button to go back to the main page */}
      <button
        onClick={() => router.push('/')}
        className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition-all duration-300 transform hover:scale-110"
      >
        ⬅️ Back to Home
      </button>
    </div>
  );
}