// // MagnifierComponent.js
// import React from 'react';
// import { useMagnifier } from './MagnifierContext';
// import './MagnifierComponent.css';

// const MagnifierComponent = () => {
//   const { isMagnifying, toggleMagnifying } = useMagnifier();
//   const handleClick = () => {
//     console.log('Toggle button clicked!');
//     toggleMagnifying();
//   };
//   return (
//     <>
//       <button onClick={handleClick}>Toggle Magnifier</button>
//       <div className={`cursor ${isMagnifying ? 'magnifying' : ''}`} />
//     </>
//   );
// };

// export default MagnifierComponent;


import React, { useState, createContext } from "react";

export const MagnifierContext = createContext();

export const MagnifierProvider = ({ children }) => {
  const [isMagnifierEnabled, setMagnifierEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPosition({ x: e.pageX, y: e.pageY });
  };

  const toggleMagnifier = () => {
    setMagnifierEnabled(!isMagnifierEnabled);
  };

  return (
    <MagnifierContext.Provider value={{ isMagnifierEnabled, toggleMagnifier }}>
      {isMagnifierEnabled && (
        <div
          className="magnify"
          onMouseMove={handleMouseMove}
          style={{
            left: `${position.x - 100}px`,
            top: `${position.y - 100}px`,
          }}
        />
      )}
      {children}
    </MagnifierContext.Provider>
  );
};
