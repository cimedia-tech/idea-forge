import { openDB } from 'idb';

const DB_NAME = 'ideaforge-db';
const DB_VERSION = 1;
const STORE_NAME = 'ideas';

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('status', 'status');
        store.createIndex('createdAt', 'createdAt');
        store.createIndex('vaultedAt', 'vaultedAt');
      }
    },
  });
}

export async function addIdea(rawText) {
  const db = await initDB();
  const idea = {
    id: crypto.randomUUID(),
    rawText,
    refinedContent: null,
    status: 'draft',
    tags: [],
    title: null,
    techStack: [],
    complexity: null,
    buildTime: null,
    revenueModel: null,
    targetMarket: null,
    problemStatement: null,
    solution: null,
    driveLink: null,
    buildStatus: 'none',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vaultedAt: null
  };
  await db.put(STORE_NAME, idea);
  return idea;
}

export async function getIdeas(status = null) {
  const db = await initDB();
  let ideas = await db.getAllFromIndex(STORE_NAME, 'createdAt');
  if (status) {
    ideas = ideas.filter(idea => idea.status === status);
  }
  return ideas.reverse(); // Newest first
}

export async function getIdea(id) {
  const db = await initDB();
  return db.get(STORE_NAME, id);
}

export async function updateIdea(id, updates) {
  const db = await initDB();
  const idea = await db.get(STORE_NAME, id);
  if (!idea) throw new Error('Idea not found');
  
  const updatedIdea = { ...idea, ...updates, updatedAt: new Date().toISOString() };
  await db.put(STORE_NAME, updatedIdea);
  return updatedIdea;
}

export async function vaultIdea(id) {
  return updateIdea(id, { status: 'vaulted', vaultedAt: new Date().toISOString() });
}

export async function archiveIdea(id) {
  return updateIdea(id, { status: 'archived' });
}

export async function deleteIdea(id) {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
}

export async function getStats() {
  const db = await initDB();
  const ideas = await db.getAll(STORE_NAME);
  const stats = {
    total: ideas.length,
    drafts: 0,
    refined: 0,
    vaulted: 0,
    filed: 0,
    archived: 0
  };
  ideas.forEach(idea => {
    if (stats[idea.status] !== undefined) {
      stats[idea.status]++;
    }
  });
  return stats;
}
