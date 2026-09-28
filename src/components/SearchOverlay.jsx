import React, { useMemo, useRef, useState } from "react";
import Avatar from "./Avatar.jsx";
import { SearchIcon, CloseIcon, BackIcon } from "./Icons.jsx";
import { highlightMatch, truncate } from "../utils/helpers.js";
import { useApp } from "../context/AppContext.jsx";

function Highlighted({ text, query }) {
  const parts = highlightMatch(text, query);
  return (
    <>
      {parts.map((p, i) => (p.hit ? <span key={i} className="highlight">{p.text}</span> : <span key={i}>{p.text}</span>))}
    </>
  );
}

export default function SearchOverlay({ onClose, onOpenChat }) {
  const { chats, contacts, searchHistory, addSearchHistory, clearSearchHistory } = useApp();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const contactMatches = contacts.filter((c) => c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q));

    const chatMatches = chats.filter((c) => {
      const contact = contacts.find((ct) => ct.id === c.contactId);
      return contact && contact.name.toLowerCase().includes(q);
    });

    const messageMatches = [];
    chats.forEach((chat) => {
      const contact = contacts.find((ct) => ct.id === chat.contactId);
      chat.messages.forEach((m) => {
        if (m.text && m.text.toLowerCase().includes(q)) {
          messageMatches.push({ chatId: chat.id, contactName: contact?.name || "Unknown", message: m });
        }
      });
    });

    return { contactMatches, chatMatches, messageMatches };
  }, [query, chats, contacts]);

  function commitSearch() {
    if (query.trim()) addSearchHistory(query.trim());
  }

  const hasResults = results && (results.contactMatches.length || results.chatMatches.length || results.messageMatches.length);

  return (
    <div className="screen" style={{ position: "absolute", inset: 0, background: "var(--bg)", zIndex: 15 }}>
      <div className="topbar glass">
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search"><BackIcon /></button>
        <div className="search-bar glass" style={{ flex: 1, margin: 0 }}>
          <SearchIcon size={18} />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            placeholder="Search chats, contacts, messages"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commitSearch()}
            aria-label="Search"
          />
          {query && (
            <button type="button" className="icon-btn" onClick={() => setQuery("")} aria-label="Clear search">
              <CloseIcon size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="screen-scroll">
        {!query && (
          <div style={{ padding: "6px 10px" }}>
            {searchHistory.length > 0 && (
              <>
                <div className="chat-item-row" style={{ padding: "10px 6px 0" }}>
                  <span className="section-label" style={{ padding: 0 }}>Recent</span>
                  <button type="button" className="icon-btn" onClick={clearSearchHistory} aria-label="Clear search history" style={{ width: 30, height: 30 }}>
                    <CloseIcon size={14} />
                  </button>
                </div>
                <div style={{ padding: "6px 6px 0" }}>
                  {searchHistory.map((term) => (
                    <button key={term} type="button" className="search-history-chip glass" onClick={() => setQuery(term)}>
                      <SearchIcon size={13} />
                      {term}
                    </button>
                  ))}
                </div>
              </>
            )}
            {searchHistory.length === 0 && (
              <div className="empty-state">
                <SearchIcon size={36} />
                <h3>Search FGRAM</h3>
                <p>Find chats, contacts, and messages instantly.</p>
              </div>
            )}
          </div>
        )}

        {query && !hasResults && (
          <div className="empty-state">
            <SearchIcon size={36} />
            <h3>No results</h3>
            <p>Nothing matched "{truncate(query, 30)}".</p>
          </div>
        )}

        {query && hasResults && (
          <div style={{ paddingBottom: 40 }}>
            {results.contactMatches.length > 0 && (
              <>
                <div className="search-result-group-label">Contacts</div>
                {results.contactMatches.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="chat-item"
                    style={{ width: "100%" }}
                    onClick={() => {
                      commitSearch();
                      onOpenChat(c.id);
                    }}
                  >
                    <Avatar name={c.name} online={c.online} showStatus />
                    <div className="chat-item-body" style={{ textAlign: "left" }}>
                      <div className="chat-item-name"><Highlighted text={c.name} query={query} /></div>
                      <div className="chat-item-snippet">{c.username}</div>
                    </div>
                  </button>
                ))}
              </>
            )}

            {results.messageMatches.length > 0 && (
              <>
                <div className="search-result-group-label">Messages</div>
                {results.messageMatches.slice(0, 20).map(({ chatId, contactName, message }) => (
                  <button
                    key={message.id}
                    type="button"
                    className="chat-item"
                    style={{ width: "100%" }}
                    onClick={() => {
                      commitSearch();
                      onOpenChat(null, chatId);
                    }}
                  >
                    <Avatar name={contactName} />
                    <div className="chat-item-body" style={{ textAlign: "left" }}>
                      <div className="chat-item-name">{contactName}</div>
                      <div className="chat-item-snippet"><Highlighted text={truncate(message.text, 50)} query={query} /></div>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
