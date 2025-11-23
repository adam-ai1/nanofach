'use client';
import type { FC } from 'react';

const VirtualJoystick: FC = () => {
  return (
    <div
      aria-label="Virtual Joystick"
      className="relative w-36 h-36 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border-2 border-primary/50 shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
    >
      <div className="absolute w-1/2 h-px bg-primary/20"></div>
      <div className="absolute h-1/2 w-px bg-primary/20"></div>
      <div className="absolute w-16 h-16 rounded-full bg-primary/10 border-2 border-dashed border-primary/30"></div>
      <div
        aria-label="Joystick Handle"
        className="w-12 h-12 rounded-full bg-primary/80 border-2 border-primary cursor-pointer active:scale-110 active:bg-primary transition-all"
      ></div>
    </div>
  );
};

export default VirtualJoystick;
