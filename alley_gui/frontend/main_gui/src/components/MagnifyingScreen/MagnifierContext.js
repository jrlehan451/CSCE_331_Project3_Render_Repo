import React, { useState } from "react";

function NavigationBar() {
  const [isMagnifierEnabled, setMagnifierEnabled] = useState(false);

  const toggleMagnifier = () => {
    setMagnifierEnabled(!isMagnifierEnabled);
  };

  return (
    <nav>
      {/* Other navigation items */}
      <button onClick={toggleMagnifier}>
        {isMagnifierEnabled ? "Disable Magnifier" : "Enable Magnifier"}
      </button>
    </nav>
  );
}
