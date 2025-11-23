'use client';

import type { FC } from 'react';

interface CompassProps {
  heading: number;
}

const Compass: FC<CompassProps> = ({ heading }) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  return (
    <div
      className="relative h-24 w-24 rounded-full bg-black/20 backdrop-blur-sm border-2 border-primary/30 flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
      style={{
        transform: `rotate(${-heading}deg)`,
        transition: 'transform 0.5s ease-out',
      }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 text-primary font-bold">
        N
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-2 text-primary/50">
        S
      </div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 text-primary/50">
        W
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 text-primary/50">
        E
      </div>

      <div
        className="absolute h-full w-full"
        style={{
          transform: `rotate(${heading}deg)`,
          transition: 'transform 0.5s ease-out',
        }}
      >
        <div className="absolute top-1 left-1/2 -translate-x-1/2 h-4 w-1 bg-destructive rounded-full" />
      </div>
    </div>
  );
};

export default Compass;
