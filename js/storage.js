const KEY = 'maria-quatro-meses-v2';
const STORAGE_VERSION = 2;
const EMPTY_STATE = { completed: [], seenPhotos: [], playedAudio: [], lastChapterViewed: null };

function normalizeState(saved) {
  const completed = Array.isArray(saved?.completed)
    ? saved.completed.filter((value) => Number.isInteger(value)).sort((a, b) => a - b)
    : [];
  const seenPhotos = Array.isArray(saved?.seenPhotos)
    ? saved.seenPhotos.filter((value) => typeof value === 'string' && value)
    : [];
  const playedAudio = Array.isArray(saved?.playedAudio)
    ? saved.playedAudio.filter((value) => typeof value === 'string' && value)
    : [];
  const lastChapterViewed = Number.isInteger(saved?.lastChapterViewed)
    ? saved.lastChapterViewed
    : null;

  return { completed, seenPhotos, playedAudio, lastChapterViewed };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY_STATE };

    const parsed = JSON.parse(raw);
    const payload = parsed?.state ?? parsed;
    return normalizeState(payload);
  } catch {
    return { ...EMPTY_STATE };
  }
}

export function saveState(state) {
  const normalized = normalizeState(state);
  localStorage.setItem(KEY, JSON.stringify({ version: STORAGE_VERSION, state: normalized }));
}
