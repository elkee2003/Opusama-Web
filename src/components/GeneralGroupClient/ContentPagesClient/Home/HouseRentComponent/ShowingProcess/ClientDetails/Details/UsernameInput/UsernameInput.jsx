import React, { useState, useEffect, useRef } from "react";
import './UsernameInput.css';
import { DataStore } from "aws-amplify/datastore";
import { User } from "../../../../../../../../../models";

const UsernameInput = ({ value, onChange, placeholder }) => {
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
  };

  // Handle selecting a username
  const handleSelectUsername = (username) => {
    onChange(username); // ✅ directly set username (not multiple mentions)
    setShowSuggestions(false);
    setMentionQuery("");
  };

  // Fetch only user usernames once
  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const users = await DataStore.query(User);
        const usernames = users.map((u) => u.username).filter(Boolean);
        setAllUsernames(usernames);
      } catch (err) {
        console.error("Error fetching usernames:", err);
      }
    };

    fetchUsernames();
  }, []);

  return (
    <div className="userNameInputAreaCon">

        {/* Text Area */}
        <textarea
            ref={textareaRef}
            className="usernameInputText"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
        />

        {/* Suggestions */}
        {showSuggestions && (
            <ul className="username-suggestions">
            {filteredUsernames.length > 0 ? (
                filteredUsernames.map((name, i) => (
                <li key={i} onClick={() => handleSelectUsername(name)}>
                    @{name}
                </li>
                ))
            ) : (
                <li className="no-username-suggestions">No matches</li>
            )}
            </ul>
        )}
    </div>
  );
};

export default UsernameInput;