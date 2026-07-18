import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceCapture from '../components/VoiceCapture';
import { addIdea, getStats } from '../services/db';
import { BrainCircuit } from 'lucide-react';

export default function CapturePage() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({ total: 0, vaulted: 0, filed: 0 });
  const [isRefining, setIsRefining] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  const handleCapture = async () => {
    if (!text.trim()) return;
    await addIdea(text);
    setText('');
    getStats().then(setStats);
    // show success toast maybe
  };

  const handleCaptureAndRefine = async () => {
    if (!text.trim()) return;
    setIsRefining(true);
    
    // 1. Save as draft
    const idea = await addIdea(text);
    
    // 2. Mock AI Refinement (would call backend here)
    setTimeout(async () => {
      // simulate redirect to detail page for real refinement or after refinement
      setIsRefining(false);
      navigate(`/idea/${idea.id}`);
    }, 1500);
  };

  const handleTranscript = (transcript, isFinal) => {
    if (isFinal) {
       setText(prev => (prev ? prev + ' ' + transcript : transcript));
    }
  };

  return (
    <div className="p-4 safe-bottom max-w-2xl mx-auto animate-fade-in flex flex-col h-full min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Capture</h1>
        <div className="flex gap-4 text-sm text-[var(--color-text-muted)]">
          <span>{stats.total} total</span>
          <span className="text-[var(--color-vault)]">{stats.vaulted} vaulted</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative">
        <textarea
          className="w-full flex-1 glass-card p-6 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-transparent text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] rounded-2xl mb-4"
          placeholder="What's your idea?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        <div className="absolute bottom-8 right-4">
          <VoiceCapture onTranscript={handleTranscript} />
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-[var(--color-text-muted)] mb-4 px-2">
        <span>{text.length} characters</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <button 
          onClick={handleCapture}
          disabled={!text.trim() || isRefining}
          className="touch-target glass-card py-3 font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-50 transition-all active:scale-95"
        >
          Save Draft
        </button>
        <button 
          onClick={handleCaptureAndRefine}
          disabled={!text.trim() || isRefining}
          className="touch-target bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold py-3 rounded-xl disabled:opacity-50 transition-all active:scale-95 flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          {isRefining ? (
             <BrainCircuit className="animate-pulse" />
          ) : (
            'Capture & Refine'
          )}
        </button>
      </div>
    </div>
  );
}
