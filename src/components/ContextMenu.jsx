import React, { useLayoutEffect, useRef, useState } from "react";

export default function ContextMenu({ x, y, onClose, items }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ left: x, top: y, visibility: "hidden" });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { innerWidth, innerHeight } = window;
    const rect = el.getBoundingClientRect();
    let left = x;
    let top = y;
    if (left + rect.width > innerWidth - 12) left = innerWidth - rect.width - 12;
    if (top + rect.height > innerHeight - 12) top = y - rect.height - 8;
    left = Math.max(12, left);
    top = Math.max(12, top);
    setPos({ left, top, visibility: "visible" });
  }, [x, y]);

  return (
    <>
      <div className="overlay-scrim anim-scrim" style={{ background: "transparent" }} onClick={onClose} />
      <div
        ref={ref}
        className="context-menu glass-strong anim-modal"
        style={{ position: "absolute", left: pos.left, top: pos.top, visibility: pos.visibility, transform: "none" }}
        role="menu"
      >
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            role="menuitem"
            className={`context-menu-item${item.danger ? " danger" : ""}`}
            onClick={() => {
              item.onSelect();
              onClose();
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
