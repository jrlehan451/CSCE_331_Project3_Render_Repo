// MagnifierCursor.js
import React, { useState, useEffect } from 'react';
import './MagnifierComponent.css'; 

/**
 * @description This component creates the accessibility feature of a mangifying glass
 * @component MagnifierCursor
 * @param {*} magnifierActive 
 * @returns 
 */
const MagnifierCursor = ({ magnifierActive }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [magnifierContent, setMagnifierContent] = useState(null);


  //if(magnify)
  /**
   * @description changes the text that is magnified as the mouse moves
   * @function handleMouseMove
   */
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const width = 20;
      const height = 10;
      const radius = 50; 
      const content = captureCircularRegion(e.clientX, e.clientY, radius);
      setMagnifierContent(content);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [magnifierActive]);

  // Function to capture content within a circular region
  /**
   * @description gets the region for which mangnification of text needs to occur
   * @function captureCircularRegion
   * @param {int} x 
   * @param {int} y 
   * @param {int} radius 
   * @returns text in magnified font and in circle
   */
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
    const container = document.createElement('div');
    textNodes.forEach((textNode) => {
      const clone = document.createElement('div');
      clone.textContent = textNode.textContent;
      container.appendChild(clone);
      //change fond inside magnifier
      clone.style.fontSize = '25px'; 
      clone.style.fontWeight = 'bold';
    });

    return container.innerHTML;
  };

  return magnifierActive ? (
    <div className={`magnifier-cursor`} style={{ left: `${position.x}px`, top: `${position.y}px` }}>
      <div dangerouslySetInnerHTML={{ __html: magnifierContent }} />
    </div>
  ) : null;
  };

  export default MagnifierCursor;
