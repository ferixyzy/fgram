import React from "react";

function Base({ size = 22, children, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

const stroke = { stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" };

export const ChatsIcon = (p) => (
  <Base {...p}><path {...stroke} d="M4 12c0-4.4 3.8-8 8.5-8S21 7.6 21 12s-3.8 8-8.5 8c-1 0-2-.16-2.9-.46L5 21l1.3-3.9C4.86 15.8 4 14 4 12Z" /></Base>
);

export const ContactsIcon = (p) => (
  <Base {...p}>
    <circle cx="12" cy="8" r="3.4" {...stroke} />
    <path {...stroke} d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4" />
  </Base>
);

export const CallsIcon = (p) => (
  <Base {...p}><path {...stroke} d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 3.9c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8Z" /></Base>
);

export const SettingsIcon = (p) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="3" {...stroke} />
    <path {...stroke} d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V19.7a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H4.3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10.5a1.7 1.7 0 0 0 1-1.5V4.3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5c.6.3 1.4.2 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10.6c.3.6.9 1 1.5 1h.2a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1Z" />
  </Base>
);

export const SearchIcon = (p) => (
  <Base {...p}><circle cx="11" cy="11" r="6.5" {...stroke} /><path {...stroke} d="m20 20-3.6-3.6" /></Base>
);

export const BackIcon = (p) => (
  <Base {...p}><path {...stroke} d="M15 5 8 12l7 7" /></Base>
);

export const PhoneIcon = (p) => (
  <Base {...p}><path {...stroke} d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 3.9c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8Z" /></Base>
);

export const VideoIcon = (p) => (
  <Base {...p}><rect x="3" y="6.5" width="12" height="11" rx="2.4" {...stroke} /><path {...stroke} d="m20.2 8.3-4.2 3 4.2 3V8.3Z" /></Base>
);

export const MoreIcon = (p) => (
  <Base {...p}><circle cx="12" cy="6" r="1.4" fill="currentColor" /><circle cx="12" cy="12" r="1.4" fill="currentColor" /><circle cx="12" cy="18" r="1.4" fill="currentColor" /></Base>
);

export const SendIcon = (p) => (
  <Base {...p}><path {...stroke} d="M4.5 12 20 4.5l-4.3 15.4-4.6-6-6.6-1.9Z" /><path {...stroke} d="M11 13.9 20 4.5" /></Base>
);

export const MicIcon = (p) => (
  <Base {...p}><rect x="9" y="3.2" width="6" height="10.5" rx="3" {...stroke} /><path {...stroke} d="M6 12a6 6 0 0 0 12 0M12 18v3" /></Base>
);

export const AttachIcon = (p) => (
  <Base {...p}><path {...stroke} d="M16.6 8.4 9.4 15.6a2.6 2.6 0 1 1-3.7-3.7l7.6-7.6a4 4 0 1 1 5.7 5.7L11.4 17.6a5.3 5.3 0 1 1-7.5-7.5L11.6 2.4" /></Base>
);

export const EmojiIcon = (p) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" {...stroke} />
    <circle cx="9" cy="10.5" r="1" fill="currentColor" />
    <circle cx="15" cy="10.5" r="1" fill="currentColor" />
    <path {...stroke} d="M8.3 14.5c.8 1.4 2 2.1 3.7 2.1s2.9-.7 3.7-2.1" />
  </Base>
);

export const CheckIcon = (p) => (
  <Base {...p}><path {...stroke} d="m5 12.5 4.5 4.5L19 7" /></Base>
);

export const DoubleCheckIcon = (p) => (
  <Base {...p}><path {...stroke} d="m2.5 12.5 4 4L15 7.2" /><path {...stroke} d="m9.5 12.5 4 4L21.5 7.2" /></Base>
);

export const ClockIcon = (p) => (
  <Base {...p}><circle cx="12" cy="12" r="8.5" {...stroke} /><path {...stroke} d="M12 7.5V12l3 2" /></Base>
);

export const PinIcon = (p) => (
  <Base {...p}><path {...stroke} d="M9 4h6l-.7 6.4L18 14v1.5H6V14l3.7-3.6L9 4Z" /><path {...stroke} d="M12 15.5V21" /></Base>
);

export const MuteIcon = (p) => (
  <Base {...p}><path {...stroke} d="M5 9v6h4l5 4V5L9 9H5Z" /><path {...stroke} d="m16 9 4.5 6M20.5 9 16 15" /></Base>
);

export const TrashIcon = (p) => (
  <Base {...p}><path {...stroke} d="M5 7h14M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M7 7l1 13a1 1 0 0 0 1 .9h6a1 1 0 0 0 1-.9l1-13" /></Base>
);

export const EditIcon = (p) => (
  <Base {...p}><path {...stroke} d="M4 20h3.6L18.5 9a2.1 2.1 0 0 0-3-3L4.6 16.4V20Z" /><path {...stroke} d="m14.5 7 3 3" /></Base>
);

export const ReplyIcon = (p) => (
  <Base {...p}><path {...stroke} d="M11 6 4.5 12 11 18" /><path {...stroke} d="M4.5 12h9c3 0 5.5 2.2 5.5 5.5V19" /></Base>
);

export const ForwardIcon = (p) => (
  <Base {...p}><path {...stroke} d="M13 6 19.5 12 13 18" /><path {...stroke} d="M19.5 12h-9C7.5 12 5 14.2 5 17.5V19" /></Base>
);

export const CopyIcon = (p) => (
  <Base {...p}><rect x="8.5" y="8.5" width="11" height="11" rx="2.2" {...stroke} /><path {...stroke} d="M15.5 8.5V6.2a2.2 2.2 0 0 0-2.2-2.2H6.2A2.2 2.2 0 0 0 4 6.2v7.1a2.2 2.2 0 0 0 2.2 2.2H8.5" /></Base>
);

export const ReactIcon = (p) => (
  <Base {...p}><circle cx="12" cy="12" r="8.5" {...stroke} /><circle cx="9" cy="10" r="1" fill="currentColor" /><circle cx="15" cy="10" r="1" fill="currentColor" /><path {...stroke} d="M8.3 14c.9 1.3 2.1 2 3.7 2s2.8-.7 3.7-2" /></Base>
);

export const CameraIcon = (p) => (
  <Base {...p}><path {...stroke} d="M4 8.5A1.8 1.8 0 0 1 5.8 6.7h1.9L9 4.6h6l1.3 2.1h1.9A1.8 1.8 0 0 1 20 8.5v9.2A1.8 1.8 0 0 1 18.2 19.5H5.8A1.8 1.8 0 0 1 4 17.7V8.5Z" /><circle cx="12" cy="13" r="3.3" {...stroke} /></Base>
);

export const ImageIcon = (p) => (
  <Base {...p}><rect x="3.5" y="4.5" width="17" height="15" rx="2.4" {...stroke} /><circle cx="9" cy="10" r="1.6" {...stroke} /><path {...stroke} d="m5 18 5.2-5.4a1.6 1.6 0 0 1 2.3 0L19 18" /></Base>
);

export const FileIcon = (p) => (
  <Base {...p}><path {...stroke} d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7 3.5Z" /><path {...stroke} d="M14 3.5V7a1 1 0 0 0 1 1h3" /></Base>
);

export const LocationIcon = (p) => (
  <Base {...p}><path {...stroke} d="M12 21s7-6.4 7-11.6A7 7 0 0 0 5 9.4C5 14.6 12 21 12 21Z" /><circle cx="12" cy="9.4" r="2.4" {...stroke} /></Base>
);

export const PollIcon = (p) => (
  <Base {...p}><rect x="4" y="4" width="16" height="16" rx="3" {...stroke} /><path {...stroke} d="M8 15v-3M12 15V9M16 15v-5" /></Base>
);

export const PlusIcon = (p) => (
  <Base {...p}><path {...stroke} d="M12 5v14M5 12h14" /></Base>
);

export const CloseIcon = (p) => (
  <Base {...p}><path {...stroke} d="m6 6 12 12M18 6 6 18" /></Base>
);

export const EndCallIcon = (p) => (
  <Base {...p}><path {...stroke} d="M2.5 13.5c5.6-5 13.4-5 19 0l-.4 3a1.4 1.4 0 0 1-1.9 1.1l-3-1a1.4 1.4 0 0 1-.9-1.5l.2-1.3c-1.6-.6-4.4-.6-6 0l.2 1.3a1.4 1.4 0 0 1-.9 1.5l-3 1a1.4 1.4 0 0 1-1.9-1.1l-.4-3Z" /></Base>
);

export const MuteMicIcon = (p) => (
  <Base {...p}><rect x="9" y="3.2" width="6" height="10.5" rx="3" {...stroke} /><path {...stroke} d="M6 12a6 6 0 0 0 10.6 3.8M12 18v3M4 4l16 16" /></Base>
);

export const SpeakerIcon = (p) => (
  <Base {...p}><path {...stroke} d="M5 9v6h4l5 4V5L9 9H5Z" /><path {...stroke} d="M16.5 9.5a3.5 3.5 0 0 1 0 5" /></Base>
);

export const SunIcon = (p) => (
  <Base {...p}><circle cx="12" cy="12" r="4.2" {...stroke} /><path {...stroke} d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></Base>
);

export const MoonIcon = (p) => (
  <Base {...p}><path {...stroke} d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" /></Base>
);

export const DeviceIcon = (p) => (
  <Base {...p}><rect x="3.5" y="5" width="17" height="11" rx="2" {...stroke} /><path {...stroke} d="M9 20h6M12 16v4" /></Base>
);

export const ChevronRight = (p) => (
  <Base {...p}><path {...stroke} d="m9 5 7 7-7 7" /></Base>
);

export const LockIcon = (p) => (
  <Base {...p}><rect x="5" y="10.5" width="14" height="9" rx="2.2" {...stroke} /><path {...stroke} d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></Base>
);

export const BellIcon = (p) => (
  <Base {...p}><path {...stroke} d="M6 10.5a6 6 0 1 1 12 0c0 4 1.3 5.2 1.3 5.2H4.7S6 14.5 6 10.5Z" /><path {...stroke} d="M9.5 18.5a2.5 2.5 0 0 0 5 0" /></Base>
);

export const StorageIcon = (p) => (
  <Base {...p}><ellipse cx="12" cy="6" rx="7.5" ry="2.6" {...stroke} /><path {...stroke} d="M4.5 6v6c0 1.4 3.4 2.6 7.5 2.6s7.5-1.2 7.5-2.6V6M4.5 12v6c0 1.4 3.4 2.6 7.5 2.6s7.5-1.2 7.5-2.6v-6" /></Base>
);

export const InfoIcon = (p) => (
  <Base {...p}><circle cx="12" cy="12" r="8.5" {...stroke} /><path {...stroke} d="M12 11v5.5M12 8v.1" /></Base>
);

export const LogoMark = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="fgramGradInline" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--accent-1)" />
        <stop offset="100%" stopColor="var(--accent-2)" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="24" fill="url(#fgramGradInline)" />
    <path d="M28 34c0-4.4 3.6-8 8-8h28c4.4 0 8 3.6 8 8v22c0 4.4-3.6 8-8 8H46l-11 9v-9h-1c-4.4 0-8-3.6-8-8V34z" fill="var(--bg)" fillOpacity="0.92" />
    <circle cx="40" cy="45" r="3.2" fill="#EAF0FF" />
    <circle cx="50" cy="45" r="3.2" fill="#EAF0FF" />
    <circle cx="60" cy="45" r="3.2" fill="#EAF0FF" />
  </svg>
);
