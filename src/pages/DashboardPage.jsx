import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIdeas, updateIdea } from '../services/db';
import { 
  BarChart3, 
  Search, 
  Folder, 
  ExternalLink, 
  Play, 
  ArrowLeft, 
  Layers, 
  Compass, 
  Hammer, 
  TrendingUp, 
  CheckCircle,
  Clock
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import TechStackChips from '../components/TechStackChips';
import { BuildStatusDot, BUILD_STATUSES } from '../components/BuildStatusIndicator';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [buildFilter, setBuildFilter] = useState('all');
  const [folderFilter, setFolderFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    processed: 0,
    vaulted: 0,
    filed: 0,
    building: 0,
    deployed: 0
  });

  // Load ideas and compute stats
  useEffect(() => {
    getIdeas().then(data => {
      setIdeas(data);
      
      const processed = data.filter(i => i.status !== 'draft');
      const vaulted = data.filter(i => i.status === 'vaulted');
      const filed = data.filter(i => i.status === 'filed');
      const building = data.filter(i => i.buildStatus === 'in_progress');
      const deployed = data.filter(i => i.buildStatus === 'deployed');

      setStats({
        total: data.length,
        processed: processed.length,
        vaulted: vaulted.length,
        filed: filed.length,
        building: building.length,
        deployed: deployed.length
      });
    });
  }, []);

  const handleBuildStatusChange = async (id, newBuildStatus) => {
    // If build status becomes in_pipeline, in_progress, completed, or deployed,
    // auto-update the Drive folder name accordingly to keep the dashboard synced
    let driveFolder = '00_Inbox';
    if (newBuildStatus === 'in_pipeline' || newBuildStatus === 'in_progress') {
      driveFolder = '01_Under_Review';
    } else if (newBuildStatus === 'completed' || newBuildStatus === 'deployed') {
      driveFolder = '02_Approved_For_Build';
    }
    
    const updated = await updateIdea(id, { buildStatus: newBuildStatus, driveFolder });
    setIdeas(ideas.map(i => i.id === id ? updated : i));
  };

  // Filter ideas
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = 
      (idea.title && idea.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (idea.rawText && idea.rawText.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (idea.techStack && idea.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
    const matchesBuild = buildFilter === 'all' || idea.buildStatus === buildFilter;
    
    // Drive Folder filter helper
    const folder = idea.driveFolder || (idea.status === 'filed' ? '00_Inbox' : 'none');
    const matchesFolder = folderFilter === 'all' || folder === folderFilter;

    return matchesSearch && matchesStatus && matchesBuild && matchesFolder;
  });

  return (
    <div className="bg-[#0F0F14] text-[var(--color-text-primary)] min-h-screen p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-[var(--color-border)]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <BarChart3 className="text-[var(--color-primary)]" size={32} />
            IdeaForge Portfolio Dashboard
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Console for managing AI-processed service plans, Google Drive directories, and build pipelines.
          </p>
        </div>
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to App
        </button>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-gray-500">
          <span className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Total Ideas</span>
          <span className="text-3xl font-extrabold mt-2 text-white">{stats.total}</span>
        </div>
        <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-blue-500">
          <span className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Processed</span>
          <span className="text-3xl font-extrabold mt-2 text-white">{stats.processed}</span>
        </div>
        <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-[var(--color-success)]">
          <span className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Filed to Drive</span>
          <span className="text-3xl font-extrabold mt-2 text-white">{stats.filed}</span>
        </div>
        <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-[var(--color-vault)]">
          <span className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Vaulted</span>
          <span className="text-3xl font-extrabold mt-2 text-white">{stats.vaulted}</span>
        </div>
        <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-amber-500">
          <span className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Building</span>
          <span className="text-3xl font-extrabold mt-2 text-white">{stats.building}</span>
        </div>
        <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-violet-500">
          <span className="text-xs text-[var(--color-text-muted)] uppercase font-semibold">Deployed</span>
          <span className="text-3xl font-extrabold mt-2 text-white">{stats.deployed}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-5 mb-8 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, stack, or raw capture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold">App Status</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[var(--color-background)] border border-[var(--color-border)] px-3 py-2 rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="refined">Refined</option>
            <option value="vaulted">Vaulted</option>
            <option value="filed">Filed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Drive Folder Filter */}
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Drive Folder</label>
          <select 
            value={folderFilter} 
            onChange={(e) => setFolderFilter(e.target.value)}
            className="bg-[var(--color-background)] border border-[var(--color-border)] px-3 py-2 rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none"
          >
            <option value="all">All Folders</option>
            <option value="none">Not Filed</option>
            <option value="00_Inbox">00_Inbox</option>
            <option value="01_Under_Review">01_Under_Review</option>
            <option value="02_Approved_For_Build">02_Approved_For_Build</option>
            <option value="03_Archived">03_Archived</option>
          </select>
        </div>

        {/* Build Pipeline Filter */}
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <label className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold">Build Phase</label>
          <select 
            value={buildFilter} 
            onChange={(e) => setBuildFilter(e.target.value)}
            className="bg-[var(--color-background)] border border-[var(--color-border)] px-3 py-2 rounded-lg text-sm text-[var(--color-text-primary)] focus:outline-none"
          >
            <option value="all">All Phases</option>
            <option value="none">Not Started</option>
            <option value="in_pipeline">In Pipeline</option>
            <option value="in_progress">Building</option>
            <option value="attempted">Attempted</option>
            <option value="completed">Built</option>
            <option value="deployed">Deployed</option>
          </select>
        </div>
      </div>

      {/* Main Table Widescreen Dashboard */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)] text-xs text-[var(--color-text-muted)] uppercase font-bold tracking-wider">
                <th className="py-4 px-6">Idea Detail / Title</th>
                <th className="py-4 px-4">App Status</th>
                <th className="py-4 px-4">Drive Folder Location</th>
                <th className="py-4 px-4">Drive Link</th>
                <th className="py-4 px-4">Build Phase</th>
                <th className="py-4 px-6 text-right">Pipeline Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-sm">
              {filteredIdeas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-[var(--color-text-muted)] opacity-50">
                    No matching ideas or plans found.
                  </td>
                </tr>
              ) : (
                filteredIdeas.map(idea => {
                  const driveFolder = idea.driveFolder || (idea.status === 'filed' ? '00_Inbox' : 'N/A');
                  const isFiled = idea.status === 'filed' || idea.driveLink;

                  return (
                    <tr key={idea.id} className="hover:bg-[var(--color-surface-hover)] transition-colors group">
                      {/* Title & Info */}
                      <td className="py-4 px-6 max-w-xs md:max-w-md">
                        <div className="font-semibold text-white group-hover:text-[var(--color-primary-hover)] transition-colors cursor-pointer" onClick={() => navigate(`/idea/${idea.id}`)}>
                          {idea.title || 'Untitled Idea'}
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] line-clamp-1 mt-1">
                          {idea.problemStatement || idea.rawText}
                        </p>
                        {idea.techStack && idea.techStack.length > 0 && (
                          <div className="mt-2 scale-90 origin-left">
                            <TechStackChips techStack={idea.techStack} />
                          </div>
                        )}
                      </td>
                      
                      {/* App Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={idea.status} />
                      </td>

                      {/* Google Drive Folder Location */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isFiled ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md ring-1 ring-indigo-500/20 font-mono font-medium">
                            <Folder size={12} />
                            05_IdeaForge_Vault/{driveFolder}
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--color-text-muted)] italic">Not Filed to Drive</span>
                        )}
                      </td>

                      {/* Google Drive Link */}
                      <td className="py-4 px-4">
                        {isFiled && idea.driveLink ? (
                          <a 
                            href={idea.driveLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[var(--color-primary-hover)] hover:underline font-medium"
                          >
                            Open Link
                            <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className="text-xs text-[var(--color-text-muted)]">—</span>
                        )}
                      </td>

                      {/* Build Phase Selector */}
                      <td className="py-4 px-4">
                        <select
                          value={idea.buildStatus || 'none'}
                          onChange={(e) => handleBuildStatusChange(idea.id, e.target.value)}
                          className="bg-[var(--color-background)] border border-[var(--color-border)] rounded px-2 py-1 text-xs text-[var(--color-text-secondary)] focus:outline-none"
                        >
                          <option value="none">Not Started</option>
                          <option value="in_pipeline">In Pipeline</option>
                          <option value="in_progress">Building</option>
                          <option value="attempted">Attempted</option>
                          <option value="completed">Built</option>
                          <option value="deployed">Deployed</option>
                        </select>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button 
                          onClick={() => navigate(`/idea/${idea.id}`)}
                          className="px-3 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary-hover)] hover:bg-[var(--color-primary)] hover:text-white rounded-md transition-all text-xs font-semibold"
                        >
                          Manage Plan
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
