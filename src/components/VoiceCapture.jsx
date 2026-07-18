import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceCapture({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        onTranscript(finalTranscript || interimTranscript, !!finalTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setError(event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [onTranscript]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setError(null);
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  if (!recognitionRef.current) {
    return null; // Not supported
  }

  return (
    <button
      onClick={toggleRecording}
      className={`touch-target p-3 rounded-full flex items-center justify-center transition-all duration-300 ${
        isRecording 
          ? 'bg-red-500 text-white animate-pulse-glow shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
          : 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] hover:text-white'
      }`}
      type="button"
      title="Voice Capture"
    >
      {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
    </button>
  );
}
