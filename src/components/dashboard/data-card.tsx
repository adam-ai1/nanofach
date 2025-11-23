'use client';

import type { FC, ReactNode } from 'react';
import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';

interface DataCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit: string;
}

const DataCard: FC<DataCardProps> = ({ icon, label, value, unit }) => {
  const { language } = useContext(LanguageContext);
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const valueUnitClass = language === 'ar' ? 'mr-1' : 'ml-1';
  return (
    <div
      dir={direction}
      className="flex items-center gap-3 p-2 rounded-lg bg-black/20 border border-transparent hover:border-primary/30 transition-colors"
    >
      <div className="p-2 bg-black/30 rounded-md">{icon}</div>
      <div className="flex-grow">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-mono text-lg font-semibold text-white">
          {value}
          <span className={`text-sm text-muted-foreground ${valueUnitClass}`}>
            {unit}
          </span>
        </p>
      </div>
    </div>
  );
};

export default DataCard;
