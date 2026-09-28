export function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Deterministic-ish gradient hue picked from a string, so avatars stay stable per user. */
export function hueFromString(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export function formatClockTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function formatListTime(timestamp) {
  const d = new Date(timestamp);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return formatClockTime(timestamp);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

  const withinWeek = now - d < 6 * 24 * 60 * 60 * 1000;
  if (withinWeek) return d.toLocaleDateString(undefined, { weekday: "short" });

  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatDateSeparator(timestamp) {
  const d = new Date(timestamp);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

export function formatDuration(totalSeconds = 0) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function truncate(text = "", max = 42) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export function highlightMatch(text, query) {
  if (!query) return [{ text, hit: false }];
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return [{ text, hit: false }];
  return [
    { text: text.slice(0, idx), hit: false },
    { text: text.slice(idx, idx + q.length), hit: true },
    { text: text.slice(idx + q.length), hit: false }
  ];
}

/** Deterministic pseudo-random waveform bars for the voice-message UI. */
export function waveform(seed = 10, count = 24) {
  let x = seed;
  const bars = [];
  for (let i = 0; i < count; i++) {
    x = (x * 9301 + 49297) % 233280;
    bars.push(4 + Math.round((x / 233280) * 14));
  }
  return bars;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
