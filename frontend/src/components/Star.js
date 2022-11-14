import React from 'react';

export default function Star () {
  // https://www.tutorialspoint.com/How-to-draw-a-star-in-HTML5-SVG
  return (
    <svg viewBox="0 0 200 200" height="50px" width="50px" fill="gold">
      <polygon points="100,10 40,180 190,60 10,60 160,180" />
    </svg>
  );
}
