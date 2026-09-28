import React from "react";

export default function BottomSheet({ title, onClose, children }) {
  return (
    <>
      <div className="overlay-scrim anim-scrim" onClick={onClose} />
      <div className="sheet-card glass-strong anim-sheet" role="dialog" aria-modal="true" aria-label={title || "Options"}>
        <div className="sheet-grabber" onClick={onClose} />
        {title && <p className="sheet-title">{title}</p>}
        {children}
      </div>
    </>
  );
}
