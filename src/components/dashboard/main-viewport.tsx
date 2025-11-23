'use client';

import type { FC } from 'react';
import type { NanoFishData } from '@/app/page';
import Compass from '@/components/dashboard/compass';
import { Battery, Waves, Fish } from 'lucide-react';
import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';

interface MainViewportProps {
  data: NanoFishData;
}

const FishModel: FC<{ position: { x: number; y: number; z: number } }> = ({
  position,
}) => {
  const { x } = position;
  // Make the fish flip horizontally based on direction
  const scaleX = x >= 0 ? 1 : -1;
  const translateX = `calc(-50% + ${x}px)`;

  return (
    <div
      className="absolute top-1/2 left-1/2 transition-transform duration-500"
      style={{
        transform: `translate(${translateX}, -50%) scaleX(${scaleX})`,
      }}
    >
      <Fish
        className="w-48 h-48 text-primary/70 drop-shadow-[0_0_15px_hsl(var(--primary)_/_0.5)]"
        strokeWidth={1}
      />
    </div>
  );
};


const MainViewport: FC<MainViewportProps> = ({ data }) => {
  const { t, language } = useContext(LanguageContext);
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  const getBatteryColor = (level: number) => {
    if (level < 20) return 'text-destructive';
    if (level < 50) return 'text-yellow-400';
    return 'text-primary';
  };

  const depthPositionClasses =
    language === 'ar'
      ? 'right-4 sm:right-6 lg:right-8'
      : 'left-4 sm:left-6 lg:left-8';

  const batteryPositionClasses =
    language === 'ar'
      ? 'left-4 sm:left-6 lg:left-8'
      : 'right-4 sm:right-6 lg:right-8';

  const compassPositionClasses =
    language === 'ar'
      ? 'right-4 sm:right-6 lg:right-8'
      : 'left-4 sm:left-6 lg:left-8';

  return (
    <div className="absolute inset-0 z-0">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxmaXNoJTIwdGFua3xlbnwwfHx8fDE3MTc4NTMwNTl8MA&ixlib=rb-4.0.3&q=80&w=1080"
      >
        <source
          src="https://firebasestorage.googleapis.com/v0/b/firebase-studio-demo-project.appspot.com/o/defaults%2Fwater_in_fishtank.mp4?alt=media&token=8fa6c52a-6058-45e0-b635-b82531649642"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/40" />

      <FishModel position={data.fishPosition} />

      {/* Overlays */}
      <div
        dir={direction}
        className={`absolute top-4 text-white p-2 rounded-lg bg-black/20 backdrop-blur-sm border border-primary/20 ${batteryPositionClasses}`}
      >
        <div className="flex items-center gap-2">
          <Battery className={`h-6 w-6 ${getBatteryColor(data.battery)}`} />
          <span
            className={`font-mono text-xl font-bold ${getBatteryColor(
              data.battery
            )}`}
          >
            {data.battery.toFixed(0)}%
          </span>
        </div>
      </div>

      <div
        dir={direction}
        className={`absolute top-4 ${compassPositionClasses}`}
      >
        <Compass heading={data.compass} />
      </div>

      <div
        dir={direction}
        className={`absolute bottom-4 text-white p-3 rounded-lg bg-black/20 backdrop-blur-sm border border-primary/20 ${depthPositionClasses}`}
      >
        <div className="flex items-end gap-2">
          <Waves className="h-8 w-8 text-primary" />
          <div>
            <span className="text-xs text-primary/80">{t.main.depth}</span>
            <p className="font-mono text-3xl font-bold">
              {data.depth.toFixed(1)}
              <span className={`text-xl ${language === 'ar' ? 'mr-1' : 'ml-1'}`}>
                m
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainViewport;
