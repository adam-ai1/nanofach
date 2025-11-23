'use client';

import type { FC } from 'react';
import { useContext } from 'react';
import dynamic from 'next/dynamic';
import type { NanoFishData } from '@/app/page';
import Compass from '@/components/dashboard/compass';
import { Battery, Waves } from 'lucide-react';
import { LanguageContext } from '@/context/language-context';

interface MainViewportProps {
  data: NanoFishData;
}

const OceanScene = dynamic(() => import('./ocean-scene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0" aria-hidden />,
});

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
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-sky-950/40 to-slate-950" />
      <OceanScene data={data} />

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
