import React, { useEffect, useState } from "react";
import { handleHover, handleTextFieldSpeech } from "./SpeechUtils";

const TextToSpeech = ({ isHoverEnabled, toggleHover, selectedRow,
  rowData, imageSrc, label, value, buttonText}) => {
    console.log(
      "TextToSpeech component rendered. isHoverEnabled:",
      isHoverEnabled
    );
    
  const [internalIsHoverEnabled, setInternalIsHoverEnabled] =
    useState(isHoverEnabled);

  useEffect(() => {
    setInternalIsHoverEnabled(isHoverEnabled);
  }, [isHoverEnabled]);
  
  const handleToggleHover = () => {
    toggleHover();

    // Speak the status explicitly
    const statusText = internalIsHoverEnabled
      ? "Text To Speech Disabled"
      : "Text To Speech Enabled";
    handleTextFieldSpeech(statusText);

    if (buttonText) {
      // Handle button text
      handleHover(buttonText, isHoverEnabled);
    } else {
      // Handle text field labels and values
      handleTextFieldSpeech(label, value);
    }
    setInternalIsHoverEnabled(!internalIsHoverEnabled);
  };

  useEffect(() => {
    if (internalIsHoverEnabled) {
      // Add your logic here for handling hover
      console.log("Handling hover...");
    }
  }, [internalIsHoverEnabled]);

  return (
    <div className="App">
      <button onClick={handleToggleHover}>
        {isHoverEnabled ? "Disable Text To Speech" : "Enable Text To Speech"}
        <img src={imageSrc} className="image" />
      </button>
    </div>
  );
};

export default TextToSpeech;
