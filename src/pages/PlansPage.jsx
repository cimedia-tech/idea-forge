import React, { useState, useEffect } from 'react';
import { getIdeas } from '../services/db';
import { FolderOpen, ExternalLink, Play } from 'lucide-react';
import TechStackChips from '../components/TechStackChips';

export default function PlansPage() {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    getIdeas('filed').then(setIdeas);
  }, []);

  return (
    <div className="p-4 safe-bottom max-w-2xl mx-auto animate-fade-in min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <FolderOpen className="text-[var(--color-primary)]" size={28} />
        <h1 className="text-2xl font-bold">Filed Plans</h1>
      </div>

      <div className="space-y-4">
        {ideas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <FolderOpen size={48} className="mb-4 text-[var(--color-text-muted)]" />
            <p className="text-[var(--color-text-secondary)]">No plans filed yet.</p>
            <p className="text-sm mt-2">Refine ideas and file them to Drive.</p>
          </div>
        ) : (
          ideas.map(idea => (
            <div key={idea.id} className="glass-card p-5 border-l-4 border-l-[var(--color-primary)] animate-slide-up">
              <h3 className="text-xl font-bold mb-2">{idea.title}</h3>
              
              <div className="flex gap-4 mb-4 text-sm text-[var(--color-text-secondary)]">
                {idea.complexity && (
                  <span className="bg-gray-800 px-2 py-1 rounded">Complexity: {idea.complexity}</span>
                )}
                {idea.buildTime && (
                  <span className="bg-gray-800 px-2 py-1 rounded">Build: {idea.buildTime}</span>
                )}
              </div>
              
              <div className="mb-6">
                <TechStackChips techStack={idea.techStack} />
              </div>
              
              <div className="flex gap-3">
                {idea.driveLink && (
                  <a 
                    href={idea.driveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-surface-hover)] hover:bg-[var(--color-border)] py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    <ExternalLink size={16} /> Drive Doc
                  </a>
                )}
                <button className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-2 rounded-lg transition-colors text-sm font-medium">
                  <Play size={16} /> Initiate Build
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
