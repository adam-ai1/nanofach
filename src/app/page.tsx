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
  fishPosition: { x: number; y: number; z: number; orientation: number };
  fishOrientation: { yaw: number; pitch: number; roll: number };
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
const MAX_PERSISTABLE_VIDEO_BYTES = 4.5 * 1024 * 1024;
const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Unsupported file result.'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });

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
    fishPosition: { x: 0, y: 0, z: 0, orientation: 0 },
    fishOrientation: { yaw: 0, pitch: 0, roll: 0 },
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const objectUrlRef = useRef<string | null>(null);
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
        fishPosition: {
          x: Math.max(-60, Math.min(60, prev.fishPosition.x + (Math.random() - 0.5) * 4)),
          y: Math.max(-40, Math.min(40, prev.fishPosition.y + (Math.random() - 0.5) * 3)),
          z: Math.max(-30, Math.min(30, prev.fishPosition.z + (Math.random() - 0.5) * 3)),
          orientation: prev.fishPosition.orientation,
        },
        fishOrientation: {
          yaw: (prev.fishOrientation.yaw + (Math.random() - 0.5) * 8 + 360) % 360,
          pitch: Math.max(-25, Math.min(25, prev.fishOrientation.pitch + (Math.random() - 0.5) * 4)),
          roll: Math.max(-20, Math.min(20, prev.fishOrientation.roll + (Math.random() - 0.5) * 3)),
        },
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
        fishOrientation: {
          ...prev.fishOrientation,
          yaw: direction === 'forward' ? 0 : 180,
          roll: Math.max(-15, Math.min(15, prev.fishOrientation.roll + (direction === 'forward' ? 3 : -3))),
        },
      };
    });
  };

  const handleAscend = () => {
    setData((prev) => {
      const newZ = Math.min(50, prev.fishPosition.z + 5);
      return {
        ...prev,
        fishPosition: { ...prev.fishPosition, z: newZ },
      };
    });
  };

  const handleDescend = () => {
    setData((prev) => {
      const newZ = Math.max(-50, prev.fishPosition.z - 5);
      return {
        ...prev,
        fishPosition: { ...prev.fishPosition, z: newZ },
      };
    });
  };

  const handleRotate = (direction: 'left' | 'right') => {
    setData((prev) => {
      const delta = direction === 'left' ? -15 : 15;
      const orientation = (prev.fishPosition.orientation + delta + 360) % 360;
      return {
        ...prev,
        fishPosition: { ...prev.fishPosition, orientation },
      };
    });
  };

  useEffect(() => {
    const storedVideoUrl = localStorage.getItem(LOCAL_BACKGROUND_VIDEO_KEY);
    if (storedVideoUrl) {
      setBackgroundVideoUrl(storedVideoUrl);
    }
  }, []);
 codex/check-for-errors-in-project-ivrcrk

  useEffect(
    () => () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    },
    []
  );

  const persistBackgroundVideo = (value: string | null) => {
    if (value) {
      localStorage.setItem(LOCAL_BACKGROUND_VIDEO_KEY, value);
    } else {
      localStorage.removeItem(LOCAL_BACKGROUND_VIDEO_KEY);
    }
  };

  const handleBackgroundVideoUrlChange = (url: string) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setBackgroundVideoUrl(url);
    persistBackgroundVideo(url);
  };

  const handleBackgroundVideoFileChange = async (file: File) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setBackgroundVideoUrl(objectUrl);

    if (file.size <= MAX_PERSISTABLE_VIDEO_BYTES) {
      try {
        const dataUrl = await fileToDataUrl(file);
        persistBackgroundVideo(dataUrl);
        return true;
      } catch (error) {
        persistBackgroundVideo(null);
        return false;
      }
    }

    persistBackgroundVideo(null);
    return false;
  };

  const handleResetBackgroundVideo = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setBackgroundVideoUrl(DEFAULT_BACKGROUND_VIDEO_URL);
    persistBackgroundVideo(DEFAULT_BACKGROUND_VIDEO_URL);
  };
 main

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
          backgroundVideoUrl={backgroundVideoUrl}
          defaultBackgroundVideoUrl={DEFAULT_BACKGROUND_VIDEO_URL}
          onBackgroundVideoUrlChange={handleBackgroundVideoUrlChange}
          onBackgroundVideoFileChange={handleBackgroundVideoFileChange}
          onResetBackgroundVideo={handleResetBackgroundVideo}
        />
      </div>
      <ControlPanel
        onRecord={handleRecord}
        onTakePicture={handleTakePicture}
        onSurface={handleSurface}
        isRecording={isRecording}
        recordingTime={recordingTime}
        onMove={handleMove}
        onAscend={handleAscend}
        onDescend={handleDescend}
        onRotate={handleRotate}
      />
    </main>
  );
}
