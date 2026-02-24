const HISTORY_KEY = "prp_history_v1";
const LATEST_KEY = "prp_latest_v1";

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function loadHistory() {
  const raw = localStorage.getItem(HISTORY_KEY);
  const list = safeParse(raw, []);
  return Array.isArray(list) ? list : [];
}

export function saveHistory(list) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

export function loadLatest() {
  const raw = localStorage.getItem(LATEST_KEY);
  const entry = safeParse(raw, null);
  return entry && typeof entry === "object" ? entry : null;
}

export function saveLatest(entry) {
  localStorage.setItem(LATEST_KEY, JSON.stringify(entry));
}

export function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function addHistoryEntry(entry) {
  const history = loadHistory();
  const next = [entry, ...history];
  saveHistory(next);
  saveLatest(entry);
  return next;
}

export function findHistoryEntryById(id) {
  if (!id) return null;
  const history = loadHistory();
  return history.find((e) => e && e.id === id) || null;
}

