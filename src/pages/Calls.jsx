import React, { useState } from "react";
import Avatar from "../components/Avatar.jsx";
import BottomSheet from "../components/BottomSheet.jsx";
import { PhoneIcon, VideoIcon, PlusIcon, CallsIcon } from "../components/Icons.jsx";
import { formatListTime, formatDuration } from "../utils/helpers.js";
import { useApp } from "../context/AppContext.jsx";

function DirectionGlyph({ direction, missed }) {
  const rotate = direction === "outgoing" ? "rotate(-45deg)" : "rotate(135deg)";
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transform: rotate }} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke={missed ? "var(--danger)" : "currentColor"} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Calls({ onCall }) {
  const { calls, contactsById, contacts } = useApp();
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="screen">
      <div className="topbar glass">
        <span className="topbar-title">Calls</span>
        <div className="topbar-actions">
          <button type="button" className="icon-btn" onClick={() => setPickerOpen(true)} aria-label="New call"><PlusIcon size={20} /></button>
        </div>
      </div>

      <div className="screen-scroll">
        {calls.length === 0 && (
          <div className="empty-state">
            <CallsIcon size={36} />
            <h3>No calls yet</h3>
            <p>Your voice and video calls will show up here.</p>
          </div>
        )}
        {calls.map((call) => {
          const contact = contactsById[call.contactId];
          if (!contact) return null;
          return (
            <div key={call.id} className="call-item">
              <Avatar name={contact.name} online={contact.online} showStatus />
              <div className="call-meta">
                <div className="call-name">{contact.name}</div>
                <div className={`call-sub${call.missed ? " missed" : ""}`}>
                  <DirectionGlyph direction={call.direction} missed={call.missed} />
                  {call.missed ? "Missed" : call.direction === "outgoing" ? "Outgoing" : "Incoming"}
                  {!call.missed && call.duration > 0 && ` · ${formatDuration(call.duration)}`}
                  {" · "}
                  {formatListTime(call.at)}
                </div>
              </div>
              <button type="button" className="icon-btn" onClick={() => onCall(contact.id, call.type)} aria-label={`Call ${contact.name}`}>
                {call.type === "video" ? <VideoIcon size={20} /> : <PhoneIcon size={19} />}
              </button>
            </div>
          );
        })}
      </div>

      {pickerOpen && (
        <BottomSheet title="Start a call" onClose={() => setPickerOpen(false)}>
          <div style={{ paddingBottom: 6 }}>
            {contacts.map((c) => (
              <div key={c.id} className="chat-item" style={{ width: "100%" }}>
                <Avatar name={c.name} online={c.online} showStatus />
                <div className="chat-item-body" style={{ textAlign: "left" }}>
                  <div className="chat-item-name">{c.name}</div>
                  <div className="chat-item-snippet">{c.username}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button type="button" className="icon-btn" onClick={() => { setPickerOpen(false); onCall(c.id, "voice"); }} aria-label={`Voice call ${c.name}`}>
                    <PhoneIcon size={18} />
                  </button>
                  <button type="button" className="icon-btn" onClick={() => { setPickerOpen(false); onCall(c.id, "video"); }} aria-label={`Video call ${c.name}`}>
                    <VideoIcon size={19} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}
