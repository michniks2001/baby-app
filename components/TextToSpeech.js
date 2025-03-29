'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Volume2, VolumeX } from 'lucide-react';

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speech, setSpeech] = useState(null);

  useEffect(() => {
    // Make sure we're in the browser environment
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Initialize speech synthesis
      const speechSynthesis = window.speechSynthesis;
      const utterance = new window.SpeechSynthesisUtterance();
      
      // Configure speech settings
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Set up event listeners
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setSpeech(utterance);

      // Cleanup
      return () => {
        speechSynthesis.cancel();
      };
    }
  }, []);

  const handleSpeak = () => {
    if (!text || typeof window === 'undefined') return;
    
    // Cancel any ongoing speech first
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Create a fresh utterance each time to avoid issues
    const utterance = new window.SpeechSynthesisUtterance(text);
    
    // Configure speech settings
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Set up event listeners
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Text to Speech</h2>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech..."
        className="min-h-[100px] mb-4"
      />
      <div className="flex gap-2">
        <Button
          onClick={handleSpeak}
          disabled={!text || isSpeaking}
          className="flex items-center gap-2"
        >
          <Volume2 className="w-4 h-4" />
          Speak
        </Button>
        <Button
          onClick={handleStop}
          disabled={!isSpeaking}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <VolumeX className="w-4 h-4" />
          Stop
        </Button>
      </div>
    </div>
  );
} 