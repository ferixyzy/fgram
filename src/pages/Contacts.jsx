import React, { useMemo, useState } from "react";
import Avatar from "../components/Avatar.jsx";
import BottomSheet from "../components/BottomSheet.jsx";
import { SearchIcon, PlusIcon, PhoneIcon, VideoIcon, ContactsIcon, CloseIcon } from "../components/Icons.jsx";
import { useApp } from "../context/AppContext.jsx";

export default function Contacts({ onOpenChat, onCall }) {
  const { contacts, addContact, startChatWithContact, showToast } = useApp();
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", username: "" });

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = contacts.filter((c) => c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q));
    const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    const groups = {};
    sorted.forEach((c) => {
      const letter = c.name[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(c);
    });
    return groups;
  }, [contacts, query]);

  function submitAdd() {
    if (!form.name.trim()) {
      showToast("Enter a name to add a contact");
      return;
    }
    addContact({
      name: form.name.trim(),
      username: form.username.trim() ? `@${form.username.trim().replace(/^@/, "")}` : `@${form.name.trim().toLowerCase().replace(/\s+/g, "")}`
    });
    setForm({ name: "", username: "" });
    setAddOpen(false);
  }

  return (
    <div className="screen">
      <div className="topbar glass">
        <span className="topbar-title">Contacts</span>
        <div className="topbar-actions">
          <button type="button" className="icon-btn" onClick={() => setAddOpen(true)} aria-label="Add contact"><PlusIcon size={20} /></button>
        </div>
      </div>

      <div className="search-bar glass">
        <SearchIcon size={17} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search contacts" aria-label="Search contacts" />
      </div>

      <div className="screen-scroll">
        {Object.keys(grouped).length === 0 && (
          <div className="empty-state">
            <ContactsIcon size={36} />
            <h3>No contacts found</h3>
            <p>Try a different search or add a new contact.</p>
          </div>
        )}
        {Object.keys(grouped)
          .sort()
          .map((letter) => (
            <div key={letter}>
              <div className="section-label">{letter}</div>
              {grouped[letter].map((c) => (
                <button key={c.id} type="button" className="chat-item" style={{ width: "100%" }} onClick={() => setDetail(c)}>
                  <Avatar name={c.name} online={c.online} showStatus />
                  <div className="chat-item-body" style={{ textAlign: "left" }}>
                    <div className="chat-item-name">{c.name}</div>
                    <div className="chat-item-snippet">{c.isGroup ? `${c.members} members` : c.online ? "online" : c.username}</div>
                  </div>
                </button>
              ))}
            </div>
          ))}
      </div>

      {detail && (
        <BottomSheet onClose={() => setDetail(null)}>
          <div className="profile-header">
            <Avatar name={detail.name} size={76} online={detail.online} showStatus />
            <span className="profile-name">{detail.name}</span>
            <span className="profile-username">{detail.username}</span>
            {detail.bio && <p className="profile-bio">{detail.bio}</p>}
          </div>
          <div style={{ display: "flex", gap: 10, padding: "4px 16px 16px" }}>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => {
                const chatId = startChatWithContact(detail.id);
                setDetail(null);
                onOpenChat(chatId);
              }}
            >
              Message
            </button>
            <button type="button" className="icon-btn glass" style={{ width: 46, height: 46 }} onClick={() => onCall(detail.id, "voice")} aria-label="Voice call">
              <PhoneIcon size={19} />
            </button>
            <button type="button" className="icon-btn glass" style={{ width: 46, height: 46 }} onClick={() => onCall(detail.id, "video")} aria-label="Video call">
              <VideoIcon size={20} />
            </button>
          </div>
        </BottomSheet>
      )}

      {addOpen && (
        <BottomSheet title="Add contact" onClose={() => setAddOpen(false)}>
          <div className="field-row">
            <div className="field-label">Name</div>
            <input className="field-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" />
          </div>
          <div className="field-row">
            <div className="field-label">Username</div>
            <input className="field-input" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} placeholder="username" />
          </div>
          <div style={{ display: "flex", gap: 8, padding: "14px 4px 4px" }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAddOpen(false)}>
              <CloseIcon size={14} /> Cancel
            </button>
            <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={submitAdd}>
              Add contact
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}
