import React from "react";
import { ChatsIcon, ContactsIcon, CallsIcon, SettingsIcon } from "./Icons.jsx";
import { useApp } from "../context/AppContext.jsx";

const TABS = [
  { key: "chats", label: "Chats", Icon: ChatsIcon },
  { key: "contacts", label: "Contacts", Icon: ContactsIcon },
  { key: "calls", label: "Calls", Icon: CallsIcon },
  { key: "settings", label: "Settings", Icon: SettingsIcon }
];

export default function BottomNav({ active, onChange }) {
  const { unreadTotal } = useApp();
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {TABS.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            className={`nav-item${isActive ? " active" : ""}`}
            onClick={() => onChange(key)}
            aria-current={isActive ? "page" : undefined}
            aria-label={label}
          >
            <Icon size={23} />
            <span className="nav-label">{label}</span>
            {key === "chats" && unreadTotal > 0 && <span className="nav-dot" />}
            {isActive && <span className="nav-indicator" />}
          </button>
        );
      })}
    </nav>
  );
}
