"use client";

import { RefObject, useEffect, useState } from "react";

interface Props {
  cursor: { x: number; y: number };
  cardRef: RefObject<HTMLDivElement>;
}

const Beaker = ({ cursor, cardRef }: Props) => {
  const [gradientCenter, setGradientCenter] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (cardRef.current && cursor.x !== null && cursor.y !== null){
      const cardRect = cardRef.current.getBoundingClientRect();
      const cxPercentage = (cursor.x / cardRect.width) * 100;
      const cyPercentage = (cursor.y / cardRect.height) * 100;
      setGradientCenter({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      })
    }
  }, [cursor, cardRef])

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" className="absolute w-[200%] h-[200%] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30">
      <defs>
        <radialGradient id="confidenceGradient" gradientUnits="userSpaceOnUse" cx={gradientCenter.cx} cy={gradientCenter.cy} r="50%">
          <stop stopColor="#0095f6"/>
          <stop offset={1} stopColor="#40404005"/>
        </radialGradient>
      </defs>
      <g fill="none" stroke="url(#confidenceGradient)" strokeWidth="3">
        {/* Grid pattern for stability */}
        <path d="M0,200 h2000 M0,600 h2000 M0,1000 h2000 M0,1400 h2000 M0,1800 h2000" />
        <path d="M200,0 v2000 M600,0 v2000 M1000,0 v2000 M1400,0 v2000 M1800,0 v2000" />
        
        {/* Interlocking circles for unity and strength */}
        <circle cx="500" cy="500" r="300" />
        <circle cx="1500" cy="500" r="300" />
        <circle cx="500" cy="1500" r="300" />
        <circle cx="1500" cy="1500" r="300" />
        
        {/* Shield shape for trust and security */}
        <path d="M1000,200 L1400,600 L1000,1800 L600,600 Z" />
        
        {/* Star burst for quality and excellence */}
        <path d="M1000,1000 L1100,600 L1000,200 L900,600 Z" />
        <path d="M1000,1000 L1400,900 L1800,1000 L1400,1100 Z" />
        <path d="M1000,1000 L1100,1400 L1000,1800 L900,1400 Z" />
        <path d="M1000,1000 L600,900 L200,1000 L600,1100 Z" />
      </g>
    </svg>
  )
}

export default Beaker;