const HISTORY_KEY = "prp_history_v1";
const LATEST_KEY = "prp_latest_v1";

const DEFAULT_SOFT_SKILLS = [
  "Communication",
  "Problem solving",
  "Basic coding",
  "Projects"
];

let historyWarningFlag = false;

function markHistoryWarning() {
  historyWarningFlag = true;
}

export function getHistoryWarning() {
  return historyWarningFlag ? "corrupt" : null;
}

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    markHistoryWarning();
    return fallback;
  }
}

function toStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string");
}

function normalizeExtractedSkills(raw) {
  const base = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: []
  };

  if (!raw || typeof raw !== "object") {
    base.other = DEFAULT_SOFT_SKILLS.slice();
    return base;
  }

  const mapCategory = (sourceKeys, targetKey) => {
    const collected = [];
    for (const key of sourceKeys) {
      const value = raw[key];
      if (Array.isArray(value)) {
        value.forEach((skill) => {
          if (typeof skill === "string" && !collected.includes(skill)) {
            collected.push(skill);
          }
        });
      }
    }
    base[targetKey] = collected;
  };

  mapCategory(["Core CS", "coreCS"], "coreCS");
  mapCategory(["Languages", "languages"], "languages");
  mapCategory(["Web", "web"], "web");
  mapCategory(["Data", "data"], "data");
  mapCategory(["Cloud/DevOps", "cloud"], "cloud");
  mapCategory(["Testing", "testing"], "testing");

  // Anything else goes into "other"
  Object.entries(raw).forEach(([key, value]) => {
    if (
      key === "Core CS" ||
      key === "coreCS" ||
      key === "Languages" ||
      key === "languages" ||
      key === "Web" ||
      key === "web" ||
      key === "Data" ||
      key === "data" ||
      key === "Cloud/DevOps" ||
      key === "cloud" ||
      key === "Testing" ||
      key === "testing"
    ) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((skill) => {
        if (typeof skill === "string" && !base.other.includes(skill)) {
          base.other.push(skill);
        }
      });
    }
  });

  const allEmpty =
    base.coreCS.length === 0 &&
    base.languages.length === 0 &&
    base.web.length === 0 &&
    base.data.length === 0 &&
    base.cloud.length === 0 &&
    base.testing.length === 0 &&
    base.other.length === 0;

  if (allEmpty) {
    base.other = DEFAULT_SOFT_SKILLS.slice();
  }

  return base;
}

function normalizeRoundMapping(raw) {
  if (!Array.isArray(raw)) return [];
  const list = [];
  for (const round of raw) {
    if (!round || typeof round !== "object") continue;
    const roundTitle = String(round.roundTitle || round.title || "").trim();
    const focusAreas = toStringArray(round.focusAreas);
    const focusText = String(round.focus || "").trim();
    const mergedFocus =
      focusAreas.length > 0
        ? focusAreas
        : focusText
        ? [focusText]
        : [];
    const whyItMatters = String(round.whyItMatters || round.why || "").trim();
    if (!roundTitle && mergedFocus.length === 0 && !whyItMatters) continue;
    list.push({
      roundTitle,
      focusAreas: mergedFocus,
      whyItMatters
    });
  }
  return list;
}

function normalizeChecklist(raw) {
  // Canonical: array of { roundTitle, items[] }
  const result = [];

  if (Array.isArray(raw)) {
    raw.forEach((item) => {
      if (!item || typeof item !== "object") return;
      const roundTitle = String(item.roundTitle || "").trim();
      const items = toStringArray(item.items);
      if (!roundTitle && items.length === 0) return;
      result.push({ roundTitle, items });
    });
    return result;
  }

  if (raw && typeof raw === "object") {
    Object.entries(raw).forEach(([roundTitle, items]) => {
      const list = toStringArray(items);
      result.push({ roundTitle, items: list });
    });
  }

  return result;
}

function normalizePlan7Days(raw) {
  const result = [];

  if (Array.isArray(raw)) {
    raw.forEach((dayEntry) => {
      if (!dayEntry || typeof dayEntry !== "object") return;
      const day = String(dayEntry.day || "").trim();
      const focus = String(dayEntry.focus || "").trim();
      const tasks = toStringArray(dayEntry.tasks);
      if (!day && tasks.length === 0) return;
      result.push({ day, focus, tasks });
    });
    return result;
  }

  if (raw && typeof raw === "object") {
    Object.entries(raw).forEach(([day, tasks]) => {
      result.push({
        day,
        focus: "",
        tasks: toStringArray(tasks)
      });
    });
  }

  return result;
}

