const handleHover = (event, isHoverEnabled) => {
  console.log("handleHover - isHoverEnabled:", isHoverEnabled);
  if (isHoverEnabled) {
    const textContent = event.target.textContent;
    if (textContent !== undefined && textContent !== null) {
      console.log("Text to be spoken:", textContent);

      // Speak the text using the SpeechSynthesis API
      const speech = new SpeechSynthesisUtterance(textContent);
      speechSynthesis.speak(speech);
    } else {
      console.log("Text content is undefined or empty.");
    }
  }
};

const handleMouseOut = () => {
  console.log("handleMouseOut");
  // Cancel any ongoing speech
  speechSynthesis.cancel();
};

// SpeechUtils.js
const handleTextFieldSpeech = (label, value) => {
  const textContent = value !== undefined ? `${label} ${value}` : label;
  console.log("Text to be spoken:", textContent);

  // Speak the text using the SpeechSynthesis API
  const speech = new SpeechSynthesisUtterance(textContent);
  speechSynthesis.speak(speech);
};

const handleTableFieldSpeech = (fieldValue) => {
  console.log("Text to be spoken:", fieldValue);

  // Speak the text using the SpeechSynthesis API
  const speech = new SpeechSynthesisUtterance(fieldValue);
  speech.onstart = () => {
    console.log("Speech synthesis started");
  };

  speech.onend = () => {
    console.log("Speech synthesis ended");
  };

  speech.onerror = (event) => {
    console.error("Speech synthesis error:", event);
  };

  speechSynthesis.speak(speech);
};

export {
  handleHover,
  handleMouseOut,
  handleTextFieldSpeech,
  handleTableFieldSpeech,
};
