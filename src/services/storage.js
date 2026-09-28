const PREFIX = "fgram:";

/**
 * Read a JSON value from localStorage.
 * Returns fallback if the key is missing or the stored value can't be parsed.
 */
export function loadData(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`FGRAM storage: failed to load "${key}"`, err);
    return fallback;
  }
}

/**
 * Write a JSON-serializable value to localStorage.
 */
export function saveData(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`FGRAM storage: failed to save "${key}"`, err);
    return false;
  }
}

export function removeData(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (err) {
    console.warn(`FGRAM storage: failed to remove "${key}"`, err);
  }
}

/** Clears every FGRAM-namespaced key (used by Settings > Storage > Clear demo data). */
export function clearAllData() {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith(PREFIX));
  keys.forEach((k) => localStorage.removeItem(k));
}

/** Rough estimate, in KB, of how much localStorage FGRAM is using. */
export function estimateStorageSize() {
  let total = 0;
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => {
      total += (localStorage.getItem(k) || "").length;
    });
  return Math.round((total / 1024) * 10) / 10;
}
