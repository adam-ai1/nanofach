'use client';

import type { FC } from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import type { Alert } from '@/app/page';
import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';

interface AlertsLogProps {
  alerts: Alert[];
}

const alertConfig = {
  info: {
    icon: <Info className="h-4 w-4 text-primary" />,
    className: 'text-white',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
    className: 'text-yellow-400 animate-shake',
  },
  error: {
    icon: <AlertCircle className="h-4 w-4 text-destructive" />,
    className: 'text-destructive animate-shake',
  },
};

const AlertsLog: FC<AlertsLogProps> = ({ alerts }) => {
  const { language } = useContext(LanguageContext);
  const locale = language === 'ar' ? ar : enUS;

  return (
    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-10 w-72 md:w-80">
      <div className="flex flex-col gap-2">
        {alerts.map((alert) => {
          const config = alertConfig[alert.type];
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3 rounded-md bg-black/40 backdrop-blur-md border border-border/50 shadow-lg ${config.className}`}
            >
              {config.icon}
              <div className="flex-grow">
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(alert.timestamp, {
                    addSuffix: true,
                    locale,
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsLog;
