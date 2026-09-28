import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { loadData, saveData, clearAllData, estimateStorageSize } from "../services/storage.js";
import { DEMO_CONTACTS, DEMO_PROFILE, buildDemoChats, buildDemoCalls } from "../services/demoData.js";
import { uid } from "../utils/helpers.js";

const DEFAULT_SETTINGS = {
  theme: "system", // "system" | "light" | "dark"
  accent: "violet", // "violet" | "cyan" | "rose" | "amber"
  glassIntensity: "regular", // "subtle" | "regular" | "intense"
  messageAnimation: true,
  enterToSend: true,
  autoDownload: true,
  chatWallpaper: "default",
  notifMessages: true,
  notifSound: true,
  notifVibration: true,
  notifPreview: true,
  lastSeenVisible: true,
  profileVisibility: "everyone", // "everyone" | "contacts" | "nobody"
  readReceipts: true
};

const ACCENTS = {
  violet: ["#7c6cff", "#34e4ea"],
  cyan: ["#17bfc7", "#5be7d8"],
  rose: ["#ff5c9d", "#ff9a6c"],
  amber: ["#ffb648", "#ff6b6b"]
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...loadData("settings", {}) }));
  const [profile, setProfile] = useState(() => loadData("profile", DEMO_PROFILE));
  const [contacts, setContacts] = useState(() => loadData("contacts", DEMO_CONTACTS));
  const [chats, setChats] = useState(() => loadData("chats", buildDemoChats()));
  const [calls, setCalls] = useState(() => loadData("calls", buildDemoCalls()));
  const [toasts, setToasts] = useState([]);
  const [activeCall, setActiveCall] = useState(null);
  const [searchHistory, setSearchHistory] = useState(() => loadData("search_history", []));

  // Persist slices independently so a single change doesn't rewrite everything.
  useEffect(() => saveData("settings", settings), [settings]);
  useEffect(() => saveData("profile", profile), [profile]);
  useEffect(() => saveData("contacts", contacts), [contacts]);
  useEffect(() => saveData("chats", chats), [chats]);
  useEffect(() => saveData("calls", calls), [calls]);
  useEffect(() => saveData("search_history", searchHistory), [searchHistory]);

  // Resolve + apply theme and accent to the document root.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved = settings.theme === "system" ? (media.matches ? "dark" : "light") : settings.theme;
      document.documentElement.setAttribute("data-theme", resolved);
      document.documentElement.setAttribute("data-accent", settings.accent);
      const [a1, a2] = ACCENTS[settings.accent] || ACCENTS.violet;
      document.documentElement.style.setProperty("--accent-1", a1);
      document.documentElement.style.setProperty("--accent-2", a2);
      const intensity = { subtle: "12px", regular: "22px", intense: "34px" }[settings.glassIntensity] || "22px";
      document.documentElement.style.setProperty("--glass-blur", intensity);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [settings.theme, settings.accent, settings.glassIntensity]);

  const toastTimers = useRef({});
  const showToast = useCallback((message, tone = "default") => {
    const id = uid("toast");
    setToasts((prev) => [...prev, { id, message, tone }]);
    toastTimers.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete toastTimers.current[id];
    }, 2600);
  }, []);

  useEffect(() => {
    const timers = toastTimers.current;
    return () => Object.values(timers).forEach(clearTimeout);
  }, []);

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateProfile = useCallback((patch) => {
    setProfile((prev) => ({ ...prev, ...patch }));
    showToast("Profile updated");
  }, [showToast]);

  const contactsById = useMemo(() => {
    const map = {};
    contacts.forEach((c) => { map[c.id] = c; });
    return map;
  }, [contacts]);

  const chatsSorted = useMemo(() => {
    return [...chats].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      const aLast = a.messages[a.messages.length - 1]?.createdAt || 0;
      const bLast = b.messages[b.messages.length - 1]?.createdAt || 0;
      return bLast - aLast;
    });
  }, [chats]);

  const unreadTotal = useMemo(
    () => chats.reduce((sum, c) => sum + (c.unread || 0), 0),
    [chats]
  );

  const sendMessage = useCallback((chatId, payload) => {
    const message = {
      id: uid("msg"),
      senderId: "me",
      createdAt: Date.now(),
      status: "sent",
      ...payload
    };
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, message] } : c))
    );
    // Simulate delivery + read receipt for realism.
    setTimeout(() => {
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? { ...c, messages: c.messages.map((m) => (m.id === message.id ? { ...m, status: "delivered" } : m)) }
            : c
        )
      );
    }, 500);
    if (settings.readReceipts) {
      setTimeout(() => {
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId
              ? { ...c, messages: c.messages.map((m) => (m.id === message.id ? { ...m, status: "read" } : m)) }
              : c
          )
        );
      }, 1400);
    }
    return message.id;
  }, [settings.readReceipts]);

  const editMessage = useCallback((chatId, messageId, text) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? { ...c, messages: c.messages.map((m) => (m.id === messageId ? { ...m, text, edited: true } : m)) }
          : c
      )
    );
    showToast("Message edited");
  }, [showToast]);

  const deleteMessage = useCallback((chatId, messageId) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, messages: c.messages.filter((m) => m.id !== messageId) } : c))
    );
    showToast("Message deleted");
  }, [showToast]);

  const toggleReaction = useCallback((chatId, messageId, emoji) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          messages: c.messages.map((m) => {
            if (m.id !== messageId) return m;
            const reactions = { ...(m.reactions || {}) };
            reactions[emoji] = (reactions[emoji] || 0) + 1;
            return { ...m, reactions };
          })
        };
      })
    );
  }, []);

  const togglePinMessage = useCallback((chatId, messageId) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? { ...c, messages: c.messages.map((m) => (m.id === messageId ? { ...m, pinned: !m.pinned } : m)) }
          : c
      )
    );
    showToast("Message pinned");
  }, [showToast]);

  const togglePinChat = useCallback((chatId) => {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, pinned: !c.pinned } : c)));
  }, []);

  const toggleMuteChat = useCallback((chatId) => {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, muted: !c.muted } : c)));
    showToast("Notification setting updated");
  }, [showToast]);

  const deleteChat = useCallback((chatId) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    showToast("Chat deleted");
  }, [showToast]);

  const markChatRead = useCallback((chatId) => {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, unread: 0 } : c)));
  }, []);

  const startChatWithContact = useCallback((contactId) => {
    const existing = chats.find((c) => c.contactId === contactId);
    if (existing) return existing.id;
    const id = uid("chat");
    setChats((prev) => [...prev, { id, contactId, pinned: false, muted: false, messages: [] }]);
    return id;
  }, [chats]);

  const addContact = useCallback((contact) => {
    const id = uid("contact");
    setContacts((prev) => [...prev, { id, online: false, bio: "", ...contact }]);
    showToast("Contact added");
    return id;
  }, [showToast]);

  const placeCall = useCallback((contactId, type) => {
    const call = { id: uid("call"), contactId, type, direction: "outgoing", missed: false, at: Date.now(), duration: 0 };
    setActiveCall({ ...call, status: "ringing" });
  }, []);

  const endCall = useCallback((finalStatus = "ended") => {
    setActiveCall((current) => {
      if (!current) return null;
      const duration = current.connectedAt ? Math.round((Date.now() - current.connectedAt) / 1000) : 0;
      setCalls((prev) => [
        { id: current.id, contactId: current.contactId, type: current.type, direction: current.direction, missed: finalStatus === "missed" || (duration === 0 && current.direction === "incoming"), at: current.at, duration },
        ...prev
      ]);
      return null;
    });
  }, []);

  const clearDemoData = useCallback(() => {
    clearAllData();
    setSettings(DEFAULT_SETTINGS);
    setProfile(DEMO_PROFILE);
    setContacts(DEMO_CONTACTS);
    setChats(buildDemoChats());
    setCalls(buildDemoCalls());
    setSearchHistory([]);
    showToast("Demo data reset");
  }, [showToast]);

  const clearCache = useCallback(() => {
    showToast(`Cache cleared (${estimateStorageSize()} KB kept for your data)`);
  }, [showToast]);

  const addSearchHistory = useCallback((term) => {
    if (!term.trim()) return;
    setSearchHistory((prev) => [term, ...prev.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, 6));
  }, []);

  const clearSearchHistory = useCallback(() => setSearchHistory([]), []);

  const value = {
    settings, updateSettings,
    profile, updateProfile,
    contacts, contactsById, addContact,
    chats: chatsSorted, unreadTotal,
    sendMessage, editMessage, deleteMessage, toggleReaction, togglePinMessage,
    togglePinChat, toggleMuteChat, deleteChat, markChatRead, startChatWithContact,
    calls, placeCall, activeCall, setActiveCall, endCall,
    toasts, showToast,
    searchHistory, addSearchHistory, clearSearchHistory,
    clearDemoData, clearCache,
    accents: ACCENTS
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
