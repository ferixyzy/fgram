import React from "react";
import { CheckIcon, DoubleCheckIcon, ClockIcon, FileIcon, PinIcon } from "./Icons.jsx";
import { formatClockTime, formatDuration, waveform } from "../utils/helpers.js";

function StatusTick({ status }) {
  if (status === "sending") return <ClockIcon size={12} />;
  if (status === "sent") return <CheckIcon size={12} />;
  if (status === "delivered") return <DoubleCheckIcon size={12} />;
  if (status === "read") return <DoubleCheckIcon size={12} style={{ color: "#5be7ff" }} />;
  return null;
}

export default function MessageBubble({ message, isOwn, senderName, replyTo, selected, onLongPress, onTap }) {
  const bars = message.kind === "voice" ? waveform(message.id.length, 22) : [];

  let longPressTimer;
  function handleTouchStart(e) {
    const touch = e.touches[0];
    longPressTimer = setTimeout(() => onLongPress(touch.clientX, touch.clientY), 480);
  }
  function clearTimer() {
    clearTimeout(longPressTimer);
  }

  return (
    <div
      className={`bubble-row ${isOwn ? "out" : "in"}${selected ? " selected" : ""}`}
      onTouchStart={handleTouchStart}
      onTouchMove={clearTimer}
      onTouchEnd={clearTimer}
      onContextMenu={(e) => {
        e.preventDefault();
        onLongPress(e.clientX, e.clientY);
      }}
      onClick={onTap}
    >
      <div className="bubble anim-bubble">
        {replyTo && (
          <span className="bubble-reply">
            <strong style={{ display: "block", fontSize: 11.5 }}>{replyTo.senderName}</strong>
            {replyTo.text || "Attachment"}
          </span>
        )}

        {message.kind === "image" && (
          <div>
            <div className="bubble-image" style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))" }} />
          </div>
        )}

        {message.kind === "file" && (
          <div className="bubble-file">
            <span className="bubble-file-icon"><FileIcon size={18} /></span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{message.fileName || "document.pdf"}</div>
              <div style={{ fontSize: 11.5, opacity: 0.75 }}>{message.fileSize || "1.2 MB"}</div>
            </div>
          </div>
        )}

        {message.kind === "voice" && (
          <div className="bubble-voice">
            <div className="voice-wave" aria-hidden="true">
              {bars.map((h, i) => (
                <span key={i} style={{ height: h }} />
              ))}
            </div>
            <span style={{ fontSize: 11.5 }}>{formatDuration(message.voiceSeconds || 14)}</span>
          </div>
        )}

        {(!message.kind || message.kind === "text") && <span>{message.text}</span>}

        {message.linkPreview && (
          <div className="link-preview">
            <div className="link-preview-title">{message.linkPreview.title}</div>
            <div className="link-preview-desc">{message.linkPreview.desc}</div>
          </div>
        )}

        <div className="bubble-meta">
          {message.pinned && <PinIcon size={11} />}
          {message.edited && <span className="bubble-edited">edited</span>}
          <span>{formatClockTime(message.createdAt)}</span>
          {isOwn && <StatusTick status={message.status} />}
        </div>

        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="bubble-reactions">
            {Object.entries(message.reactions).map(([emoji, count]) => (
              <span key={emoji} className="reaction-chip">
                {emoji} {count > 1 ? count : ""}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
