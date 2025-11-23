'use client';

import type { FC } from 'react';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress: FC<CircularProgressProps> = ({
  value,
  size = 60,
  strokeWidth = 6,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const getColor = () => {
    if (value < 20) return 'hsl(var(--destructive))';
    if (value < 50) return '#FFC107'; // Yellow
    return 'hsl(var(--accent))';
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        className="text-muted-foreground/20"
        stroke="currentColor"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="transition-all duration-300"
        stroke={getColor()}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
        }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="text-sm font-mono font-bold"
        fill={getColor()}
      >
        {`${Math.round(value)}%`}
      </text>
    </svg>
  );
};

export default CircularProgress;
