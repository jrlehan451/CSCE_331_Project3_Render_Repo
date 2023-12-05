// MagnifierCursor.js
import React, { useState, useEffect } from 'react';
import './MagnifierComponent.css'; // Your styling for the magnifier cursor

const MagnifierCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [magnifierContent, setMagnifierContent] = useState(null);

  //if(magnify)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const width = 20;
      const height = 10;
      // Capture the content within a circular region around the cursor
      const radius = 50; // Adjust the radius of the circular region as needed
      const content = captureCircularRegion(e.clientX, e.clientY, radius);
      setMagnifierContent(content);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Function to capture content within a circular region
  const captureCircularRegion = (x, y, radius) => {
    const elements = document.elementsFromPoint(x, y);
    const circularRegionElements = elements.filter((element) => {
      // Check if the element is within the circular region
      const rect = element.getBoundingClientRect();
      const elementX = rect.left + rect.width / 2;
      const elementY = rect.top + rect.height / 2;

      const distance = Math.sqrt((x - elementX) ** 2 + (y - elementY) ** 2);
      return distance <= radius;
    });

    // Filter out non-text elements and keep only text nodes
    const textNodes = circularRegionElements
      .map((element) => Array.from(element.childNodes))
      .flat()
      .filter((node) => node.nodeType === Node.TEXT_NODE);
  

    // // Create a div to hold the captured content
    // const container = document.createElement('div');
    // circularRegionElements.forEach((element) => {
    //   const clone = element.cloneNode(true);
    //   container.appendChild(clone);
    // });
    // Create a div to hold the captured content
    const container = document.createElement('div');
    textNodes.forEach((textNode) => {
      const clone = document.createElement('div');
      clone.textContent = textNode.textContent;
      container.appendChild(clone);

      clone.style.fontSize = '25px'; // Adjust the font size as needed
      clone.style.fontWeight = 'bold';
    });

    return container.innerHTML;
  };

  return (
    <div className={`magnifier-cursor`} style={{ left: `${position.x}px`, top: `${position.y}px` }}>
      {/* Display the magnified content */}
      <div dangerouslySetInnerHTML={{ __html: magnifierContent }} />
    </div>

    // <div className="magnifier-cursor" style={{ left: `${position.x}px`, top: `${position.y}px` }}>
    //   {/* Display the magnified content */}
    //   <div dangerouslySetInnerHTML={{ __html: magnifierContent }} />
    // </div>
  );
};

export default MagnifierCursor;
