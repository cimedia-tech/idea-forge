import React from 'react';

const CATEGORIES = {
  frontend: { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/20' },
  backend: { bg: 'bg-green-500/10', text: 'text-green-300', border: 'border-green-500/20' },
  infra: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/20' },
  payments: { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/20' },
  default: { bg: 'bg-gray-500/10', text: 'text-gray-300', border: 'border-gray-500/20' }
};

const getCategory = (tech) => {
  const t = tech.toLowerCase();
  if (t.includes('react') || t.includes('vue') || t.includes('tailwind') || t.includes('css') || t.includes('html') || t.includes('frontend')) return CATEGORIES.frontend;
  if (t.includes('node') || t.includes('python') || t.includes('django') || t.includes('api') || t.includes('sql') || t.includes('db')) return CATEGORIES.backend;
  if (t.includes('aws') || t.includes('vercel') || t.includes('docker') || t.includes('infra')) return CATEGORIES.infra;
  if (t.includes('stripe') || t.includes('pay')) return CATEGORIES.payments;
  return CATEGORIES.default;
}

export default function TechStackChips({ techStack }) {
  if (!techStack || !techStack.length) return null;

  // Render max 4 to not clutter
  const displayStack = techStack.slice(0, 4);

  return (
    <div className="flex flex-wrap gap-2">
      {displayStack.map((tech, i) => {
        const style = getCategory(tech);
        return (
          <span 
            key={i} 
            className={`text-xs px-2 py-0.5 rounded-md border ${style.bg} ${style.text} ${style.border}`}
          >
            {tech}
          </span>
        );
      })}
      {techStack.length > 4 && (
        <span className="text-xs px-2 py-0.5 rounded-md border bg-gray-800 border-gray-700 text-gray-400">
          +{techStack.length - 4}
        </span>
      )}
    </div>
  );
}
