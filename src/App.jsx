import React, { useEffect, useState } from "react";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import BottomNav from "./components/BottomNav.jsx";
import ToastStack from "./components/Toast.jsx";
import CallScreen from "./components/CallScreen.jsx";
import ChatScreen from "./components/ChatScreen.jsx";
import SearchOverlay from "./components/SearchOverlay.jsx";
import Chats from "./pages/Chats.jsx";
import Contacts from "./pages/Contacts.jsx";
import Calls from "./pages/Calls.jsx";
import Settings from "./pages/Settings.jsx";
import Profile from "./pages/Profile.jsx";

const INITIAL_VIEW = { tab: "chats", chat: null, search: false, profile: false };

function Shell() {
  const { placeCall } = useApp();
  const [view, setView] = useState(INITIAL_VIEW);
  const [direction, setDirection] = useState("forward");

  useEffect(() => {
    window.history.replaceState(INITIAL_VIEW, "");
    const onPop = (e) => {
      setDirection("back");
      setView(e.state || INITIAL_VIEW);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function push(next) {
    setDirection("forward");
    const merged = { ...view, ...next };
    setView(merged);
    window.history.pushState(merged, "");
  }

  function replaceTab(tab) {
    setDirection("forward");
    const merged = { tab, chat: null, search: false, profile: false };
    setView(merged);
    window.history.replaceState(merged, "");
  }

  function back() {
    window.history.back();
  }

  function openChat(chatId) {
    if (chatId) push({ chat: chatId, search: false });
  }

  function openSearchResult(contactId, chatIdDirect) {
    if (chatIdDirect) {
      push({ chat: chatIdDirect, search: false });
      return;
    }
    // resolved via startChatWithContact inside SearchOverlay's caller
    push({ chat: contactId, search: false });
  }

  function handleCall(contactId, type) {
    placeCall(contactId, type);
  }

  const isDeepScreen = view.chat || view.search || view.profile;

  return (
    <div className="app-shell">
      <div key={`${view.tab}-${view.chat || ""}-${view.search}-${view.profile}`} className={direction === "forward" ? "screen-enter-forward" : "screen-enter-back"} style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", position: "relative" }}>
        {view.chat ? (
          <ChatScreen chatId={view.chat} onBack={back} onCall={handleCall} />
        ) : view.profile ? (
          <Profile onBack={back} />
        ) : (
          <>
            {view.tab === "chats" && <Chats onOpenChat={openChat} onOpenSearch={() => push({ search: true })} />}
            {view.tab === "contacts" && <Contacts onOpenChat={openChat} onCall={handleCall} />}
            {view.tab === "calls" && <Calls onCall={handleCall} />}
            {view.tab === "settings" && <Settings onOpenProfile={() => push({ profile: true })} />}
          </>
        )}

        {view.search && (
          <SearchOverlayWrapper onClose={back} onOpenChat={openSearchResult} />
        )}
      </div>

      {!isDeepScreen && <BottomNav active={view.tab} onChange={replaceTab} />}

      <CallScreen />
      <ToastStack />
    </div>
  );
}

/** Resolves a contact id into a chat id (creating the chat if needed) before opening it. */
function SearchOverlayWrapper({ onClose, onOpenChat }) {
  const { startChatWithContact } = useApp();
  return (
    <SearchOverlay
      onClose={onClose}
      onOpenChat={(contactId, chatIdDirect) => {
        if (chatIdDirect) {
          onOpenChat(null, chatIdDirect);
        } else {
          const chatId = startChatWithContact(contactId);
          onOpenChat(null, chatId);
        }
      }}
    />
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
