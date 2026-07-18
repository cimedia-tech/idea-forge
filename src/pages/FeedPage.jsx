import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import IdeaCard from '../components/IdeaCard';
import { getIdeas, vaultIdea, archiveIdea } from '../services/db';
import { Inbox } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Drafts' },
  { id: 'refined', label: 'Refined' },
  { id: 'vaulted', label: 'Vaulted' }
];

export default function FeedPage() {
  const [ideas, setIdeas] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const loadIdeas = async () => {
    const data = await getIdeas(activeTab === 'all' ? null : activeTab);
    setIdeas(data);
  };

  useEffect(() => {
    loadIdeas();
  }, [activeTab]);

  const filteredIdeas = ideas.filter(idea => 
    (idea.title || idea.rawText).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 safe-bottom max-w-2xl mx-auto animate-fade-in min-h-screen">
      <div className="sticky top-0 z-10 bg-[var(--color-background)]/80 backdrop-blur-md pb-4 pt-2 -mx-4 px-4">
        <h1 className="text-2xl font-bold mb-4">Feed</h1>
        
        <input 
          type="text"
          placeholder="Search ideas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full glass-card px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-[var(--color-primary)] text-white' 
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {filteredIdeas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <Inbox size={48} className="mb-4 text-[var(--color-text-muted)]" />
            <p className="text-[var(--color-text-secondary)]">No ideas found.</p>
            {activeTab === 'all' && <p className="text-sm mt-2">Go capture your first idea!</p>}
          </div>
        ) : (
          filteredIdeas.map(idea => (
            <IdeaCard 
              key={idea.id} 
              idea={idea} 
              onClick={() => navigate(`/idea/${idea.id}`)} 
              onVault={async (id) => { await vaultIdea(id); loadIdeas(); }}
            />
          ))
        )}
      </div>
    </div>
  );
}
