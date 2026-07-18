import React from 'react';
import { Hammer, CircleDashed, CircleDot, CheckCircle2, Rocket, CircleOff } from 'lucide-react';

const BUILD_STATUSES = {
  none: {
    label: 'Not Started',
    icon: CircleOff,
    color: 'text-gray-500',
    bg: 'bg-gray-500/10',
    ring: '',
    description: 'No build attempted'
  },
  in_pipeline: {
    label: 'In Pipeline',
    icon: CircleDashed,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    ring: 'ring-1 ring-cyan-400/30',
    description: 'Queued for build'
  },
  in_progress: {
    label: 'Building',
    icon: Hammer,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    ring: 'ring-1 ring-amber-400/30 animate-pulse',
    description: 'Currently being built'
  },
  attempted: {
    label: 'Attempted',
    icon: CircleDot,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    ring: 'ring-1 ring-orange-400/30',
    description: 'Build was started but not completed'
  },
  completed: {
    label: 'Built',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    ring: 'ring-1 ring-emerald-400/30',
    description: 'Build completed'
  },
  deployed: {
    label: 'Deployed',
    icon: Rocket,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    ring: 'ring-1 ring-violet-400/30',
    description: 'Built and deployed live'
  }
};

/**
 * Compact inline indicator (for cards/lists)
 */
export function BuildStatusDot({ buildStatus = 'none' }) {
  const config = BUILD_STATUSES[buildStatus] || BUILD_STATUSES.none;
  const Icon = config.icon;
  
  return (
    <span 
      className={`inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider ${config.color} ${config.bg} px-2 py-0.5 rounded-full ${config.ring}`}
      title={config.description}
    >
      <Icon size={10} />
      {config.label}
    </span>
  );
}

/**
 * Full build status selector (for detail page)
 */
export function BuildStatusSelector({ buildStatus = 'none', onChange }) {
  const current = BUILD_STATUSES[buildStatus] || BUILD_STATUSES.none;
  const CurrentIcon = current.icon;

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
        <Hammer size={14} />
        Build Status
      </h3>
      
      {/* Current status highlight */}
      <div className={`flex items-center gap-3 mb-4 p-3 rounded-lg ${current.bg} ${current.ring}`}>
        <CurrentIcon size={20} className={current.color} />
        <div>
          <span className={`font-semibold ${current.color}`}>{current.label}</span>
          <p className="text-xs text-[var(--color-text-muted)]">{current.description}</p>
        </div>
      </div>

      {/* Status buttons */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(BUILD_STATUSES).map(([key, config]) => {
          const Icon = config.icon;
          const isActive = key === buildStatus;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium uppercase tracking-wider transition-all duration-200 min-h-[56px] ${
                isActive 
                  ? `${config.bg} ${config.color} ${config.ring}` 
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              <Icon size={16} />
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { BUILD_STATUSES };
export default BuildStatusDot;
