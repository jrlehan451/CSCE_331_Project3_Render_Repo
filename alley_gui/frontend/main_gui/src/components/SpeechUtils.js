const handleHover = (event, isHoverEnabled) => {
  console.log("handleHover - isHoverEnabled:", isHoverEnabled);
  if (isHoverEnabled  && !speechSynthesis.speaking) {
    const textContent = event.target.textContent;
    if (textContent !== undefined && textContent !== null) {
      const altText = event.target.alt;

      // Check if there is text content or alt text
      if (
        textContent !== undefined &&
        textContent !== null &&
        textContent.trim() !== ""
      ) {
      console.log("Text to be spoken:", textContent);

      // Speak the text using the SpeechSynthesis API
      const speech = new SpeechSynthesisUtterance(textContent);
      speechSynthesis.speak(speech);
    } else if (
      altText !== undefined &&
      altText !== null &&
      altText.trim() !== ""
    ) {
      console.log("Alt text to be spoken:", altText);

      // Speak the alt text using the SpeechSynthesis API
      const speech = new SpeechSynthesisUtterance(altText);
      speechSynthesis.speak(speech);
    } else {
      console.log("Text content is undefined or empty.");
      console.log("Text content and alt text are both undefined or empty.");
    }
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
