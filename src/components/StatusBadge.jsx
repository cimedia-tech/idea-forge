import React from 'react';

export default function StatusBadge({ status }) {
  let config = { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Draft' };
  
  switch (status) {
    case 'draft':
      config = { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Draft' };
      break;
    case 'refining':
      config = { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Refining...', animate: 'animate-pulse' };
      break;
    case 'refined':
      config = { bg: 'bg-[var(--color-success)]/20', text: 'text-[var(--color-success)]', label: 'Refined' };
      break;
    case 'vaulted':
      config = { bg: 'bg-[var(--color-vault)]/20', text: 'text-[var(--color-vault)]', label: 'Vaulted', animate: 'animate-vault-shimmer' };
      break;
    case 'filed':
      config = { bg: 'bg-[var(--color-primary)]/20', text: 'text-[var(--color-primary-hover)]', label: 'Filed' };
      break;
    case 'archived':
      config = { bg: 'bg-gray-800', text: 'text-gray-500', label: 'Archived' };
      break;
  }

  return (
    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full whitespace-nowrap ${config.bg} ${config.text} ${config.animate || ''}`}>
      {config.label}
    </span>
  );
}
