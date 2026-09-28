import React, { useEffect, useMemo, useRef, useState } from "react";
import Avatar from "./Avatar.jsx";
import MessageBubble from "./MessageBubble.jsx";
import MessageComposer from "./MessageComposer.jsx";
import ContextMenu from "./ContextMenu.jsx";
import BottomSheet from "./BottomSheet.jsx";
import Modal from "./Modal.jsx";
import {
  BackIcon, PhoneIcon, VideoIcon, MoreIcon, ReplyIcon, EditIcon, CopyIcon,
  ForwardIcon, PinIcon, TrashIcon, ReactIcon, CloseIcon, CheckIcon
} from "./Icons.jsx";
import { formatDateSeparator } from "../utils/helpers.js";
import { EMOJI_SET } from "../services/demoData.js";
import { useApp } from "../context/AppContext.jsx";

export default function ChatScreen({ chatId, onBack, onCall }) {
  const { chats, contactsById, sendMessage, editMessage, deleteMessage, deleteChat, toggleReaction, togglePinMessage, showToast } = useApp();
  const chat = chats.find((c) => c.id === chatId);
  const contact = chat ? contactsById[chat.contactId] : null;

  const [menu, setMenu] = useState(null); // { x, y, message }
  const [selected, setSelected] = useState(new Set());
  const [replyTo, setReplyTo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [reactSheetFor, setReactSheetFor] = useState(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const scrollRef = useRef(null);

  const isTyping = chat?.messages.some((m) => m.typingPlaceholder);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat?.messages.length]);

  const groupedByDate = useMemo(() => {
    if (!chat) return [];
    const groups = [];
    let currentDay = null;
    chat.messages.filter((m) => !m.typingPlaceholder).forEach((m) => {
      const day = new Date(m.createdAt).toDateString();
      if (day !== currentDay) {
        groups.push({ type: "separator", date: m.createdAt, key: `sep-${day}` });
        currentDay = day;
      }
      groups.push({ type: "message", message: m, key: m.id });
    });
    return groups;
  }, [chat]);

  if (!chat || !contact) {
    return (
      <div className="screen">
        <div className="topbar glass">
          <button type="button" className="icon-btn" onClick={onBack} aria-label="Back"><BackIcon /></button>
          <span className="topbar-title">Chat unavailable</span>
        </div>
      </div>
    );
  }

  function messageSenderName(message) {
    return message.senderId === "me" ? "You" : contact.name;
  }

  function findMessage(id) {
    return chat.messages.find((m) => m.id === id);
  }

  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function exitSelection() {
    setSelected(new Set());
  }

  function copySelected() {
    const texts = chat.messages.filter((m) => selected.has(m.id)).map((m) => m.text || "").join("\n");
    if (navigator.clipboard) navigator.clipboard.writeText(texts).catch(() => {});
    showToast(`${selected.size} message${selected.size > 1 ? "s" : ""} copied`);
    exitSelection();
  }

  function deleteSelected() {
    selected.forEach((id) => deleteMessage(chat.id, id));
    exitSelection();
  }

  function handleSend(payload) {
    sendMessage(chat.id, {
      ...payload,
      replyToId: replyTo ? replyTo.id : undefined
    });
    setReplyTo(null);
  }

  function handleLongPress(message, x, y) {
    setMenu({ x, y, message });
  }

  const menuItems = menu
    ? [
        { label: "Reply", icon: <ReplyIcon size={17} />, onSelect: () => setReplyTo(menu.message) },
        ...(menu.message.senderId === "me"
          ? [{ label: "Edit", icon: <EditIcon size={17} />, onSelect: () => setEditingId(menu.message.id) }]
          : []),
        { label: "Copy", icon: <CopyIcon size={17} />, onSelect: () => { navigator.clipboard?.writeText(menu.message.text || ""); showToast("Copied to clipboard"); } },
        { label: "Forward", icon: <ForwardIcon size={17} />, onSelect: () => showToast("Forwarded (demo)") },
        { label: "React", icon: <ReactIcon size={17} />, onSelect: () => setReactSheetFor(menu.message.id) },
        { label: menu.message.pinned ? "Unpin" : "Pin", icon: <PinIcon size={17} />, onSelect: () => togglePinMessage(chat.id, menu.message.id) },
        { label: "Select", icon: <CheckIcon size={17} />, onSelect: () => toggleSelect(menu.message.id) },
        ...(menu.message.senderId === "me"
          ? [{ label: "Delete", icon: <TrashIcon size={17} />, danger: true, onSelect: () => setConfirmDelete(menu.message.id) }]
          : [])
      ]
    : [];

  const editingMessage = editingId ? findMessage(editingId) : null;

  return (
    <div className="screen">
      {selected.size > 0 ? (
        <div className="topbar glass">
          <button type="button" className="icon-btn" onClick={exitSelection} aria-label="Cancel selection"><CloseIcon /></button>
          <span className="topbar-title">{selected.size} selected</span>
          <div className="topbar-actions">
            <button type="button" className="icon-btn" onClick={copySelected} aria-label="Copy selected"><CopyIcon size={19} /></button>
            <button type="button" className="icon-btn danger" onClick={deleteSelected} aria-label="Delete selected"><TrashIcon size={19} /></button>
          </div>
        </div>
      ) : (
        <div className="topbar glass">
          <button type="button" className="icon-btn" onClick={onBack} aria-label="Back"><BackIcon /></button>
          <Avatar name={contact.name} size={36} online={contact.online} showStatus />
          <div className="chat-header-meta">
            <span className="chat-header-name">{contact.name}</span>
            <span className={`chat-header-status${isTyping ? " typing" : ""}`}>
              {isTyping ? "typing…" : contact.isGroup ? `${contact.members} members` : contact.online ? "online" : "last seen recently"}
            </span>
          </div>
          <div className="topbar-actions">
            <button type="button" className="icon-btn" onClick={() => onCall(contact.id, "voice")} aria-label="Voice call"><PhoneIcon size={19} /></button>
            <button type="button" className="icon-btn" onClick={() => onCall(contact.id, "video")} aria-label="Video call"><VideoIcon size={20} /></button>
            <button type="button" className="icon-btn" onClick={() => setMoreOpen(true)} aria-label="More options"><MoreIcon size={19} /></button>
          </div>
        </div>
      )}

      <div className="messages-scroll" ref={scrollRef}>
        {groupedByDate.map((item) =>
          item.type === "separator" ? (
            <div key={item.key} className="date-separator">{formatDateSeparator(item.date)}</div>
          ) : (
            <MessageBubble
              key={item.key}
              message={item.message}
              isOwn={item.message.senderId === "me"}
              senderName={messageSenderName(item.message)}
              replyTo={
                item.message.replyToId
                  ? (() => {
                      const original = findMessage(item.message.replyToId);
                      return original ? { text: original.text, senderName: messageSenderName(original) } : null;
                    })()
                  : null
              }
              selected={selected.has(item.message.id)}
              onLongPress={(x, y) => handleLongPress(item.message, x, y)}
              onTap={() => (selected.size > 0 ? toggleSelect(item.message.id) : undefined)}
            />
          )
        )}
        {isTyping && (
          <div className="bubble-row in">
            <div className="bubble anim-bubble">
              <span className="typing-indicator"><span /><span /><span /></span>
            </div>
          </div>
        )}
      </div>

      {editingMessage ? (
        <EditBar
          message={editingMessage}
          onCancel={() => setEditingId(null)}
          onSave={(text) => {
            editMessage(chat.id, editingMessage.id, text);
            setEditingId(null);
          }}
        />
      ) : (
        <MessageComposer onSend={handleSend} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />
      )}

      {menu && <ContextMenu x={menu.x} y={menu.y} items={menuItems} onClose={() => setMenu(null)} />}

      {reactSheetFor && (
        <BottomSheet title="React" onClose={() => setReactSheetFor(null)}>
          <div className="emoji-grid">
            {EMOJI_SET.slice(0, 16).map((emoji) => (
              <button key={emoji} type="button" onClick={() => { toggleReaction(chat.id, reactSheetFor, emoji); setReactSheetFor(null); }}>
                {emoji}
              </button>
            ))}
          </div>
        </BottomSheet>
      )}

      {moreOpen && (
        <BottomSheet title={contact.name} onClose={() => setMoreOpen(false)}>
          <div style={{ padding: "4px 4px 6px" }}>
            <button type="button" className="context-menu-item" onClick={() => { showToast("Search in chat (demo)"); setMoreOpen(false); }}>
              Search in chat
            </button>
            <button type="button" className="context-menu-item" onClick={() => { showToast("Wallpaper updated"); setMoreOpen(false); }}>
              Change wallpaper
            </button>
            <button type="button" className="context-menu-item danger" onClick={() => { setMoreOpen(false); setConfirmDelete("chat"); }}>
              Delete chat
            </button>
          </div>
        </BottomSheet>
      )}

      {confirmDelete && (
        <Modal
          title={confirmDelete === "chat" ? "Delete this chat?" : "Delete message?"}
          description="This action can't be undone."
          confirmLabel="Delete"
          danger
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => {
            if (confirmDelete === "chat") {
              deleteChat(chat.id);
              onBack();
            } else {
              deleteMessage(chat.id, confirmDelete);
            }
            setConfirmDelete(null);
          }}
        />
      )}
    </div>
  );
}

function EditBar({ message, onCancel, onSave }) {
  const [value, setValue] = useState(message.text || "");
  return (
    <div className="composer-wrap">
      <div className="reply-preview">
        <div className="reply-preview-body">
          <div className="reply-preview-label">Editing message</div>
        </div>
        <button type="button" className="icon-btn" onClick={onCancel} aria-label="Cancel edit"><CloseIcon size={16} /></button>
      </div>
      <div className="composer">
        <div className="composer-input-wrap">
          <textarea
            className="composer-input"
            rows={1}
            value={value}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button type="button" className="send-btn" onClick={() => value.trim() && onSave(value.trim())} aria-label="Save edit">
          <CheckIcon size={18} />
        </button>
      </div>
    </div>
  );
}
