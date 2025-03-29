"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// --- Configuration ---
const ANIMALS = ['bird', 'cat', 'cow', 'dog', 'goat', 'horse', 'sheep'];
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
export default function GamePage() {
  const router = useRouter();
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('loading');
  const [correctAnimal, setCorrectAnimal] = useState(null);
  const [quizOptions, setQuizOptions] = useState([]);
  const [resultMessage, setResultMessage] = useState('');
  const [audio, setAudio] = useState(null);
  const [usedAnimals, setUsedAnimals] = useState([]);

  // --- Sound Management ---
  const playSound = useCallback((animal) => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
    const newAudio = new Audio(`/animal_sounds/${animal}.wav`);
    newAudio.play().catch(error => console.error("Audio error:", error));
    setAudio(newAudio);
  }, [audio]);

  // --- Game Logic ---
  const prepareQuizOptions = (correctChoice) => {
    const numOptions = level <= 3 ? 3 : 4;
    const distractors = ANIMALS
      .filter(a => a !== correctChoice)
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

    // Select new animal that hasn't been used yet
    let newAnimal;
    const availableAnimals = ANIMALS.filter(animal => !usedAnimals.includes(animal));
    
    // If we've used all animals, reset the used animals list
    if (availableAnimals.length === 0) {
      setUsedAnimals([]);
      newAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    } else {
      newAnimal = availableAnimals[Math.floor(Math.random() * availableAnimals.length)];
    }
    
    // Add the new animal to the used animals list
    setUsedAnimals(prev => [...prev, newAnimal]);
    setCorrectAnimal(newAnimal);
    playSound(newAnimal);

    // Set transition timer
    const timer = setTimeout(() => {
      setGameState('quiz');
      prepareQuizOptions(newAnimal);
    }, MEMORIZE_TIME);

    return () => clearTimeout(timer);
  // Only run when level changes - add eslint disable for intentional behavior
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // --- Handlers ---
  const handleSelection = (selected) => {
    if (gameState !== 'quiz') return;

    const correct = selected === correctAnimal;
    setResultMessage(correct ? 'Correct! 🎉' : `Oops! Try again!`);
    setScore(s => correct ? s + 1 : s);
    setGameState('result');

    if (correct) playSound(selected);

    setTimeout(() => {
      if (level >= MAX_LEVEL) setGameState('gameOver');
      else setLevel(l => l + 1);
    }, RESULT_DISPLAY_TIME);
  };

  const restart = () => {
    setLevel(1);
    setScore(0);
    setGameState('loading');
    setCorrectAnimal(null);
    setUsedAnimals([]);
    if (audio) audio.pause();
  };

  // --- Cleanup ---
  useEffect(() => () => { if (audio) audio.pause(); }, [audio]);

  // --- Render ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-300 to-green-100 p-4 overflow-hidden touch-manipulation relative">
      {/* Decorative background elements - animal-themed */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-yellow-200 rounded-full opacity-60 flex items-center justify-center animate-wobble">
        <span className="text-2xl">🐰</span>
      </div>
      <div className="absolute top-20 right-12 w-14 h-14 bg-blue-200 rounded-full opacity-60 flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
        <span className="text-2xl">🐶</span>
      </div>
      <div className="absolute bottom-16 left-14 w-14 h-14 bg-red-200 rounded-full opacity-60 flex items-center justify-center animate-bounce" style={{ animationDuration: '4s' }}>
        <span className="text-2xl">🐱</span>
      </div>
      <div className="absolute bottom-24 right-8 w-12 h-12 bg-orange-200 rounded-full opacity-60 flex items-center justify-center animate-wobble" style={{ animationDuration: '3.5s' }}>
        <span className="text-2xl">🐮</span>
      </div>
      {/* Game Header */}
      <div className="w-full max-w-md flex justify-between mb-8 p-5 bg-white/70 rounded-xl shadow-md backdrop-blur-sm border-2 border-green-200 z-10">
        <span className="text-green-800 font-bold text-xl sm:text-2xl">Level: {Math.min(level, MAX_LEVEL)}/{MAX_LEVEL}</span>
        <span className="text-yellow-800 font-bold text-xl sm:text-2xl">Score: {score}</span>
      </div>

      {/* Game States */}
      <div className="w-full max-w-md flex flex-col items-center">
        {gameState === 'loading' && (
          <p className="text-gray-600 animate-pulse">Loading...</p>
        )}

        {gameState === 'memorizing' && correctAnimal && (
          <div className="text-center">
            <h2 className="text-blue-700 text-2xl mb-6 animate-float text-shadow">Remember this animal!</h2>
            <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105 animate-fadeIn touch-none">
              <Image
                src={`/animal_images/${correctAnimal}.jpg`}
                alt={correctAnimal}
                width={320}
                height={320}
                className="object-cover rounded-lg"
                priority
              />
            </div>
            <p className="text-gray-500 mt-6 italic animate-pulse text-lg">Listen carefully...</p>
          </div>
        )}

        {gameState === 'quiz' && (
          <div className="text-center">
            <h2 className="text-blue-700 text-2xl mb-6 animate-fadeIn text-shadow">Which animal was it?</h2>
            <div className={`grid gap-8 ${quizOptions.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {quizOptions.map((animal, index) => (
                <button
                  key={animal}
                  onClick={() => handleSelection(animal)}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl active:shadow-inner transition-all duration-300 transform hover:scale-110 active:scale-95 hover:rotate-2 animate-fadeIn min-h-[120px] touch-manipulation"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <Image
                    src={`/animal_images/${animal}.jpg`}
                    alt={animal}
                    width={180}
                    height={180}
                    className="object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'result' && (
          <div className={`text-center ${resultMessage.includes('Correct') ? 'text-green-600' : 'text-red-600'} animate-fadeIn`}>
            <p className="text-3xl font-bold animate-wobble mb-4 text-shadow">{resultMessage}</p>
            
            {/* Show animal image and name */}
            <div className="mt-6 transform transition-all duration-500 animate-fadeIn">
              <Image
                src={`/animal_images/${correctAnimal}.jpg`}
                alt={correctAnimal}
                width={180}
                height={180}
                className="mx-auto rounded-lg shadow-lg mb-3"
              />
              <p className="text-2xl font-bold capitalize bg-white/80 py-2 px-4 rounded-lg inline-block mt-2 text-blue-800">
                {correctAnimal}
              </p>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="text-center bg-white p-8 rounded-xl shadow-2xl animate-fadeIn transform transition-all duration-500">
            <h2 className="text-purple-700 text-3xl font-bold mb-6 animate-float text-shadow">Game Over!</h2>
            <div className="mb-8 bg-yellow-100 p-4 rounded-lg inline-block">
              <p className="text-2xl">Final Score: <span className="font-bold text-yellow-600">{score}</span>/{MAX_LEVEL}</p>
            </div>
            <div className="flex gap-6 justify-center">
              <Button 
                onClick={restart} 
                className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-lg px-8 py-5 rounded-full transform transition-all duration-300 hover:scale-110 active:scale-95 min-w-[180px] min-h-[70px] touch-manipulation"
              >
                Play Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/')} 
                className="text-lg px-8 py-5 rounded-full transform transition-all duration-300 hover:scale-110 active:scale-95 min-w-[180px] min-h-[70px] touch-manipulation"
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