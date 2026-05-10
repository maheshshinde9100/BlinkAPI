import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.shellreq');
const HISTORY_FILE = path.join(CONFIG_DIR, 'history.json');
const COLLECTIONS_FILE = path.join(CONFIG_DIR, 'collections.json');

export interface HistoryItem {
  id: string;
  method: string;
  url: string;
  timestamp: number;
}

export function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function saveHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>) {
  ensureConfigDir();
  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
  };
  history.unshift(newItem);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(0, 50), null, 2));
}

export interface CollectionItem extends HistoryItem {
  name: string;
}

export function saveCollection(name: string, item: Omit<HistoryItem, 'id' | 'timestamp'>) {
  ensureConfigDir();
  const collections = getCollections();
  const newItem: CollectionItem = {
    ...item,
    name,
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
  };
  collections.push(newItem);
  fs.writeFileSync(COLLECTIONS_FILE, JSON.stringify(collections, null, 2));
}

export function getCollections(): CollectionItem[] {
  if (!fs.existsSync(COLLECTIONS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(COLLECTIONS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export function getHistory(): HistoryItem[] {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
  } catch {
    return [];
  }
}
