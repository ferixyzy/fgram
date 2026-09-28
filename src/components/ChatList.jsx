import React, { useRef, useState } from "react";
import ChatItem from "./ChatItem.jsx";
import { ChatsIcon } from "./Icons.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function ChatList({ chats, onOpenChat }) {
  const { contactsById, showToast } = useApp();
  const [pullHeight, setPullHeight] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const scrollRef = useRef(null);
  const pulling = useRef(false);

  function onTouchStart(e) {
    if (scrollRef.current && scrollRef.current.scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    }
  }

  function onTouchMove(e) {
    if (!pulling.current) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) setPullHeight(Math.min(70, dy * 0.5));
  }

  function onTouchEnd() {
    if (pullHeight > 46) {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
        showToast("Chats are up to date");
      }, 700);
    }
    setPullHeight(0);
    pulling.current = false;
  }

  if (chats.length === 0) {
    return (
      <div className="empty-state">
        <ChatsIcon size={40} />
        <h3>No chats yet</h3>
        <p>Start a conversation from Contacts to see it here.</p>
      </div>
    );
  }

  return (
    <div
      className="screen-scroll"
      ref={scrollRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="ptr-indicator" style={{ height: pullHeight || (refreshing ? 40 : 0) }}>
        {refreshing ? "Refreshing…" : pullHeight > 46 ? "Release to refresh" : pullHeight > 0 ? "Pull to refresh" : ""}
      </div>
      <div className="chat-list">
        {chats.map((chat) => (
          <ChatItem key={chat.id} chat={chat} contact={contactsById[chat.contactId]} onOpen={onOpenChat} />
        ))}
      </div>
    </div>
  );
}
