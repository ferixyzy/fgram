import { uid } from "../utils/helpers.js";

const now = Date.now();
const min = 60 * 1000;
const hr = 60 * min;
const day = 24 * hr;

export const DEMO_PROFILE = {
  name: "You",
  username: "@you",
  bio: "Building things on FGRAM ✦",
  phone: "+1 555 0100",
  online: true
};

export const DEMO_CONTACTS = [
  { id: "c_support", name: "FGRAM Support", username: "@fgram", online: true, bio: "Official FGRAM support account." },
  { id: "c_alex", name: "Alex Rivera", username: "@alexr", online: true, bio: "Product designer. Coffee first." },
  { id: "c_sarah", name: "Sarah Chen", username: "@sarahc", online: false, lastSeen: now - 3 * hr, bio: "Frontend engineer." },
  { id: "c_john", name: "John Okafor", username: "@johno", online: false, lastSeen: now - 26 * hr, bio: "Photographer." },
  { id: "c_design", name: "Design Team", username: "@designteam", online: true, isGroup: true, members: 6, bio: "Group for design reviews." },
  { id: "c_gaming", name: "Gaming Group", username: "@gamingsquad", online: true, isGroup: true, members: 14, bio: "Weekend raids and chaos." },
  { id: "c_family", name: "Family", username: "@family", online: true, isGroup: true, members: 5, bio: "Family chat." },
  { id: "c_mia", name: "Mia Torres", username: "@miat", online: true, bio: "Marketing lead." },
  { id: "c_dan", name: "Daniel Kim", username: "@dank", online: false, lastSeen: now - 5 * day, bio: "Backend engineer." }
];

function msg(senderId, text, offsetMs, extra = {}) {
  return {
    id: uid("msg"),
    senderId,
    text,
    createdAt: now - offsetMs,
    status: "read",
    ...extra
  };
}

export function buildDemoChats() {
  return [
    {
      id: "chat_support",
      contactId: "c_support",
      pinned: true,
      muted: false,
      messages: [
        msg("c_support", "Welcome to FGRAM! This is your support chat — ask us anything.", 2 * day),
        msg("me", "Thanks! Loving the glass UI so far.", 2 * day - 5 * min),
        msg("c_support", "Glad to hear it. Try long-pressing a message to see reply, edit, and reactions.", 2 * day - 4 * min)
      ]
    },
    {
      id: "chat_alex",
      contactId: "c_alex",
      pinned: true,
      muted: false,
      messages: [
        msg("c_alex", "Hey! Did you see the new mockups?", 3 * hr),
        msg("me", "Just opened them, the glass nav bar looks great", 2 * hr + 50 * min),
        msg("c_alex", "Right?? Let's ship it this week", 2 * hr + 40 * min, { reactions: { "🔥": 1 } }),
        msg("c_alex", "typing", 30 * 1000, { typingPlaceholder: true })
      ]
    },
    {
      id: "chat_sarah",
      contactId: "c_sarah",
      pinned: false,
      muted: false,
      unread: 2,
      messages: [
        msg("me", "Can you review my PR when you get a chance?", 26 * hr),
        msg("c_sarah", "On it, looks clean so far 👀", 25 * hr),
        msg("c_sarah", "Left two small comments", 24 * hr + 40 * min)
      ]
    },
    {
      id: "chat_john",
      contactId: "c_john",
      pinned: false,
      muted: true,
      messages: [
        msg("c_john", "Sent you the edited photos", 3 * day, { kind: "image" }),
        msg("me", "These are incredible, thank you!", 3 * day - 10 * min)
      ]
    },
    {
      id: "chat_design",
      contactId: "c_design",
      pinned: false,
      muted: false,
      messages: [
        msg("c_mia", "Design review moved to 3pm", 6 * hr),
        msg("c_alex", "Works for me", 5 * hr + 40 * min),
        msg("me", "Same here", 5 * hr + 35 * min)
      ]
    },
    {
      id: "chat_gaming",
      contactId: "c_gaming",
      pinned: false,
      muted: false,
      messages: [
        msg("c_dan", "raid at 9pm?", 40 * min),
        msg("c_mia", "in", 35 * min),
        msg("me", "in too", 33 * min)
      ]
    },
    {
      id: "chat_family",
      contactId: "c_family",
      pinned: false,
      muted: false,
      unread: 1,
      messages: [
        msg("c_john", "Sunday lunch at mine, 1pm", 8 * hr),
        msg("me", "We'll bring dessert 🍰", 7 * hr + 50 * min)
      ]
    },
    {
      id: "chat_mia",
      contactId: "c_mia",
      pinned: false,
      muted: false,
      messages: [msg("c_mia", "Campaign numbers look great this week", 30 * hr)]
    },
    {
      id: "chat_dan",
      contactId: "c_dan",
      pinned: false,
      muted: false,
      messages: [msg("c_dan", "Deploy went smoothly 🚀", 4 * day)]
    }
  ];
}

export function buildDemoCalls() {
  return [
    { id: uid("call"), contactId: "c_alex", type: "voice", direction: "outgoing", missed: false, at: now - 40 * min, duration: 184 },
    { id: uid("call"), contactId: "c_sarah", type: "video", direction: "incoming", missed: false, at: now - 5 * hr, duration: 612 },
    { id: uid("call"), contactId: "c_john", type: "voice", direction: "incoming", missed: true, at: now - 26 * hr, duration: 0 },
    { id: uid("call"), contactId: "c_mia", type: "voice", direction: "outgoing", missed: false, at: now - 2 * day, duration: 95 },
    { id: uid("call"), contactId: "c_dan", type: "video", direction: "outgoing", missed: true, at: now - 3 * day, duration: 0 }
  ];
}

export const EMOJI_SET = [
  "😀", "😂", "🥹", "😍", "😎", "🤔", "😴", "😭",
  "🙌", "👍", "👎", "🔥", "🎉", "❤️", "✨", "💯",
  "😅", "🥳", "🤝", "🙏", "😇", "🤯", "😤", "🫡"
];
