import React, { useRef, useState } from "react";
import Avatar from "./Avatar.jsx";
import ContextMenu from "./ContextMenu.jsx";
import { PinIcon, MuteIcon, TrashIcon, CheckIcon } from "./Icons.jsx";
import { formatListTime, truncate } from "../utils/helpers.js";
import { useApp } from "../context/AppContext.jsx";

const ACTION_WIDTH = 72;

export default function ChatItem({ chat, contact, onOpen }) {
  const { togglePinChat, toggleMuteChat, deleteChat, markChatRead } = useApp();
  const [offset, setOffset] = useState(0);
  const [menu, setMenu] = useState(null);
  const touch = useRef({ startX: 0, startY: 0, dragging: false, longPressTimer: null });

  const lastMessage = chat.messages[chat.messages.length - 1];
  const preview = lastMessage
    ? lastMessage.typingPlaceholder
      ? "typing…"
      : lastMessage.kind === "image"
      ? "📷 Photo"
      : lastMessage.kind === "file"
      ? `📎 ${lastMessage.fileName || "File"}`
      : lastMessage.kind === "voice"
      ? "🎤 Voice message"
      : `${lastMessage.senderId === "me" ? "You: " : ""}${lastMessage.text || ""}`
    : "No messages yet";

  function clearLongPress() {
    if (touch.current.longPressTimer) {
      clearTimeout(touch.current.longPressTimer);
      touch.current.longPressTimer = null;
    }
  }

  function onTouchStart(e) {
    const t = e.touches[0];
    touch.current.startX = t.clientX;
    touch.current.startY = t.clientY;
    touch.current.dragging = false;
    touch.current.baseOffset = offset;
    touch.current.longPressTimer = setTimeout(() => {
      setMenu({ x: t.clientX, y: t.clientY });
    }, 520);
  }

  function onTouchMove(e) {
    const t = e.touches[0];
    const dx = t.clientX - touch.current.startX;
    const dy = t.clientY - touch.current.startY;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) clearLongPress();
    if (Math.abs(dx) > Math.abs(dy)) {
      touch.current.dragging = true;
      const base = touch.current.baseOffset || 0;
      const next = Math.max(-ACTION_WIDTH * 3, Math.min(0, base + dx));
      setOffset(next);
    }
  }

  function onTouchEnd() {
    clearLongPress();
    if (touch.current.dragging) {
      setOffset((prev) => (prev < -ACTION_WIDTH * 1.5 ? -ACTION_WIDTH * 3 : 0));
    }
  }

  function handleOpen() {
    if (offset !== 0) {
      setOffset(0);
      return;
    }
    markChatRead(chat.id);
    onOpen(chat.id);
  }

  const contextItems = [
    { label: chat.pinned ? "Unpin" : "Pin", icon: <PinIcon size={17} />, onSelect: () => togglePinChat(chat.id) },
    { label: chat.muted ? "Unmute" : "Mute", icon: <MuteIcon size={17} />, onSelect: () => toggleMuteChat(chat.id) },
    { label: "Mark as read", icon: <CheckIcon size={17} />, onSelect: () => markChatRead(chat.id) },
    { label: "Delete chat", icon: <TrashIcon size={17} />, danger: true, onSelect: () => deleteChat(chat.id) }
  ];

  return (
    <div className="chat-swipe-wrap">
      <div className="chat-swipe-actions">
        <button type="button" className="swipe-action mute" onClick={() => { toggleMuteChat(chat.id); setOffset(0); }}>
          <MuteIcon size={18} />
          {chat.muted ? "Unmute" : "Mute"}
        </button>
        <button type="button" className="swipe-action pin" onClick={() => { togglePinChat(chat.id); setOffset(0); }}>
          <PinIcon size={18} />
          {chat.pinned ? "Unpin" : "Pin"}
        </button>
        <button type="button" className="swipe-action delete" onClick={() => { deleteChat(chat.id); setOffset(0); }}>
          <TrashIcon size={18} />
          Delete
        </button>
      </div>
      <div
        className="chat-swipe-content"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button type="button" className="chat-item" onClick={handleOpen} aria-label={`Open chat with ${contact?.name}`}>
          <Avatar name={contact?.name} online={contact?.online} showStatus />
          <div className="chat-item-body">
            <div className="chat-item-row">
              <span className="chat-item-name">
                {chat.pinned && <PinIcon size={12} />}
                {contact?.name}
              </span>
              <span className="chat-item-time">{lastMessage ? formatListTime(lastMessage.createdAt) : ""}</span>
            </div>
            <div className="chat-item-preview">
              <span className="chat-item-snippet">{truncate(preview, 40)}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {chat.muted && <MuteIcon size={14} />}
                {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
              </span>
            </div>
          </div>
        </button>
      </div>
      {menu && <ContextMenu x={menu.x} y={menu.y} items={contextItems} onClose={() => setMenu(null)} />}
    </div>
  );
}