function deriveChecklistMap(checklistArray) {
  const map = {};
  checklistArray.forEach((entry) => {
    if (!entry || typeof entry !== "object") return;
    const title = String(entry.roundTitle || "").trim();
    if (!title) return;
    map[title] = toStringArray(entry.items);
  });
  return map;
}

function derivePlanMap(plan7Days) {
  const map = {};
  plan7Days.forEach((entry) => {
    if (!entry || typeof entry !== "object") return;
    const day = String(entry.day || "").trim();
    if (!day) return;
    map[day] = toStringArray(entry.tasks);
  });
  return map;
}

function normalizeEntry(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid history entry");
  }

  const nowIso = new Date().toISOString();

  const id =
    typeof raw.id === "string" && raw.id ? raw.id : createId();

  const createdAt =
    typeof raw.createdAt === "string" && raw.createdAt
      ? raw.createdAt
      : nowIso;

  const company =
    typeof raw.company === "string" ? raw.company : "";

  const role =
    typeof raw.role === "string" ? raw.role : "";

  const jdText =
    typeof raw.jdText === "string" ? raw.jdText : "";

  const extractedSkills = normalizeExtractedSkills(raw.extractedSkills);
  const roundMapping = normalizeRoundMapping(raw.roundMapping);

  const checklist = normalizeChecklist(raw.checklist);
  const plan7Days = normalizePlan7Days(raw.plan7Days || raw.plan);

  const questions = toStringArray(raw.questions);

  const baseScore =
    typeof raw.baseScore === "number"
      ? raw.baseScore
      : typeof raw.baseReadinessScore === "number"
      ? raw.baseReadinessScore
      : typeof raw.readinessScore === "number"
      ? raw.readinessScore
      : 0;

  const skillConfidenceMap =
    raw.skillConfidenceMap && typeof raw.skillConfidenceMap === "object"
      ? raw.skillConfidenceMap
      : {};

  const finalScore =
    typeof raw.finalScore === "number" ? raw.finalScore : baseScore;

  const updatedAt =
    typeof raw.updatedAt === "string" && raw.updatedAt
      ? raw.updatedAt
      : createdAt || nowIso;

  // Derive legacy-friendly shapes for existing UI without sacrificing the strict model.
  const checklistMap = deriveChecklistMap(checklist);
  const planMap = derivePlanMap(plan7Days);

  return {
    id,
    createdAt,
    company,
    role,
    jdText,
    extractedSkills,
    roundMapping,
    checklist,
    plan7Days,
    questions,
    baseScore,
    skillConfidenceMap,
    finalScore,
    updatedAt,
    // compatibility fields used elsewhere in the UI
    checklistMap,
    plan: planMap,
    readinessScore: finalScore
  };
}

export function loadHistory() {
  const raw = localStorage.getItem(HISTORY_KEY);
  const list = safeParse(raw, []);
  if (!Array.isArray(list)) {
    if (raw != null) {
      markHistoryWarning();
    }
    return [];
  }

  const result = [];
  for (const entry of list) {
    try {
      result.push(normalizeEntry(entry));
    } catch {
      markHistoryWarning();
    }
  }

  return result;
}

export function saveHistory(list) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

export function loadLatest() {
  const raw = localStorage.getItem(LATEST_KEY);
  const entry = safeParse(raw, null);
  if (!entry || typeof entry !== "object") {
    if (raw != null) {
      markHistoryWarning();
    }
    return null;
  }
  try {
    return normalizeEntry(entry);
  } catch {
    markHistoryWarning();
    return null;
  }
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
  const normalized = normalizeEntry(entry);
  const history = loadHistory();
  const next = [normalized, ...history];
  saveHistory(next);
  saveLatest(normalized);
  return next;
}

export function findHistoryEntryById(id) {
  if (!id) return null;
  const history = loadHistory();
  return history.find((e) => e && e.id === id) || null;
}

export function updateHistoryEntry(updated) {
  if (!updated || !updated.id) return;
  const history = loadHistory();
  const next = history.map((entry) =>
    entry && entry.id === updated.id ? updated : entry
  );
  saveHistory(next);

  const latest = loadLatest();
  if (latest && latest.id === updated.id) {
    saveLatest(updated);
  }
}


