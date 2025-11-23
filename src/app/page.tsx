'use client';

import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import MainViewport from '@/components/dashboard/main-viewport';
import TelemetrySidebar from '@/components/dashboard/telemetry-sidebar';
import ControlPanel from '@/components/dashboard/control-panel';
import { useToast } from '@/hooks/use-toast';
import { LanguageContext, translations } from '@/context/language-context';

export interface Alert {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: Date;
}

export interface NanoFishData {
  depth: number;
  battery: number;
  temperature: number;
  pressure: number;
  ph: number;
  compass: number;
  connection: number;
  leakDetected: boolean;
  fishPosition: { x: number; y: number; z: number };
}

export type SensorStatus = {
  camera: boolean;
  sonar: boolean;
  temp: boolean;
  ph: boolean;
  pressure: boolean;
  leak: boolean;
};

const MAX_DEPTH = 100;
const MIN_TEMP = 5;
const MAX_TEMP = 30;
const DEFAULT_BACKGROUND_VIDEO_URL =
  process.env.NEXT_PUBLIC_BACKGROUND_VIDEO_URL ??
  'https://firebasestorage.googleapis.com/v0/b/firebase-studio-demo-project.appspot.com/o/defaults%2Fwater_in_fishtank.mp4?alt=media&token=8fa6c52a-6058-45e0-b635-b82531649642';
const LOCAL_BACKGROUND_VIDEO_KEY = 'backgroundVideoUrl';

export default function DashboardPage() {
  const { toast } = useToast();
  const { t } = useContext(LanguageContext);

  const [data, setData] = useState<NanoFishData>({
    depth: 25.1,
    battery: 88,
    temperature: 15.3,
    pressure: 1024,
    ph: 7.2,
    compass: 45,
    connection: 4,
    leakDetected: false,
    fishPosition: { x: 0, y: 0, z: 0 },
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [sensorStatus, setSensorStatus] = useState<SensorStatus>({
    camera: true,
    sonar: true,
    temp: true,
    ph: true,
    pressure: true,
    leak: true,
  });
  const [backgroundVideoUrl, setBackgroundVideoUrl] = useState(
    DEFAULT_BACKGROUND_VIDEO_URL
  );

  const addAlert = useCallback((message: string, type: Alert['type']) => {
    setAlerts(
      (prev) =>
        [
          ...prev,
          { id: Date.now(), message, type, timestamp: new Date() },
        ].slice(-3)
    );
  }, []);

  useEffect(() => {
    const dataInterval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        depth: Math.min(
          MAX_DEPTH,
          Math.max(0, prev.depth + (Math.random() - 0.5) * 2)
        ),
        temperature: sensorStatus.temp
          ? Math.min(
              MAX_TEMP,
              Math.max(
                MIN_TEMP,
                prev.temperature + (Math.random() - 0.5) * 0.5
              )
            )
          : 0,
        pressure: sensorStatus.pressure
          ? prev.pressure + (Math.random() - 0.5) * 5
          : 0,
        ph: sensorStatus.ph
          ? Math.max(0, Math.min(14, prev.ph + (Math.random() - 0.5) * 0.1))
          : 0,
        compass: (prev.compass + (Math.random() - 0.4) * 10 + 360) % 360,
        connection: Math.floor(Math.random() * 2) + 3,
        leakDetected: sensorStatus.leak ? Math.random() < 0.01 : false,
      }));
    }, 2000);

    const batteryInterval = setInterval(() => {
      setData((prev) => ({ ...prev, battery: Math.max(0, prev.battery - 1) }));
    }, 15000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(batteryInterval);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [sensorStatus]);

  useEffect(() => {
    if (
      data.battery < 20 &&
      !alerts.some((a) => a.message.includes(t.alerts.lowBattery))
    ) {
      addAlert(t.alerts.lowBattery, 'warning');
    }
    if (
      data.leakDetected &&
      !alerts.some((a) => a.message.includes(t.alerts.leakDetected))
    ) {
      addAlert(t.alerts.leakDetected, 'error');
    }
  }, [data.battery, data.leakDetected, alerts, addAlert, t]);

  useEffect(() => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.message === translations.en.alerts.systemConnected)
          return { ...a, message: t.alerts.systemConnected };
        if (a.message === translations.ar.alerts.systemConnected)
          return { ...a, message: t.alerts.systemConnected };
        if (a.message === translations.en.alerts.lowBattery)
          return { ...a, message: t.alerts.lowBattery };
        if (a.message === translations.ar.alerts.lowBattery)
          return { ...a, message: t.alerts.lowBattery };
        return a;
      })
    );
  }, [t]);

  const handleRecord = () => {
    setIsRecording((prev) => {
      const newIsRecording = !prev;
      if (newIsRecording) {
        recordingIntervalRef.current = setInterval(() => {
          setRecordingTime((t) => t + 1);
        }, 1000);
      } else {
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current);
        }
        setRecordingTime(0);
      }
      return newIsRecording;
    });
  };

  const handleTakePicture = () => {
    toast({
      title: t.toasts.snapshot.title,
      description: t.toasts.snapshot.description,
    });
  };

  const handleSurface = () => {
    toast({
      title: t.toasts.surface.title,
      description: t.toasts.surface.description,
    });
  };

  const handleSensorToggle = (
    sensorId: keyof SensorStatus,
    checked: boolean
  ) => {
    setSensorStatus((prev) => ({ ...prev, [sensorId]: checked }));
  };

  const handleMove = (direction: 'forward' | 'backward') => {
    setData((prev) => {
      const newX =
        direction === 'forward'
          ? Math.min(100, prev.fishPosition.x + 5)
          : Math.max(-100, prev.fishPosition.x - 5);
      return {
        ...prev,
        fishPosition: { ...prev.fishPosition, x: newX },
      };
    });
  };

  useEffect(() => {
    const storedVideoUrl = localStorage.getItem(LOCAL_BACKGROUND_VIDEO_KEY);
    if (storedVideoUrl) {
      setBackgroundVideoUrl(storedVideoUrl);
    }
  }, []);

  return (
    <main className="flex flex-col h-[100dvh] w-screen overflow-hidden bg-background">
      <div className="relative flex-grow">
        <MainViewport
          data={data}
          backgroundVideoUrl={backgroundVideoUrl || undefined}
        />
        <TelemetrySidebar
          data={data}
          sensorStatus={sensorStatus}
          onSensorToggle={handleSensorToggle}
        />
      </div>
      <ControlPanel
        onRecord={handleRecord}
        onTakePicture={handleTakePicture}
        onSurface={handleSurface}
        isRecording={isRecording}
        recordingTime={recordingTime}
        onMove={handleMove}
      />
    </main>
  );
}
