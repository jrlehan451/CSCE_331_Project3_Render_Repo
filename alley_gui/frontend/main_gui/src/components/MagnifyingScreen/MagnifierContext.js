// // MagnifierContext.js
// import React, { createContext, useContext, useState } from 'react';

// const MagnifierContext = createContext();

// export const MagnifierProvider = ({ children }) => {
//   const [isMagnifying, setIsMagnifying] = useState(false);

//   const toggleMagnifying = () => {

//     setIsMagnifying((prev) => !prev);
//   };
//   console.log('isMagnifying:', isMagnifying);

//   return (
//     <MagnifierContext.Provider value={{ isMagnifying, toggleMagnifying }}>
//       {children}
//     </MagnifierContext.Provider>
//   );
// };

// export const useMagnifier = () => {
//   return useContext(MagnifierContext);
// };

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
