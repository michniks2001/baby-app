'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// --- Configuration ---
const SHAPES = ['circle', 'square', 'triangle', 'star', 'hexagon', 'oval', 'diamond'];
const MEMORIZE_TIME = 5000; // 5 seconds
const RESULT_DISPLAY_TIME = 1500; // 1.5 seconds
const MAX_LEVEL = 5;

// --- Helper Function ---
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// --- Game Component ---
export default function ShapesGamePage() {
  const router = useRouter();
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('loading');
  const [correctShape, setCorrectShape] = useState(null);
  const [quizOptions, setQuizOptions] = useState([]);
  const [resultMessage, setResultMessage] = useState('');
  const [usedShapes, setUsedShapes] = useState([]);

  // --- Text-to-Speech Function ---
  const speakShapeName = (shape) => {
    if (typeof window === 'undefined') return;
    
    // Cancel any ongoing speech first
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const fullText = `This is a ${shape}`;
    
    // Create a fresh utterance each time
    const utterance = new window.SpeechSynthesisUtterance(fullText);
    
    // Configure speech settings
    utterance.rate = 0.7; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Speak the shape name
    window.speechSynthesis.speak(utterance);
  };

  // --- Game Logic ---
  const prepareQuizOptions = (correctChoice) => {
    const numOptions = level <= 3 ? 3 : 4;
    const distractors = SHAPES
      .filter(s => s !== correctChoice)
      .sort(() => Math.random() - 0.5)
      .slice(0, numOptions - 1);
      
    setQuizOptions(shuffleArray([correctChoice, ...distractors]));
  };

  useEffect(() => {
    if (level > MAX_LEVEL) {
      setGameState('gameOver');
      return;
    }

    // Reset states for new round
    setGameState('memorizing');
    setResultMessage('');
    setQuizOptions([]);

    // Select new shape that hasn't been used yet
    let newShape;
    const availableShapes = SHAPES.filter(shape => !usedShapes.includes(shape));
    
    // If we've used all shapes, reset the used shapes list
    if (availableShapes.length === 0) {
      setUsedShapes([]);
      newShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    } else {
      newShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
    }
    
    // Add the new shape to the used shapes list
    setUsedShapes(prev => [...prev, newShape]);
    setCorrectShape(newShape);
    
    // Speak the shape name
    speakShapeName(newShape);

    // Set transition timer
    const timer = setTimeout(() => {
      setGameState('quiz');
      prepareQuizOptions(newShape);
    }, MEMORIZE_TIME);

    return () => clearTimeout(timer);
  // Only run when level changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // --- Handlers ---
  const handleSelection = (selected) => {
    if (gameState !== 'quiz') return;

    const correct = selected === correctShape;
    setResultMessage(correct ? 'Correct! 🎉' : `Oops! Try again!`);
    setScore(s => correct ? s + 1 : s);
    setGameState('result');

    if (correct) speakShapeName(selected);

    setTimeout(() => {
      if (level >= MAX_LEVEL) setGameState('gameOver');
      else setLevel(l => l + 1);
    }, RESULT_DISPLAY_TIME);
  };

  const restart = () => {
    setLevel(1);
    setScore(0);
    setGameState('loading');
    setCorrectShape(null);
    setUsedShapes([]);
  };

  // --- Render ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-300 to-purple-100 p-4 overflow-hidden touch-manipulation relative">
      {/* Decorative background elements */}
      <div className="absolute top-5 left-5 w-16 h-16 bg-yellow-200 rounded-full opacity-60 animate-wobble"></div>
      <div className="absolute top-20 right-10 w-12 h-12 bg-pink-200 rounded-full opacity-60 animate-float" style={{ animationDuration: '3s' }}></div>
      <div className="absolute bottom-10 left-10 w-14 h-14 bg-blue-200 rounded-full opacity-60 animate-float" style={{ animationDuration: '4s' }}></div>
      <div className="absolute top-1/3 right-1/4 text-3xl animate-float" style={{ animationDuration: '6s', animationDelay: '1s' }}>▲</div>
      <div className="absolute bottom-1/3 left-1/4 text-3xl animate-float" style={{ animationDuration: '7s', animationDelay: '0.5s' }}>■</div>
      <div className="absolute bottom-20 right-5 w-10 h-10 bg-green-200 rounded-full opacity-60 animate-wobble" style={{ animationDuration: '3.5s' }}></div>
      {/* Game Header */}
      <div className="w-full max-w-md flex justify-between mb-8 p-5 bg-white/70 rounded-xl shadow-md backdrop-blur-sm border-2 border-purple-200 z-10">
        <span className="text-purple-800 font-bold text-xl sm:text-2xl">Level: {Math.min(level, MAX_LEVEL)}/{MAX_LEVEL}</span>
        <span className="text-yellow-800 font-bold text-xl sm:text-2xl">Score: {score}</span>
      </div>

      {/* Game States */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-xl border-2 border-purple-200">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-800 text-shadow">Shapes Memory Game</h1>

        {gameState === 'memorizing' && correctShape && (
          <div className="text-center">
            <h2 className="text-blue-700 text-xl mb-4 animate-float text-shadow">Remember this shape!</h2>
            <div className="bg-white p-4 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105 animate-fadeIn flex items-center justify-center touch-none">
              <Image
                src={`/shape_images/${correctShape}.svg`}
                alt={correctShape}
                width={240}
                height={240}
                className="object-contain rounded-lg"
                priority
              />
            </div>
            <p className="text-gray-500 mt-6 italic animate-pulse text-lg">Listen carefully...</p>
          </div>
        )}

        {gameState === 'quiz' && (
          <div className="text-center">
            <h2 className="text-blue-700 text-2xl mb-6 animate-fadeIn text-shadow">Which shape was it?</h2>
            <div className={`grid gap-6 ${quizOptions.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {quizOptions.map((shape, index) => (
                <button
                  key={shape}
                  onClick={() => handleSelection(shape)}
                  className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl active:shadow-inner transition-all duration-300 transform hover:scale-110 active:scale-95 hover:rotate-2 animate-fadeIn flex items-center justify-center min-h-[160px] touch-manipulation"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <Image
                    src={`/shape_images/${shape}.svg`}
                    alt={shape}
                    width={220}
                    height={220}
                    className="object-contain rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'result' && (
          <div className={`text-center ${resultMessage.includes('Correct') ? 'text-green-600' : 'text-red-600'} animate-fadeIn`}>
            <p className="text-3xl font-bold animate-wobble mb-4 text-shadow">{resultMessage}</p>
            
            {/* Show shape image and name */}
            <div className="mt-6 transform transition-all duration-500 animate-fadeIn">
              <Image
                src={`/shape_images/${correctShape}.svg`}
                alt={correctShape}
                width={180}
                height={180}
                className="mx-auto rounded-lg shadow-lg mb-3"
              />
              <p className="text-2xl font-bold capitalize bg-white/80 py-2 px-4 rounded-lg inline-block mt-2 text-blue-800">
                {correctShape}
              </p>
              <button 
                onClick={() => speakShapeName(correctShape)} 
                className="block mx-auto mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors touch-manipulation min-w-[120px] text-lg"
              >
                Say it again
              </button>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="text-center bg-white p-8 pb-12 rounded-xl shadow-2xl animate-fadeIn transform transition-all duration-500">
            <h2 className="text-purple-700 text-3xl font-bold mb-6 animate-float text-shadow">Game Over!</h2>
            <div className="mb-10 bg-yellow-100 p-4 rounded-lg inline-block">
              <p className="text-2xl">Final Score: <span className="font-bold text-yellow-600">{score}</span>/{MAX_LEVEL}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                onClick={restart} 
                className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-lg px-6 py-4 rounded-full transform transition-all duration-300 hover:scale-110 active:scale-95 min-w-[160px] min-h-[60px] touch-manipulation"
              >
                Play Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/')} 
                className="text-lg px-6 py-4 rounded-full transform transition-all duration-300 hover:scale-110 active:scale-95 min-w-[160px] min-h-[60px] touch-manipulation"
              >
                Main Menu
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
