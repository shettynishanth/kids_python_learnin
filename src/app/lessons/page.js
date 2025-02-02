'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Chatbot from '../../components/Chatbot';

export default function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize router for navigation

  useEffect(() => {
    fetch('/lessons.json')
      .then((res) => res.json())
      .then((data) => setLessons(data))
      .catch((err) => console.error('Failed to load lessons:', err));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setFeedback('');
    setOutput('');

    try {
      const response = await fetch('http://localhost:5000/run-python', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setOutput(data.output);
      setFeedback('✅ Great job! Your code worked perfectly! Here’s what happened:');
    } catch (error) {
      setOutput('❌ Oops! Let\'s try that again. Here\'s what went wrong:');
      setFeedback(error.message);
    }

    setLoading(false);
  };

  const currentLesson = lessons?.[currentLessonIndex] || {};
  const progressPercentage = lessons?.length ? (currentLessonIndex / lessons.length) * 100 : 0;

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold text-blue-600 mb-4 animate-bounce">
          🐍 Python Playground
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl">
          Learn Python through fun, interactive lessons with real-time AI help! 
          Earn stars ⭐ for each completed challenge!
        </p>
      </header>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-4 h-fit sticky top-6">
          <h3 className="text-xl font-bold mb-4 text-purple-600">Your Lessons</h3>
          <div className="space-y-2">
            {lessons?.map((lesson, index) => (
              <button
                key={index}
                onClick={() => setCurrentLessonIndex(index)}
                className={`w-full p-3 text-left rounded-lg flex items-center ${
                  index === currentLessonIndex
                    ? 'bg-blue-100 border-2 border-blue-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">
                  {lesson.completed ? '⭐' : `📘 ${index + 1}.`}
                </span>
                {lesson.title}
              </button>
            ))}
          </div>
          <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-700">
              🏆 Current Progress: {currentLessonIndex + 1} of {lessons?.length || 0} lessons
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 rounded-full h-2 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lesson Content */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {lessons?.length > 0 ? (
              <>
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">🎯</span>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {currentLesson?.title || 'Loading Lesson...'}
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {currentLesson?.content || 'Loading lesson content...'}
                  </p>
                  {currentLesson?.instructions && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center mb-2">
                        <span className="mr-2">💡</span>
                        <h3 className="font-bold text-blue-600">Try This!</h3>
                      </div>
                      <pre className="whitespace-pre-wrap text-gray-800 font-mono">
                        {currentLesson.instructions}
                      </pre>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="animate-spin text-4xl mb-4">🌀</div>
                <p className="text-gray-600">Loading awesome lessons...</p>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">👩💻 Your Code Editor</span>
            </h3>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="# Write your Python magic here! ✨\nprint('Hello, World!')"
              className="w-full h-48 p-4 border-2 border-blue-200 rounded-lg font-mono
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-200 resize-none
                         text-lg bg-gray-50"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`mt-4 w-full py-3 text-lg font-bold rounded-lg transition-all
                        ${
                          loading
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white transform hover:scale-[1.02]'
                        }`}
            >
              {loading ? '🔮 Running Your Code...' : '🚀 Run Code & See Magic! →'}
            </button>
          </div>

          {/* Go to Main Page Button */}
          <button
            onClick={() => router.push('/')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
          >
            🔙 Go to Main Page
          </button>
        </div>
      </div>

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6">
        <Chatbot />
      </div>
    </div>
  );
}

