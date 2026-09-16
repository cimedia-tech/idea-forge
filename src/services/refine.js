const DEFAULT_TECH_STACK = ['React', 'Vite', 'PWA', 'IndexedDB'];

function titleCase(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function buildLocalRefinement(rawText) {
  const normalized = rawText.trim().replace(/\s+/g, ' ');
  const words = normalized.split(' ').slice(0, 5).join(' ');
  const title = titleCase(words || 'Untitled Idea');
  const complexity = normalized.length > 260 ? 'High' : normalized.length > 100 ? 'Medium' : 'Low';

  return {
    title,
    problemStatement: `This idea points to an opportunity around “${normalized}”. The first validation question is whether the intended audience feels this pain often enough to adopt a focused solution.`,
    solution: `Build a small, mobile-first prototype for ${normalized}. Keep version one focused on one repeatable workflow, capture one success metric, and make the next user action obvious.`,
    techStack: DEFAULT_TECH_STACK,
    targetMarket: 'Start with the specific people who already experience this problem and can describe their current workaround.',
    revenueModel: 'Validate demand with a paid pilot, then choose a subscription or one-time implementation offer based on repeat usage.',
    complexity,
    buildTime: complexity === 'Low' ? '3-5 days' : complexity === 'Medium' ? '1-2 weeks' : '2-4 weeks',
    tags: ['captured', 'needs-validation', 'mobile-first'],
    source: 'local'
  };
}

export async function refineIdea(rawText) {
  const normalized = rawText.trim();
  if (!normalized) throw new Error('An idea is required');

  try {
    const response = await fetch('/api/refine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText: normalized })
    });

    if (!response.ok) throw new Error(`Refinement request failed (${response.status})`);

    const refined = await response.json();
    return { ...refined, source: 'ai' };
  } catch (error) {
    console.warn('AI refinement unavailable; using local refinement.', error);
    return buildLocalRefinement(normalized);
  }
}
