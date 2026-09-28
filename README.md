# FGRAM

Messaging, redesigned for the web. A Telegram-inspired, fully original messenger UI built with React + Vite, styled with an iOS-style Liquid Glass aesthetic. Frontend-only, offline-first — all data lives in `localStorage`, no backend required.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`). On first load, FGRAM seeds demo chats, contacts, and messages automatically.

## Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this folder to a Git repo (or run `vercel` from inside it).
2. Import the repo in Vercel — framework preset **Vite** is auto-detected.
3. Build command: `npm run build`, output directory: `dist` (Vercel reads this from `vite.config.js` defaults automatically).
4. `vercel.json` already rewrites all routes to `index.html` so the app shell always loads and refresh/deep-link never 404s.

No environment variables are required.

## Architecture

- **State**: a single `AppProvider` (`src/context/AppContext.jsx`) holds chats, contacts, messages, calls, profile, settings, toasts and search history in React state, mirrored to `localStorage` on every change via `src/services/storage.js`.
- **Navigation**: no router library — `App.jsx` drives a small view-stack (`{ tab, chat, search, profile }`) synced to `window.history` via `pushState`/`popstate`, so the hardware/browser back button works and screen transitions animate directionally.
- **Screens**: `src/pages/` holds the four bottom-nav tabs (Chats, Contacts, Calls, Settings); `src/components/ChatScreen.jsx`, `Profile.jsx` and `SearchOverlay.jsx` are pushed on top as full-screen overlays.
- **Design system**: `src/styles/glass.css` defines the Liquid Glass tokens (surfaces, blur, borders, shadows) for light/dark/system themes plus 5 accent colors, all as CSS custom properties so Settings → Appearance can swap them live.
- **Icons**: hand-drawn SVG set in `src/components/Icons.jsx` — no emoji, no icon font, no external icon package.
- **PWA**: `public/manifest.json` + `public/service-worker.js` cache the app shell for offline start and make FGRAM installable.

## Functional features

- Chats list with pin, mute, swipe-to-reveal actions, unread badges, online dots, last-message preview
- Real message sending/receiving simulation, typing indicator, read receipts, date separators
- Reply, edit, delete, copy, forward, pin, and emoji-react on any message (long-press / context menu)
- Multi-select mode for bulk delete/forward
- Voice-note, image, file and link-preview message UI
- Attachment menu and emoji picker in the glass composer; auto-grows, Enter-to-send toggle
- Global search across chats, contacts and messages with history and highlighting
- Contacts: alphabetical grouping, add contact, start chat, call from contact
- Calls tab with a working simulated ringing → connected → ended call screen (voice + video), call log with duration
- Profile editing (name, username, bio, avatar) persisted to `localStorage`
- Settings that actually apply: theme (light/dark/system), accent color, glass intensity, enter-to-send, notification/sound/vibration toggles, chat wallpaper, clear-cache/clear-data
- Toasts, bottom sheets, modals, pull-to-refresh feel on the chat list, skeleton loading on first paint
