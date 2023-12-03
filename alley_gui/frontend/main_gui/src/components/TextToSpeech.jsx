// TextToSpeech.js
import React from "react";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
} from "./SpeechUtils";

const TextToSpeech = ({
  isHoverEnabled,
  toggleHover,
  label,
  value,
  buttonText,
}) => {
  const handleToggleHover = () => {
    toggleHover();

    if (buttonText) {
      // Handle button text
      handleHover(null, isHoverEnabled, buttonText);
    } else {
      // Handle text field labels and values
      handleTextFieldSpeech(label, value);
    }
  };

  return (
    <div className="App">
      <button onClick={handleToggleHover}>
        {buttonText || "Enable/Disable Text To Speech"}
      </button>
    </div>
  );
};

export default TextToSpeech;
