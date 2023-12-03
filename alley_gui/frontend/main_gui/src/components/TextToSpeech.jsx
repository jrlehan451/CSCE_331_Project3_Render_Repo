import React, { useState } from "react";
import { handleHover, handleMouseOut } from "./SpeechUtils";

const TextToSpeech = ({ isHoverEnabled, toggleHover }) => {
  return (
    <div className="App">
      <button onClick={toggleHover}>
        {isHoverEnabled ? "Disable Text To Speech" : "Enable Text To Speech"}
      </button>
    </div>
  );
};

export default TextToSpeech;
