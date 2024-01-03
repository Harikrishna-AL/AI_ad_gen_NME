// @ts-nocheck

import React, { useState, useEffect, useRef } from "react";
import { Input, Suggestion1 } from "../common/Input";

const SuggetionInput = ({ value, setValue, suggetion }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const node = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (node.current.contains(e.target)) {
        return;
      }
      setShowDropdown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={node} style={{ position: "relative", width: "100%" }}>
      <Input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
      ></Input>
      {showDropdown && (
        <Suggestion1>
          {suggetion.map((suggestion) => (
            <div
              className="item"
              key={suggestion}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setValue(suggestion);
                setShowDropdown(false);
              }}
            >
              {suggestion}
            </div>
          ))}
        </Suggestion1>
      )}
    </div>
  );
};

export default SuggetionInput;
