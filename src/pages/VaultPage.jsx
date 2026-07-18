import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IdeaCard from '../components/IdeaCard';
import { getIdeas } from '../services/db';
import { fileToGoogleDrive } from '../services/drive';
import { Lock } from 'lucide-react';

export default function VaultPage() {
  const [ideas, setIdeas] = useState([]);
  const navigate = useNavigate();

  const loadIdeas = async () => {
    const data = await getIdeas('vaulted');
    setIdeas(data);
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  const handleFileToDrive = async (idea) => {
    await fileToGoogleDrive(idea);
    loadIdeas();
  };

  return (
    <div className="p-4 safe-bottom max-w-2xl mx-auto animate-fade-in min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="text-[var(--color-vault)]" size={28} />
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-vault)] to-amber-200">
          The Vault
        </h1>
        <span className="ml-auto bg-[var(--color-vault)]/20 text-[var(--color-vault)] px-3 py-1 rounded-full text-sm font-bold">
          {ideas.length}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {ideas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <Lock size={48} className="mb-4 text-[var(--color-vault)] opacity-50" />
            <p className="text-[var(--color-text-secondary)]">Your vault is empty.</p>
            <p className="text-sm mt-2">Star your best refined ideas to vault them.</p>
          </div>
        ) : (
          ideas.map(idea => (
            <IdeaCard 
              key={idea.id} 
              idea={idea} 
              onClick={() => navigate(`/idea/${idea.id}`)} 
              onFileToDrive={handleFileToDrive}
            />
          ))
        )}
      </div>
    </div>
  );
}
