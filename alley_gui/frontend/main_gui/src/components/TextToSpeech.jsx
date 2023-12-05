import React, { useEffect, useState } from "react";
import { handleHover, handleTextFieldSpeech } from "./SpeechUtils";

const TextToSpeech = ({ isHoverEnabled, toggleHover, imageSrc }) => {
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

    const statusText = internalIsHoverEnabled
      ? "Text To Speech Disabled"
      : "Text To Speech Enabled";

    handleTextFieldSpeech(statusText);

    setInternalIsHoverEnabled(!internalIsHoverEnabled);
  };

  useEffect(() => {
    if (internalIsHoverEnabled) {
      // Add your logic here for handling hover
      console.log("Handling hover...");
    }
  }, [internalIsHoverEnabled]);

  return (
    <div className="TextToSpeech">
      <button onClick={handleToggleHover}>
        <img src={imageSrc} className="image" />
      </button>
    </div>
  );
};

export default TextToSpeech;
