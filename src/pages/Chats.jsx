import React, { useState } from "react";
import ChatList from "../components/ChatList.jsx";
import Avatar from "../components/Avatar.jsx";
import BottomSheet from "../components/BottomSheet.jsx";
import { LogoMark } from "../components/Icons.jsx";
import { SearchIcon, PlusIcon } from "../components/Icons.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function Chats({ onOpenChat, onOpenSearch }) {
  const { chats, contacts, startChatWithContact } = useApp();
  const [newChatOpen, setNewChatOpen] = useState(false);

  function beginChat(contactId) {
    const chatId = startChatWithContact(contactId);
    setNewChatOpen(false);
    onOpenChat(chatId);
  }

  return (
    <div className="screen">
      <div className="topbar glass">
        <span className="topbar-title">
          <LogoMark size={26} />
          FGRAM
        </span>
        <div className="topbar-actions">
          <button type="button" className="icon-btn" onClick={onOpenSearch} aria-label="Search"><SearchIcon size={19} /></button>
          <button type="button" className="icon-btn" onClick={() => setNewChatOpen(true)} aria-label="New chat"><PlusIcon size={20} /></button>
        </div>
      </div>

      <ChatList chats={chats} onOpenChat={onOpenChat} />

      {newChatOpen && (
        <BottomSheet title="New chat" onClose={() => setNewChatOpen(false)}>
          <div style={{ paddingBottom: 6 }}>
            {contacts.map((c) => (
              <button key={c.id} type="button" className="chat-item" style={{ width: "100%" }} onClick={() => beginChat(c.id)}>
                <Avatar name={c.name} online={c.online} showStatus />
                <div className="chat-item-body" style={{ textAlign: "left" }}>
                  <div className="chat-item-name">{c.name}</div>
                  <div className="chat-item-snippet">{c.username}</div>
                </div>
              </button>
            ))}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}
