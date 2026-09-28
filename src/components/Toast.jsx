import React from "react";
import { useApp } from "../context/AppContext.jsx";

export default function ToastStack() {
  const { toasts } = useApp();
  if (toasts.length === 0) return null;
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast glass-strong anim-toast">
          {t.message}
        </div>
      ))}
    </div>
  );
}
