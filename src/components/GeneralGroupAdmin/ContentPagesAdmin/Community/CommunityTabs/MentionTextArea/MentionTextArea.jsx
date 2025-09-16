import React, { useState, useEffect, useRef } from "react";
import { DataStore } from "aws-amplify/datastore";
import { User, Realtor } from "../../../../../../models";

const MentionTextarea = ({ value, onChange, placeholder, onMentionsChange }) => {
  const [allUsernames, setAllUsernames] = useState([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [filteredUsernames, setFilteredUsernames] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef(null);

  // Handle input typing
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    const cursorPos = e.target.selectionStart;
    const textUntilCursor = newValue.slice(0, cursorPos);
    const match = textUntilCursor.match(/@([a-zA-Z0-9._-]*)$/);

    if (match) {
      const query = match[1].toLowerCase();
      setMentionQuery(query);

      const results = allUsernames.filter((name) =>
        name.toLowerCase().startsWith(query)
      );

      setFilteredUsernames(results);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }

    // ✅ Extract all mentions in full text
    const mentionRegex = /@([a-zA-Z0-9._-]+)(?=\s|$)/g;
    const mentions = [...newValue.matchAll(mentionRegex)].map(m => m[1]);

    if (onMentionsChange) onMentionsChange(mentions);
  };

  // Handle selecting a username
  const handleSelectUsername = (username) => {
    const cursorPos = textareaRef.current.selectionStart;
    const textUntilCursor = value.slice(0, cursorPos);
    const textAfterCursor = value.slice(cursorPos);

    const newText = textUntilCursor.replace(/@\w*$/, `@${username} `) + textAfterCursor;
    onChange(newText);

    // ✅ Extract mentions immediately after inserting
    const mentionRegex = /@([a-zA-Z0-9._-]+)(?=\s|$)/g;
    const mentions = [...newText.matchAll(mentionRegex)].map(m => m[1]);
    if (onMentionsChange) onMentionsChange(mentions);

    setShowSuggestions(false);
    setMentionQuery("");

    setShowSuggestions(false);
    setMentionQuery("");
  };

  // Fetch usernames once
  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const users = await DataStore.query(User);
        const realtors = await DataStore.query(Realtor);

        const usernames = [
          ...users.map((u) => u.username).filter(Boolean),
          ...realtors.map((r) => r.username).filter(Boolean),
        ];

        setAllUsernames(usernames);
      } catch (err) {
        console.error("Error fetching usernames:", err);
      }
    };

    fetchUsernames();
  }, []);

  return (
    <div className="mentionTextAreaCon">
        {/* Mention Highlighter */}
        {/* <div className="mentionHighlighter" aria-hidden="true">
            <span
            dangerouslySetInnerHTML={{
                __html: value.replace(
                /@(\w+)/g,
                `<span class="mention-highlight">@$1</span>`
                ),
            }}
            />
        </div> */}

        {/* Text Area */}
        <textarea
            ref={textareaRef}
            className="formCommunText"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
        />

        {/* Suggestions */}
        {showSuggestions && (
            <ul className="mention-suggestions">
            {filteredUsernames.length > 0 ? (
                filteredUsernames.map((name, i) => (
                <li key={i} onClick={() => handleSelectUsername(name)}>
                    @{name}
                </li>
                ))
            ) : (
                <li className="no-suggestions">No matches</li>
            )}
            </ul>
        )}
    </div>
  );
};

export default MentionTextarea;