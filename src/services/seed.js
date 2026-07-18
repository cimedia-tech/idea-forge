import { initDB, getIdeas } from './db.js';

const SEED_KEY = 'ideaforge-seeded';

// Mined from past conversations — 9 unbuilt ideas
const SEED_IDEAS = [
  {
    rawText: "Develop a plan to market 2 of the most promising builds we have done — create an avatar of what type of high value customer to market to, create marketing assets on a schedule with viral potential, build a marketing pipeline and product production pipeline system",
    title: "Marketing Pipeline Automator",
    tags: ["marketing", "automation", "pipeline", "content"],
    status: "draft",
    buildStatus: "in_pipeline",
    source: "Past Conversation: Marketing Strategy & Pipeline Automation"
  },
  {
    rawText: "Build an ultra-real ad video creator that produces finished MP4 with cinematic AI footage, professional voiceover, mood-matched music, animated captions, and CTA overlays",
    title: "Ultra-Real Ad Video Creator",
    tags: ["video", "AI", "advertising", "content-creation"],
    status: "draft",
    buildStatus: "attempted",
    source: "Past Conversation: Ultra-Real Ad Video Creator Build"
  },
  {
    rawText: "Use NVIDIA hosted AI models through an OpenAI-compatible API — build an NVIDIA NIM API Orchestrator that agent teams can use, easy to incorporate into existing workflows",
    title: "NVIDIA NIM API Orchestrator",
    tags: ["AI", "NVIDIA", "API", "infrastructure"],
    status: "draft",
    buildStatus: "in_pipeline",
    source: "Past Conversation: NVIDIA API Orchestrator Build"
  },
  {
    rawText: "Build a graduation booking landing page for photography services with online scheduling and payment",
    title: "Graduation Booking Landing Page",
    tags: ["photography", "booking", "landing-page", "payments"],
    status: "draft",
    buildStatus: "attempted",
    source: "Past Conversation: Graduation Booking Landing Page"
  },
  {
    rawText: "The Knowledge Business Blueprint — a premium business report that a reader would pay $500+ for. Build a presell asset with a diagnostic scorecard and ten-person presale offer, then create the full report with original IP frameworks, real case studies with numbers, and failure cases",
    title: "Knowledge Blueprint Presale Platform",
    tags: ["knowledge-business", "presale", "digital-product", "consulting"],
    status: "draft",
    buildStatus: "none",
    source: "Past Conversation: Preselling The Knowledge Blueprint"
  },
  {
    rawText: "Configure Ollama and Kimi on this machine to be part of the Hermes and Antigravity fallback model chain — local AI models as backup when cloud APIs hit quota limits",
    title: "Local AI Fallback Model Chain",
    tags: ["AI", "Ollama", "local-models", "infrastructure"],
    status: "draft",
    buildStatus: "attempted",
    source: "Past Conversation: Integrating Ollama and Kimi"
  },
  {
    rawText: "Identify top three projects from portfolio with highest potential for rapid monetization, define steps for automating and integrating Stripe payments across all products",
    title: "Portfolio Monetization Engine",
    tags: ["monetization", "Stripe", "strategy", "payments"],
    status: "draft",
    buildStatus: "none",
    source: "Past Conversation: Portfolio Monetization Strategy"
  },
  {
    rawText: "Build a React + Tailwind Graduation Invoice Generator that creates luxury-branded graduation photography invoices with customizable client background images, automatic calculations, and PDF export",
    title: "Graduation Invoice Generator",
    tags: ["invoicing", "photography", "PDF", "client-tool"],
    status: "draft",
    buildStatus: "in_pipeline",
    source: "Past Conversation: Graduation Invoice Generator App"
  },
  {
    rawText: "Build a connection to Uncensored.com API to allow agent teams to create assets with unfiltered AI — text chat, image generation, OpenAI-compatible REST API integration as a reusable skill",
    title: "Uncensored.com API Connector",
    tags: ["AI", "API", "integration", "content-creation"],
    status: "draft",
    buildStatus: "none",
    source: "Current Session: Uncensored.com Discussion"
  }
];

export async function seedIdeas() {
  // Only seed once
  if (localStorage.getItem(SEED_KEY)) return;

  const db = await initDB();
  const existing = await db.getAll('ideas');
  
  // Don't seed if user already has ideas
  if (existing.length > 0) {
    localStorage.setItem(SEED_KEY, 'true');
    return;
  }

  for (const seed of SEED_IDEAS) {
    const idea = {
      id: crypto.randomUUID(),
      rawText: seed.rawText,
      refinedContent: null,
      status: seed.status,
      tags: seed.tags,
      title: seed.title,
      techStack: [],
      complexity: null,
      buildTime: null,
      revenueModel: null,
      targetMarket: null,
      problemStatement: null,
      solution: null,
      driveLink: null,
      buildStatus: seed.buildStatus || 'none',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      vaultedAt: null
    };
    await db.put('ideas', idea);
  }

  localStorage.setItem(SEED_KEY, 'true');
  console.log(`🌱 IdeaForge: Seeded ${SEED_IDEAS.length} ideas from past conversations`);
}
