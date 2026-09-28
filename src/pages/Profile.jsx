import React, { useState } from "react";
import BottomSheet from "../components/BottomSheet.jsx";
import { BackIcon, CheckIcon, EditIcon, CameraIcon, LockIcon, ChevronRight } from "../components/Icons.jsx";
import { useApp } from "../context/AppContext.jsx";

const AVATAR_SEEDS = ["You", "Nova", "Aster", "Quartz", "Ion", "Halo"];

export default function Profile({ onBack }) {
  const { profile, updateProfile, settings, updateSettings } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: profile.name, bio: profile.bio });
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState(profile.avatarSeed || profile.name);

  function save() {
    updateProfile({ name: form.name.trim() || profile.name, bio: form.bio, avatarSeed });
    setEditing(false);
  }

  return (
    <div className="screen">
      <div className="topbar glass">
        <button type="button" className="icon-btn" onClick={onBack} aria-label="Back"><BackIcon /></button>
        <span className="topbar-title">Profile</span>
        <div className="topbar-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => (editing ? save() : setEditing(true))}
            aria-label={editing ? "Save profile" : "Edit profile"}
          >
            {editing ? <CheckIcon size={19} /> : <EditIcon size={19} />}
          </button>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="profile-header">
          <div style={{ position: "relative" }}>
            <span
              className="avatar"
              style={{
                width: 92, height: 92, fontSize: 32,
                background: `linear-gradient(135deg, hsl(${hue(avatarSeed)}, 80%, 62%), hsl(${(hue(avatarSeed) + 55) % 360}, 80%, 55%))`
              }}
            >
              {(form.name || profile.name).slice(0, 2).toUpperCase()}
            </span>
            {editing && (
              <button
                type="button"
                className="icon-btn glass"
                style={{ position: "absolute", bottom: -2, right: -2, width: 34, height: 34, background: "var(--bg-elevated)" }}
                onClick={() => setAvatarOpen(true)}
                aria-label="Change avatar"
              >
                <CameraIcon size={16} />
              </button>
            )}
          </div>

          {editing ? (
            <input
              className="field-input"
              style={{ textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          ) : (
            <span className="profile-name">{profile.name}</span>
          )}
          <span className="profile-username">{profile.username}</span>
        </div>

        <div className="field-row">
          <div className="field-label">Bio</div>
          {editing ? (
            <textarea className="field-textarea" rows={2} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
          ) : (
            <p style={{ margin: "4px 0 0", fontSize: 14.5 }}>{profile.bio}</p>
          )}
        </div>

        <div className="field-row">
          <div className="field-label">Phone</div>
          <p style={{ margin: "4px 0 0", fontSize: 14.5 }}>{profile.phone}</p>
        </div>

        <div className="settings-group-title">Privacy settings</div>
        <div className="settings-group glass">
          <div className="settings-row" onClick={() => updateSettings({ lastSeenVisible: !settings.lastSeenVisible })}>
            <span className="settings-icon" style={{ background: "#6a57e8" }}><LockIcon size={15} /></span>
            <span className="settings-row-label">Last seen visibility</span>
            <span className="settings-row-value">{settings.lastSeenVisible ? "Everyone" : "Hidden"}</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </div>

      {avatarOpen && (
        <BottomSheet title="Choose avatar style" onClose={() => setAvatarOpen(false)}>
          <div className="attach-grid">
            {AVATAR_SEEDS.map((seed) => (
              <button key={seed} type="button" className="attach-item" onClick={() => { setAvatarSeed(seed); setAvatarOpen(false); }}>
                <span
                  className="attach-icon"
                  style={{ background: `linear-gradient(135deg, hsl(${hue(seed)}, 80%, 62%), hsl(${(hue(seed) + 55) % 360}, 80%, 55%))` }}
                />
                {seed}
              </button>
            ))}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

function hue(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h) % 360;
}
