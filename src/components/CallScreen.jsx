import React, { useEffect, useState } from "react";
import Avatar from "./Avatar.jsx";
import { EndCallIcon, MuteMicIcon, MicIcon, SpeakerIcon, VideoIcon } from "./Icons.jsx";
import { formatDuration } from "../utils/helpers.js";
import { useApp } from "../context/AppContext.jsx";

export default function CallScreen() {
  const { activeCall, setActiveCall, endCall, contactsById } = useApp();
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);

  const contact = activeCall ? contactsById[activeCall.contactId] : null;

  useEffect(() => {
    if (!activeCall || activeCall.status !== "ringing") return;
    const t = setTimeout(() => {
      setActiveCall((c) => (c ? { ...c, status: "connected", connectedAt: Date.now() } : c));
    }, 1800);
    return () => clearTimeout(t);
  }, [activeCall?.status, setActiveCall]);

  useEffect(() => {
    if (!activeCall || activeCall.status !== "connected") return;
    const i = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(i);
  }, [activeCall?.status]);

  useEffect(() => {
    setElapsed(0);
    setMuted(false);
  }, [activeCall?.id]);

  if (!activeCall || !contact) return null;

  const isRinging = activeCall.status === "ringing";

  return (
    <div className="screen" style={{ position: "absolute", inset: 0, zIndex: 40, background: "linear-gradient(180deg, var(--bg-elevated), var(--bg))" }}>
      <div className="call-active-card">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginTop: 30 }}>
          <div className={isRinging ? "anim-pulse" : ""} style={{ borderRadius: "50%" }}>
            <Avatar name={contact.name} size={110} />
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22 }}>{contact.name}</div>
          <div style={{ color: "var(--text-muted)", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
            {activeCall.type === "video" && <VideoIcon size={15} />}
            {isRinging ? "Ringing…" : formatDuration(elapsed)}
          </div>
        </div>

        <div className="call-actions-row">
          <button
            type="button"
            className="call-action-btn glass"
            style={{ background: muted ? "var(--danger)" : undefined }}
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <MuteMicIcon size={22} /> : <MicIcon size={22} />}
          </button>
          <button type="button" className="call-action-btn" style={{ background: "var(--danger)" }} onClick={() => endCall(isRinging ? "missed" : "ended")} aria-label="End call">
            <EndCallIcon size={24} />
          </button>
          <button
            type="button"
            className="call-action-btn glass"
            style={{ background: speaker ? "var(--accent-grad)" : undefined }}
            onClick={() => setSpeaker((s) => !s)}
            aria-label="Toggle speaker"
          >
            <SpeakerIcon size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
