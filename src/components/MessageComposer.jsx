import React, { useRef, useState } from "react";
import { AttachIcon, EmojiIcon, MicIcon, SendIcon, CloseIcon, CameraIcon, ImageIcon, FileIcon, LocationIcon, PollIcon } from "./Icons.jsx";
import BottomSheet from "./BottomSheet.jsx";
import { EMOJI_SET } from "../services/demoData.js";
import { useApp } from "../context/AppContext.jsx";

const ATTACH_OPTIONS = [
  { key: "camera", label: "Camera", Icon: CameraIcon, color: "#ff6b6b" },
  { key: "image", label: "Photo", Icon: ImageIcon, color: "#7c6cff" },
  { key: "file", label: "File", Icon: FileIcon, color: "#34b1e4" },
  { key: "location", label: "Location", Icon: LocationIcon, color: "#34e4a0" },
  { key: "poll", label: "Poll", Icon: PollIcon, color: "#ffb648" }
];

export default function MessageComposer({ onSend, replyTo, onCancelReply }) {
  const { settings, showToast } = useApp();
  const [text, setText] = useState("");
  const [sheet, setSheet] = useState(null); // "attach" | "emoji" | "voice"
  const [recording, setRecording] = useState(false);
  const recordTimer = useRef(null);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const textareaRef = useRef(null);

  function submit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend({ text: trimmed });
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey && settings.enterToSend) {
      e.preventDefault();
      submit();
    }
  }

  function autoGrow(e) {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(110, e.target.scrollHeight)}px`;
  }

  function pickAttachment(key) {
    setSheet(null);
    if (key === "image") {
      onSend({ kind: "image" });
    } else if (key === "file") {
      onSend({ kind: "file", fileName: "Project-brief.pdf", fileSize: "842 KB" });
    } else if (key === "location") {
      onSend({ kind: "text", text: "📍 Shared location: 37.7749° N, 122.4194° W" });
    } else if (key === "poll") {
      onSend({ kind: "text", text: "📊 Poll: Which theme should we ship first — Dark or Light?" });
    } else {
      showToast("Camera isn't available in this demo");
    }
  }

  function startRecording() {
    setRecording(true);
    setRecordSeconds(0);
    recordTimer.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
  }

  function stopRecording(send) {
    clearInterval(recordTimer.current);
    if (send && recordSeconds > 0) {
      onSend({ kind: "voice", voiceSeconds: recordSeconds });
    }
    setRecording(false);
    setRecordSeconds(0);
  }

  return (
    <div className="composer-wrap">
      {replyTo && (
        <div className="reply-preview">
          <div className="reply-preview-body">
            <div className="reply-preview-label">Replying to {replyTo.senderName}</div>
            <div className="reply-preview-text">{replyTo.text || "Attachment"}</div>
          </div>
          <button type="button" className="icon-btn" onClick={onCancelReply} aria-label="Cancel reply">
            <CloseIcon size={16} />
          </button>
        </div>
      )}

      {recording ? (
        <div className="composer">
          <div className="composer-input-wrap" style={{ color: "var(--danger)", fontWeight: 700 }}>
            <span className="anim-pulse" style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--danger)" }} />
            Recording… {String(Math.floor(recordSeconds / 60)).padStart(2, "0")}:{String(recordSeconds % 60).padStart(2, "0")}
          </div>
          <button type="button" className="icon-btn danger" onClick={() => stopRecording(false)} aria-label="Cancel recording">
            <CloseIcon size={20} />
          </button>
          <button type="button" className="send-btn" onClick={() => stopRecording(true)} aria-label="Send voice message">
            <SendIcon size={18} />
          </button>
        </div>
      ) : (
        <div className="composer">
          <button type="button" className="icon-btn" onClick={() => setSheet("attach")} aria-label="Attach">
            <AttachIcon size={22} />
          </button>
          <div className="composer-input-wrap">
            <textarea
              ref={textareaRef}
              className="composer-input"
              rows={1}
              placeholder="Message"
              value={text}
              onChange={autoGrow}
              onKeyDown={handleKeyDown}
              aria-label="Message input"
            />
            <button type="button" className="icon-btn" onClick={() => setSheet("emoji")} aria-label="Emoji">
              <EmojiIcon size={21} />
            </button>
          </div>
          {text.trim() ? (
            <button type="button" className="send-btn" onClick={submit} aria-label="Send message">
              <SendIcon size={18} />
            </button>
          ) : (
            <button type="button" className="send-btn" onClick={startRecording} aria-label="Record voice message">
              <MicIcon size={19} />
            </button>
          )}
        </div>
      )}

      {sheet === "attach" && (
        <BottomSheet title="Share" onClose={() => setSheet(null)}>
          <div className="attach-grid">
            {ATTACH_OPTIONS.map(({ key, label, Icon, color }) => (
              <button key={key} type="button" className="attach-item" onClick={() => pickAttachment(key)}>
                <span className="attach-icon" style={{ background: color }}>
                  <Icon size={22} />
                </span>
                {label}
              </button>
            ))}
          </div>
        </BottomSheet>
      )}

      {sheet === "emoji" && (
        <BottomSheet title="Emoji" onClose={() => setSheet(null)}>
          <div className="emoji-grid">
            {EMOJI_SET.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setText((t) => t + emoji);
                  setSheet(null);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}
