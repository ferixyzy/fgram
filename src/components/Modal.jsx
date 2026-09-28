import React, { useEffect } from "react";

export default function Modal({ title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", danger, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onConfirm, onCancel]);

  return (
    <>
      <div className="overlay-scrim anim-scrim" onClick={onCancel} />
      <div className="modal-card glass-strong anim-modal" role="alertdialog" aria-modal="true" aria-labelledby="modal-title">
        <p className="modal-title" id="modal-title">{title}</p>
        {description && <p className="modal-desc">{description}</p>}
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>{cancelLabel}</button>
          <button type="button" className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </>
  );
}
