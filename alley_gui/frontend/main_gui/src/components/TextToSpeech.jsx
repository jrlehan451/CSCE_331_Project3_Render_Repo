import React, { useEffect } from "react";
import {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
} from "./SpeechUtils";

const TextToSpeech = ({
  isHoverEnabled,
  toggleHover,
  selectedRow,
  rowData,
  label,
  value,
  buttonText,
}) => {
  const handleToggleHover = () => {
    toggleHover();

    if (buttonText) {
      // Handle button text
      handleHover(buttonText, isHoverEnabled);
    } else {
      // Handle text field labels and values
      handleTextFieldSpeech(label, value);
    }
  };

  useEffect(() => {
    if (isHoverEnabled && selectedRow && rowData) {
      const textToSpeak = `Item ID ${rowData.itemId}, Name ${rowData.name}, Amount ${rowData.amount}, Quantity Per Unit ${rowData.quantityPerUnit}`;
      handleHover(textToSpeak, isHoverEnabled);
    }
  }, [isHoverEnabled, selectedRow, rowData]);

  return (
    <div className="App">
      <button onClick={handleToggleHover}>
        {isHoverEnabled ? "Disable Text To Speech" : "Enable Text To Speech"}
      </button>
    </div>
  );
};

export default TextToSpeech;
