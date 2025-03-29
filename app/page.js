'use client'; 

import { Button } from "@/components/ui/button"; 
import { useRouter } from 'next/navigation'; 
import TextToSpeech from '@/components/TextToSpeech';

export default function Home() {
  const router = useRouter(); 

  const handleAnimalGameClick = () => {
    router.push('/game'); 
  };

  const handleShapesGameClick = () => {
    router.push('/shapes-game');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-300 to-blue-100 p-4 sm:p-8 text-center font-sans touch-manipulation relative">
      {/* Decorative background elements */}
      <div className="absolute top-8 left-8 w-20 h-20 bg-yellow-200 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '4s' }}></div>
      <div className="absolute top-32 right-10 w-16 h-16 bg-pink-200 rounded-full opacity-60 animate-pulse" style={{ animationDuration: '3s' }}></div>
      <div className="absolute bottom-20 left-12 w-14 h-14 bg-green-200 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '5s' }}></div>
      <div className="absolute bottom-40 right-8 w-24 h-24 bg-purple-200 rounded-full opacity-50 animate-pulse" style={{ animationDuration: '4.5s' }}></div>
      
      {/* Floating animal emojis */}
      <div className="absolute top-1/4 left-1/4 text-4xl animate-float" style={{ animationDuration: '6s', animationDelay: '1s' }}>🐼</div>
      <div className="absolute top-2/3 right-1/4 text-4xl animate-float" style={{ animationDuration: '7s', animationDelay: '0.5s' }}>🦁</div>
      <div className="absolute bottom-1/4 left-1/3 text-4xl animate-float" style={{ animationDuration: '8s', animationDelay: '1.5s' }}>🐯</div>
      
      {/* Fun Animal Icons Row */}
      <div className="flex space-x-6 mb-10 relative z-10">
        <span className="text-5xl sm:text-6xl">🐶</span>
        <span className="text-5xl sm:text-6xl">🐱</span>
        <span className="text-5xl sm:text-6xl">🐰</span>
        <span className="text-5xl sm:text-6xl">🦊</span>
      </div>

      <h1 className="text-5xl sm:text-6xl font-bold text-blue-800 mb-6 relative z-10 text-shadow">
        Baby Memory Fun!
      </h1>

      <p className="text-lg text-gray-700 mb-10 max-w-md relative z-10">
        Choose a fun memory game to help your little one learn!
      </p>

      {/* Game Preview Images (Placeholder) */}
      <div className="flex gap-6 mb-12 relative z-10">
        <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white/90 backdrop-blur-sm rounded-xl shadow-md flex items-center justify-center border-2 border-blue-200">
          <span className="text-4xl sm:text-5xl">🐑</span> {/* Example */} 
        </div>
        <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white/90 backdrop-blur-sm rounded-xl shadow-md flex items-center justify-center border-2 border-blue-200">
          <span className="text-4xl sm:text-5xl">❓</span>
        </div>
        <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white/90 backdrop-blur-sm rounded-xl shadow-md flex items-center justify-center border-2 border-blue-200">
           <span className="text-4xl sm:text-5xl">🐑</span> {/* Example Match */}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 mb-10 relative z-10">
        <Button 
          size="lg" 
          className="bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-yellow-900 font-bold text-xl px-10 py-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 min-w-[200px] min-h-[80px] touch-manipulation"
          onClick={handleAnimalGameClick}
        >
          Play Animal Game
        </Button>

        <Button 
          size="lg" 
          className="bg-purple-400 hover:bg-purple-500 active:bg-purple-600 text-purple-900 font-bold text-xl px-10 py-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 min-w-[200px] min-h-[80px] touch-manipulation"
          onClick={handleShapesGameClick}
        >
          Play Shapes Game
        </Button>
      </div>

      

    </div>
  );
}
