import React from 'react';
import StatusBadge from './StatusBadge';
import TechStackChips from './TechStackChips';
import { BuildStatusDot } from './BuildStatusIndicator';

export default function IdeaCard({ idea, onClick, onVault, onFileToDrive }) {
  const getBorderColor = (status) => {
    switch (status) {
      case 'draft': return 'border-l-gray-500';
      case 'refining': return 'border-l-blue-500';
      case 'refined': return 'border-l-[var(--color-success)]';
      case 'vaulted': return 'border-l-[var(--color-vault)]';
      case 'filed': return 'border-l-[var(--color-primary)]';
      case 'archived': return 'border-l-gray-700';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div 
      className={`glass-card border-l-4 ${getBorderColor(idea.status)} p-4 mb-4 cursor-pointer hover:bg-[var(--color-surface-hover)] transition-all duration-300 animate-slide-up hover:-translate-y-1`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] truncate flex-1 pr-2">
          {idea.title || 'Untitled Idea'}
        </h3>
        <StatusBadge status={idea.status} />
      </div>

      {/* Build Status Indicator */}
      <div className="flex items-center gap-2 mb-2">
        <BuildStatusDot buildStatus={idea.buildStatus} />
      </div>
      
      <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-3">
        {idea.problemStatement || idea.rawText}
      </p>
      
      {idea.techStack && idea.techStack.length > 0 && (
        <div className="mb-3">
          <TechStackChips techStack={idea.techStack} />
        </div>
      )}
      
      <div className="flex justify-between items-center text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-3 mt-auto">
        <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
        <div className="flex gap-2">
           {idea.status === 'refined' && onVault && (
             <button 
               onClick={(e) => { e.stopPropagation(); onVault(idea.id); }}
               className="text-[var(--color-vault)] hover:text-amber-400 font-medium px-2 py-1 bg-[var(--color-vault)]/10 rounded-md transition-colors"
             >
               Vault
             </button>
           )}
           {idea.status === 'vaulted' && onFileToDrive && (
             <button 
               onClick={(e) => { e.stopPropagation(); onFileToDrive(idea); }}
               className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium px-2 py-1 bg-[var(--color-primary)]/10 rounded-md transition-colors"
             >
               File to Drive
             </button>
           )}
        </div>
      </div>
    </div>
  );
}
