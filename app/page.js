'use client'; 

import Image from "next/image";
import { Button } from "@/components/ui/button"; 
import { useRouter } from 'next/navigation'; 

export default function Home() {
  const router = useRouter(); 

  const handleStartClick = () => {
    router.push('/game'); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-blue-100 p-8 text-center font-sans">
      
      {/* Fun Animal Icons Row */}
      <div className="flex space-x-4 mb-8">
        <span className="text-4xl">🐶</span>
        <span className="text-4xl">🐱</span>
        <span className="text-4xl">🐰</span>
        <span className="text-4xl">🦊</span>
      </div>

      <h1 className="text-5xl font-bold text-blue-800 mb-4">
        Baby Memory Fun!
      </h1>

      <p className="text-lg text-gray-700 mb-10 max-w-md">
        Match the cute animals and help your little one learn!
      </p>

      {/* Game Preview Images (Placeholder) */}
      <div className="flex gap-4 mb-12">
        <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center">
          <span className="text-3xl">🐑</span> {/* Example */} 
        </div>
        <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center">
          <span className="text-3xl">❓</span>
        </div>
        <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center">
           <span className="text-3xl">🐑</span> {/* Example Match */}
        </div>
      </div>

      <Button 
        size="lg" 
        className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-xl px-10 py-7 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        onClick={handleStartClick}
      >
        Start Playing!
      </Button>

    </div>
  );
}
