import React from "react";
import { initials, hueFromString } from "../utils/helpers.js";

export default function Avatar({ name, size = 44, online, showStatus = false }) {
  const hue = hueFromString(name || "?");
  const style = {
    width: size,
    height: size,
    fontSize: Math.round(size * 0.38),
    background: `linear-gradient(135deg, hsl(${hue}, 80%, 62%), hsl(${(hue + 55) % 360}, 80%, 55%))`
  };
  return (
    <span className="avatar" style={style}>
      {initials(name)}
      {showStatus && online && <span className="status-dot" style={{ width: size * 0.27, height: size * 0.27 }} />}
    </span>
  );
}
