import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIdea, updateIdea, vaultIdea, deleteIdea } from '../services/db';
import { fileToGoogleDrive } from '../services/drive';
import { ArrowLeft, Trash2, BrainCircuit, Star, CloudUpload } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import TechStackChips from '../components/TechStackChips';
import { BuildStatusSelector } from '../components/BuildStatusIndicator';

export default function IdeaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const [isRefining, setIsRefining] = useState(false);

  useEffect(() => {
    getIdea(id).then(setIdea);
  }, [id]);

  if (!idea) return <div className="p-8 text-center">Loading...</div>;

  const handleRefine = async () => {
    setIsRefining(true);
    // Mock Refinement process
    setTimeout(async () => {
      const refinedData = {
        status: 'refined',
        title: 'Auto-Generated Awesome App',
        techStack: ['React', 'Tailwind', 'Node.js', 'PostgreSQL', 'Stripe'],
        problemStatement: 'People need a way to track their fleeting thoughts before they disappear.',
        solution: 'A mobile-first PWA that captures voice and text, and uses AI to expand them into actionable business plans.',
        targetMarket: 'Entrepreneurs, creators, ADHD builders',
        revenueModel: 'Freemium ($5/mo for AI features)',
        complexity: 'Medium',
        buildTime: '2 weeks'
      };
      const updated = await updateIdea(id, refinedData);
      setIdea(updated);
      setIsRefining(false);
    }, 2000);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this idea?')) {
      await deleteIdea(id);
      navigate(-1);
    }
  };

  const handleVault = async () => {
    const updated = await vaultIdea(id);
    setIdea(updated);
  };

  const handleFileToDrive = async () => {
    const link = await fileToGoogleDrive(idea);
    const updated = await getIdea(id);
    setIdea(updated);
  };

  const handleBuildStatusChange = async (newStatus) => {
    const updated = await updateIdea(id, { buildStatus: newStatus });
    setIdea(updated);
  };

  return (
    <div className="p-4 safe-bottom max-w-2xl mx-auto animate-fade-in min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[var(--color-surface-hover)]">
          <ArrowLeft size={24} />
        </button>
        <StatusBadge status={idea.status} />
        <button onClick={handleDelete} className="p-2 -mr-2 rounded-full text-red-400 hover:bg-red-500/10">
          <Trash2 size={20} />
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">{idea.title || 'Draft Idea'}</h1>

      {/* Raw Text */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Raw Capture</h3>
        <div className="glass-card p-4 text-[var(--color-text-secondary)] italic">
          "{idea.rawText}"
        </div>
      </div>

      {idea.status === 'draft' ? (
        <button 
          onClick={handleRefine} 
          disabled={isRefining}
          className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70"
        >
          {isRefining ? <BrainCircuit className="animate-pulse" size={24} /> : <BrainCircuit size={24} />}
          {isRefining ? 'AI is refining...' : 'Refine with AI'}
        </button>
      ) : (
        <div className="space-y-6 animate-slide-up">
          <section>
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Tech Stack</h3>
            <TechStackChips techStack={idea.techStack} />
          </section>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <span className="text-xs text-[var(--color-text-muted)] uppercase block mb-1">Complexity</span>
              <span className="font-semibold">{idea.complexity}</span>
            </div>
            <div className="glass-card p-4">
              <span className="text-xs text-[var(--color-text-muted)] uppercase block mb-1">Est. Build Time</span>
              <span className="font-semibold">{idea.buildTime}</span>
            </div>
          </div>

          {/* Build Status */}
          <BuildStatusSelector 
            buildStatus={idea.buildStatus || 'none'} 
            onChange={handleBuildStatusChange} 
          />

          <section>
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Problem Statement</h3>
            <p className="text-[var(--color-text-primary)]">{idea.problemStatement}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Proposed Solution</h3>
            <p className="text-[var(--color-text-primary)]">{idea.solution}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Target Market & Revenue</h3>
            <p className="text-[var(--color-text-secondary)] mb-2"><strong>Market:</strong> {idea.targetMarket}</p>
            <p className="text-[var(--color-text-secondary)]"><strong>Revenue:</strong> {idea.revenueModel}</p>
          </section>

          {/* Action Bar */}
          <div className="flex gap-3 pt-6 border-t border-[var(--color-border)] mt-8 pb-4">
            {idea.status !== 'vaulted' && idea.status !== 'filed' && (
              <button 
                onClick={handleVault}
                className="flex-1 flex flex-col items-center justify-center gap-1 bg-[var(--color-vault)]/10 text-[var(--color-vault)] hover:bg-[var(--color-vault)]/20 py-3 rounded-xl transition-colors font-semibold"
              >
                <Star size={20} /> Vault
              </button>
            )}
            
            {(idea.status === 'vaulted' || idea.status === 'refined') && idea.status !== 'filed' && (
              <button 
                onClick={handleFileToDrive}
                className="flex-1 flex flex-col items-center justify-center gap-1 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] py-3 rounded-xl transition-colors font-semibold shadow-lg shadow-indigo-500/20"
              >
                <CloudUpload size={20} /> File to Drive
              </button>
            )}
            
            {idea.status === 'filed' && (
              <a 
                href={idea.driveLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] py-3 rounded-xl transition-colors font-semibold"
              >
                Open Google Doc
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
