import React from "react";
import { handleHover, handleMouseOut } from "./SpeechUtils";

const TextToSpeech = ({ isHoverEnabled }) => {
  const toggleHover = () => {
    handleHover(isHoverEnabled);
  };

  return (
    <div className="App">
      <button onClick={toggleHover}>
        {isHoverEnabled ? "Disable Hover" : "Enable Hover"}
      </button>
    </div>
  );
};

export default TextToSpeech;
