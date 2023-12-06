import React, { useEffect, useState } from "react";
import { handleHover, handleTextFieldSpeech } from "./SpeechUtils";

/**
 * @description This component enables the text-to-speech functionality on the application
 * @function TextToSpeech
 * @param {bool} isHoverEnabled
 * @param {*} toggleHover
 * @param {*} selectedRow
 * @param {*} rowData
 * @param {string} imageSrc
 * @param {string} label
 * @param {int} value
 * @param {string} buttonText
 * @returns speaker functionality
 */
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
  
  /**
   * @function handleToggleHover
   * @description turns the text-to-speech functionality on and off  
   */
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

  /**
   * @function internalIsHoverEnabled
   * @description determines if the internal hover is enabled
   */
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
