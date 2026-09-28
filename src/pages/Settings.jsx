import React, { useState } from "react";
import Modal from "../components/Modal.jsx";
import {
  SunIcon, MoonIcon, DeviceIcon, BellIcon, LockIcon, StorageIcon, InfoIcon,
  ChevronRight, EmojiIcon, SendIcon, ImageIcon
} from "../components/Icons.jsx";
import { useApp } from "../context/AppContext.jsx";

function Switch({ on, onToggle, label }) {
  return (
    <button type="button" className={`switch${on ? " on" : ""}`} onClick={onToggle} role="switch" aria-checked={on} aria-label={label}>
      <span className="switch-knob" />
    </button>
  );
}

const ACCENT_KEYS = ["violet", "cyan", "rose", "amber"];

export default function Settings({ onOpenProfile }) {
  const { settings, updateSettings, clearCache, clearDemoData, accents, profile, showToast } = useApp();
  const [confirmClear, setConfirmClear] = useState(null); // "cache" | "reset"

  return (
    <div className="screen">
      <div className="topbar glass">
        <span className="topbar-title">Settings</span>
      </div>

      <div className="screen-scroll" style={{ paddingBottom: 24 }}>
        <button type="button" className="chat-item glass" style={{ width: "calc(100% - 28px)", margin: "10px 14px", borderRadius: 18 }} onClick={onOpenProfile}>
          <span
            className="avatar"
            style={{ width: 52, height: 52, fontSize: 19, background: `linear-gradient(135deg, ${accents[settings.accent][0]}, ${accents[settings.accent][1]})` }}
          >
            {profile.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="chat-item-body" style={{ textAlign: "left" }}>
            <div className="chat-item-name">{profile.name}</div>
            <div className="chat-item-snippet">{profile.username}</div>
          </div>
          <ChevronRight size={18} />
        </button>

        <div className="settings-group-title">Appearance</div>
        <div className="segmented">
          {[
            { key: "light", label: "Light", Icon: SunIcon },
            { key: "dark", label: "Dark", Icon: MoonIcon },
            { key: "system", label: "System", Icon: DeviceIcon }
          ].map(({ key, label, Icon }) => (
            <button key={key} type="button" className={settings.theme === key ? "active" : ""} onClick={() => updateSettings({ theme: key })}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <Icon size={14} />
                {label}
              </span>
            </button>
          ))}
        </div>

        <div className="accent-dot-row">
          {ACCENT_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={`accent-dot${settings.accent === key ? " active" : ""}`}
              style={{ background: `linear-gradient(135deg, ${accents[key][0]}, ${accents[key][1]})` }}
              onClick={() => updateSettings({ accent: key })}
              aria-label={`Accent ${key}`}
            />
          ))}
        </div>

        <div className="segmented">
          {["subtle", "regular", "intense"].map((level) => (
            <button key={level} type="button" className={settings.glassIntensity === level ? "active" : ""} onClick={() => updateSettings({ glassIntensity: level })}>
              {level[0].toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        <div className="settings-group-title">Chat settings</div>
        <div className="settings-group glass">
          <div className="settings-row">
            <span className="settings-icon" style={{ background: "#7c6cff" }}><ImageIcon size={16} /></span>
            <span className="settings-row-label">Message animations</span>
            <Switch on={settings.messageAnimation} onToggle={() => updateSettings({ messageAnimation: !settings.messageAnimation })} label="Message animations" />
          </div>
          <div className="settings-row">
            <span className="settings-icon" style={{ background: "#34b1e4" }}><SendIcon size={15} /></span>
            <span className="settings-row-label">Enter to send</span>
            <Switch on={settings.enterToSend} onToggle={() => updateSettings({ enterToSend: !settings.enterToSend })} label="Enter to send" />
          </div>
          <div className="settings-row">
            <span className="settings-icon" style={{ background: "#34e4a0" }}><ImageIcon size={16} /></span>
            <span className="settings-row-label">Auto-download media</span>
            <Switch on={settings.autoDownload} onToggle={() => updateSettings({ autoDownload: !settings.autoDownload })} label="Auto-download media" />
          </div>
          <div className="settings-row" onClick={() => showToast("Wallpaper picker (demo)")}>
            <span className="settings-icon" style={{ background: "#ffb648" }}><EmojiIcon size={16} /></span>
            <span className="settings-row-label">Chat wallpaper</span>
            <span className="settings-row-value">{settings.chatWallpaper}</span>
            <ChevronRight size={16} />
          </div>
        </div>

        <div className="settings-group-title">Notifications</div>
        <div className="settings-group glass">
          <div className="settings-row">
            <span className="settings-icon" style={{ background: "#ff6b6b" }}><BellIcon size={16} /></span>
            <span className="settings-row-label">Message notifications</span>
            <Switch on={settings.notifMessages} onToggle={() => updateSettings({ notifMessages: !settings.notifMessages })} label="Message notifications" />
          </div>
          <div className="settings-row">
            <span className="settings-row-label" style={{ paddingLeft: 42 }}>Sound</span>
            <Switch on={settings.notifSound} onToggle={() => updateSettings({ notifSound: !settings.notifSound })} label="Sound" />
          </div>
          <div className="settings-row">
            <span className="settings-row-label" style={{ paddingLeft: 42 }}>Vibration</span>
            <Switch on={settings.notifVibration} onToggle={() => updateSettings({ notifVibration: !settings.notifVibration })} label="Vibration" />
          </div>
          <div className="settings-row">
            <span className="settings-row-label" style={{ paddingLeft: 42 }}>Show message preview</span>
            <Switch on={settings.notifPreview} onToggle={() => updateSettings({ notifPreview: !settings.notifPreview })} label="Show message preview" />
          </div>
        </div>

        <div className="settings-group-title">Privacy</div>
        <div className="settings-group glass">
          <div className="settings-row">
            <span className="settings-icon" style={{ background: "#6a57e8" }}><LockIcon size={15} /></span>
            <span className="settings-row-label">Show last seen</span>
            <Switch on={settings.lastSeenVisible} onToggle={() => updateSettings({ lastSeenVisible: !settings.lastSeenVisible })} label="Show last seen" />
          </div>
          <div className="settings-row">
            <span className="settings-row-label" style={{ paddingLeft: 42 }}>Read receipts</span>
            <Switch on={settings.readReceipts} onToggle={() => updateSettings({ readReceipts: !settings.readReceipts })} label="Read receipts" />
          </div>
        </div>
        <div className="segmented">
          {["everyone", "contacts", "nobody"].map((v) => (
            <button key={v} type="button" className={settings.profileVisibility === v ? "active" : ""} onClick={() => updateSettings({ profileVisibility: v })}>
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <div className="settings-group-title">Storage</div>
        <div className="settings-group glass">
          <div className="settings-row" onClick={() => setConfirmClear("cache")}>
            <span className="settings-icon" style={{ background: "#17bfc7" }}><StorageIcon size={16} /></span>
            <span className="settings-row-label">Clear cache</span>
            <ChevronRight size={16} />
          </div>
          <div className="settings-row" onClick={() => setConfirmClear("reset")}>
            <span className="settings-icon" style={{ background: "#ff5c7a" }}><StorageIcon size={16} /></span>
            <span className="settings-row-label" style={{ color: "var(--danger)" }}>Clear local demo data</span>
            <ChevronRight size={16} />
          </div>
        </div>

        <div className="settings-group-title">About</div>
        <div className="settings-group glass">
          <div className="settings-row">
            <span className="settings-icon" style={{ background: "#8b93a7" }}><InfoIcon size={16} /></span>
            <span className="settings-row-label">FGRAM version</span>
            <span className="settings-row-value">1.0.0</span>
          </div>
          <div className="settings-row" onClick={() => showToast("FGRAM is an original open-source-style demo project")}>
            <span className="settings-row-label" style={{ paddingLeft: 42 }}>Open-source information</span>
            <ChevronRight size={16} />
          </div>
          <div className="settings-row" onClick={() => showToast("Terms placeholder — add your own before shipping")}>
            <span className="settings-row-label" style={{ paddingLeft: 42 }}>Terms of service</span>
            <ChevronRight size={16} />
          </div>
          <div className="settings-row" onClick={() => showToast("Privacy policy placeholder — add your own before shipping")}>
            <span className="settings-row-label" style={{ paddingLeft: 42 }}>Privacy policy</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </div>

      {confirmClear && (
        <Modal
          title={confirmClear === "cache" ? "Clear cache?" : "Clear all local data?"}
          description={
            confirmClear === "cache"
              ? "This frees up temporary storage without touching your chats."
              : "This resets FGRAM to its original demo state. Your chats, contacts, and settings will be lost."
          }
          confirmLabel={confirmClear === "cache" ? "Clear cache" : "Reset app"}
          danger={confirmClear === "reset"}
          onCancel={() => setConfirmClear(null)}
          onConfirm={() => {
            if (confirmClear === "cache") clearCache();
            else clearDemoData();
            setConfirmClear(null);
          }}
        />
      )}
    </div>
  );
}
