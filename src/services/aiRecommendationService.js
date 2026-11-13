import { auth } from "../firebase/firebase";

const SUBJECT_TOPIC_MAP = {
  Mathematics: ["Algebra", "Geometry", "Statistics"],
  "Mathematics (with Statistics)": ["Algebra", "Geometry", "Statistics"],
  English: ["Grammar", "Comprehension", "Essay Writing"],
  "English Language": ["Grammar", "Comprehension", "Essay Writing"],
  Science: ["Biology", "Chemistry", "Physics"],
  "Integrated Science": ["Biology", "Chemistry", "Physics"],
  "Social Studies": ["History", "Geography", "Civic Education"],
  "Social studies": ["History", "Geography", "Civic Education"],
  RME: ["Ethics", "Morals", "Leadership"],
};

const CACHE_PREFIX = "bece-prep-ai-recommendations-v2:";
const MEMORY_CACHE = new Map();
const GEMINI_CACHE_MS = 6 * 60 * 60 * 1000;
const FALLBACK_CACHE_MS = 15 * 60 * 1000;
const FUNCTIONS_BASE_URL = "https://us-central1-bece-prep.cloudfunctions.net";

async function callAIChatEndpoint(payload) {
  const user = auth.currentUser;
  if (!user) throw new Error("Sign in to use AI Study Chat.");

  const token = await user.getIdToken();
  const response = await fetch(`${FUNCTIONS_BASE_URL}/aiChat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.error || "AI Study Chat is temporarily unavailable.");
    error.remainingToday = data?.remainingToday;
    throw error;
  }

  return data;
}

export async function getAIChatStatus() {
  return callAIChatEndpoint({ operation: "status" });
}

export async function sendAIChatMessage(message, history = []) {
  return callAIChatEndpoint({ message, history: history.slice(-8) });
}

function getCachedRecommendations(key) {
  const memoryEntry = MEMORY_CACHE.get(key);
  if (memoryEntry && memoryEntry.expiresAt > Date.now()) return memoryEntry.result;

  try {
    const stored = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!stored) return null;
    const entry = JSON.parse(stored);
    if (!entry?.expiresAt || entry.expiresAt <= Date.now()) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    MEMORY_CACHE.set(key, entry);
    return entry.result;
  } catch {
    return null;
  }
}

function cacheRecommendations(key, result) {
  const ttl = result.provider === "gemini" ? GEMINI_CACHE_MS : FALLBACK_CACHE_MS;
  const entry = { result, expiresAt: Date.now() + ttl };
  MEMORY_CACHE.set(key, entry);
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch {
    // Keep the in-memory cache if browser storage is unavailable.
  }
}

const normalizeSubject = (subject = "Unknown") => {
  if (!subject) return "Unknown";
  const normalized = String(subject).trim();
  return normalized === "Social studies" ? "Social studies" : normalized;
};

const getSubjectAverages = (attempts = []) => {
  const scoresBySubject = {};

  attempts.forEach((attempt) => {
    const subject = normalizeSubject(attempt.subjectName || "Unknown");
    if (!scoresBySubject[subject]) {
      scoresBySubject[subject] = [];
    }
    scoresBySubject[subject].push(Number(attempt.score) || 0);
  });

  return Object.entries(scoresBySubject).map(([subject, scores]) => ({
    subject,
    average: Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length),
  }));
};

export function buildRuleBasedRecommendations(attempts = []) {
  if (!attempts || attempts.length === 0) {
    return [
      {
        label: "Focus Topic",
        title: "Take your first mock exam",
        body: "Complete a timed mock to unlock your personalized study plan and weakest-area analysis.",
        tag: "Start now",
      },
      {
        label: "Suggested Resource",
        title: "Past questions review",
        body: "Practice 10 focused questions from your weakest subject to build momentum quickly.",
        tag: "10 min",
      },
    ];
  }

  const subjectAverages = getSubjectAverages(attempts);
  const weakestSubject = [...subjectAverages].sort((a, b) => a.average - b.average)[0];
  const strongestSubject = [...subjectAverages].sort((a, b) => b.average - a.average)[0];

  const weakTopics = SUBJECT_TOPIC_MAP[weakestSubject?.subject] || ["core concepts", "revision drills", "past questions"];
  const strongTopics = SUBJECT_TOPIC_MAP[strongestSubject?.subject] || ["revision", "confidence building", "timed practice"];

  return [
    {
      label: "Focus Topic",
      title: `${weakTopics[0]} (${weakestSubject?.subject || "Your weakest subject"})`,
      body: `${weakestSubject?.subject || "Your weakest subject"} is your current challenge area. Spend 15–20 minutes revising ${weakTopics[0].toLowerCase()} and then try two mixed questions.`,
      tag: "15 mins",
    },
    {
      label: "Suggested Resource",
      title: `${strongTopics[0]} practice (${strongestSubject?.subject || "Strong subject"})`,
      body: `Use your stronger subject as a confidence booster. Revisit ${strongTopics[0].toLowerCase()} with a timed practice set to protect your momentum.`,
      tag: "2 sets",
    },
  ];
}

export async function getStudyRecommendations(attempts = [], options = {}) {
  const endpoint = import.meta.env.VITE_AI_RECOMMENDATION_ENDPOINT
    || "https://us-central1-bece-prep.cloudfunctions.net/recommendations";
  const shouldUseRemote = Boolean(endpoint) && options.allowRemote !== false && Boolean(options.user?.uid);

  if (!shouldUseRemote) {
    return {
      recommendations: buildRuleBasedRecommendations(attempts),
      provider: "rules",
    };
  }

  const cacheKey = encodeURIComponent(JSON.stringify({
    uid: options.user.uid,
    attempts: attempts.slice(0, 20).map((attempt) => ({
      subjectName: attempt.subjectName || "Unknown",
      score: Number(attempt.score) || 0,
    })),
  }));
  const cachedResult = getCachedRecommendations(cacheKey);
  if (cachedResult) return cachedResult;

  try {
    const authHeader = options.user?.getIdToken
      ? { Authorization: `Bearer ${(await options.user.getIdToken())}` }
      : {};

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify({
        attempts: attempts.slice(0, 20).map((attempt) => ({
          subjectName: attempt.subjectName,
          score: Number(attempt.score) || 0,
          completedAt: attempt.completedAt,
        })),
        generatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Recommendation API returned ${response.status}`);
    }

    const data = await response.json();
    const recommendations = Array.isArray(data?.recommendations) ? data.recommendations : null;

    if (!recommendations || recommendations.length === 0) {
      return {
        recommendations: buildRuleBasedRecommendations(attempts),
        provider: "rules",
      };
    }

    const result = {
      recommendations,
      provider: data.provider || "unknown",
      model: data.model || null,
      fallbackReason: data.fallbackReason || null,
    };
    cacheRecommendations(cacheKey, result);
    return result;
  } catch (error) {
    console.warn("AI recommendation request failed. Falling back to local recommendation engine.", error);
    const result = {
      recommendations: buildRuleBasedRecommendations(attempts),
      provider: "rules",
      fallbackReason: "provider_error",
    };
    cacheRecommendations(cacheKey, result);
    return result;
  }
}
