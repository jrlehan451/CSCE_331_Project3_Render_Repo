const handleHover = (event, isHoverEnabled) => {
  console.log("handleHover - isHoverEnabled:", isHoverEnabled);
  if (isHoverEnabled) {
    const textContent = event.target.textContent;

    // Speak the text using the SpeechSynthesis API
    const speech = new SpeechSynthesisUtterance(textContent);
    speechSynthesis.speak(speech);
  }
};

const handleMouseOut = () => {
  // Cancel any ongoing speech
  speechSynthesis.cancel();
};

export { handleHover, handleMouseOut };
