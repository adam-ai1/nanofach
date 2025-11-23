'use client';

import type { FC } from 'react';
import type { NanoFishData, SensorStatus } from '@/app/page';
import {
  Thermometer,
  Droplets,
  Gauge,
  Wifi,
  Video,
  Ruler,
  AlertTriangle,
  Power,
  Upload,
  Link as LinkIcon,
  RefreshCw,
} from 'lucide-react';
import DataCard from '@/components/dashboard/data-card';
import CircularProgress from '@/components/dashboard/circular-progress';
import { Icons } from '@/components/icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { LanguageContext } from '@/context/language-context';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

interface TelemetrySidebarProps {
  data: NanoFishData;
  sensorStatus: SensorStatus;
  onSensorToggle: (sensorId: keyof SensorStatus, checked: boolean) => void;
  backgroundVideoUrl: string;
  defaultBackgroundVideoUrl: string;
  onBackgroundVideoUrlChange: (url: string) => void;
  onBackgroundVideoFileChange: (file: File) => Promise<boolean>;
  onResetBackgroundVideo: () => void;
}

const wifiNetworks = ['Home-Wifi', 'Public-Hotspot', 'NanoFish-AP', 'AndroidAP'];

const TelemetrySidebar: FC<TelemetrySidebarProps> = ({
  data,
  sensorStatus,
  onSensorToggle,
  backgroundVideoUrl,
  defaultBackgroundVideoUrl,
  onBackgroundVideoUrlChange,
  onBackgroundVideoFileChange,
  onResetBackgroundVideo,
}) => {
  const { t, language, setLanguage } = useContext(LanguageContext);
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState(backgroundVideoUrl);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setVideoUrlInput(backgroundVideoUrl);
  }, [backgroundVideoUrl]);

  const handleConnect = (network: string) => {
    if (network === 'NanoFish-AP') {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setPopoverOpen(false);
        toast({
          title: t.toasts.connection.title,
          description: t.toasts.connection.description,
        });
      }, 2000);
    } else {
      toast({
        variant: 'destructive',
        title: t.toasts.connection.failedTitle,
        description: t.toasts.connection.failedDescription,
      });
    }
  };

  const handleApplyVideoUrl = () => {
    const trimmed = videoUrlInput.trim();
    if (!trimmed) return;
    onBackgroundVideoUrlChange(trimmed);
    toast({
      title: t.telemetry.video.updatedTitle,
      description: t.telemetry.video.urlApplied,
    });
  };

  const handleVideoFile = async (file: File) => {
    const persisted = await onBackgroundVideoFileChange(file);
    toast({
      title: t.telemetry.video.updatedTitle,
      description: persisted
        ? t.telemetry.video.localAppliedPersistent
        : t.telemetry.video.localAppliedTemporary,
    });
    if (!persisted) {
      toast({
        variant: 'destructive',
        title: t.telemetry.video.oversizeTitle,
        description: t.telemetry.video.oversizeDescription,
      });
    }
  };

  const handleResetVideo = () => {
    onResetBackgroundVideo();
    setVideoUrlInput(defaultBackgroundVideoUrl);
    toast({
      title: t.telemetry.video.resetTitle,
      description: t.telemetry.video.resetDescription,
    });
  };

  const sensorControls: { id: keyof SensorStatus; label: string; icon: FC<any> }[] = [
    { id: 'camera', label: t.telemetry.sensors.camera, icon: Video },
    { id: 'sonar', label: t.telemetry.sensors.sonar, icon: Ruler },
    { id: 'temp', label: t.telemetry.sensors.temp, icon: Thermometer },
    { id: 'ph', label: t.telemetry.sensors.ph, icon: Droplets },
    { id: 'pressure', label: t.telemetry.sensors.pressure, icon: Gauge },
    { id: 'leak', label: t.telemetry.sensors.leak, icon: AlertTriangle },
  ];

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <aside
      dir={direction}
      className={`absolute top-0 h-full w-[280px] md:w-[320px] lg:w-[350px] p-4 sm:p-6 lg:p-8 z-10 flex flex-col gap-4 bg-black/30 backdrop-blur-xl shadow-[0_0_30px_hsl(var(--primary)/0.2)] ${
        language === 'ar' ? 'left-0 border-r' : 'right-0 border-l'
      } border-primary/20`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary tracking-widest">
          {t.telemetry.title}
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setLanguage('en')}
            variant={language === 'en' ? 'secondary' : 'outline'}
            size="sm"
            className="text-xs px-2 h-7"
          >
            EN
          </Button>
          <Button
            onClick={() => setLanguage('ar')}
            variant={language === 'ar' ? 'secondary' : 'outline'}
            size="sm"
            className="text-xs px-2 h-7"
          >
            AR
          </Button>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
         {data.leakDetected ? (
          <div className="flex items-center gap-3 p-3 rounded-md bg-destructive/20 border border-destructive text-destructive animate-pulse">
            <AlertTriangle className="h-6 w-6" />
            <div className="flex-grow">
              <p className="font-bold text-lg">{t.telemetry.leak.title}</p>
              <p className="text-sm">{t.telemetry.leak.description}</p>
            </div>
          </div>
        ) : (
          <DataCard
            icon={<AlertTriangle className="text-gray-500" />}
            label={t.telemetry.leak.title}
            value={t.telemetry.leak.noLeak}
            unit=""
          />
        )}
        <DataCard
          icon={<Thermometer className="text-orange-400" />}
          label={t.telemetry.temperature}
          value={data.temperature.toFixed(1)}
          unit="°C"
        />
        <DataCard
          icon={<Droplets className="text-green-400" />}
          label={t.telemetry.acidity}
          value={data.ph.toFixed(1)}
          unit=""
        />
        <DataCard
          icon={<Gauge className="text-purple-400" />}
          label={t.telemetry.pressure}
          value={data.pressure.toFixed(0)}
          unit="mbar"
        />
      </div>

      <Separator className="my-2" />

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-primary/80">
          {t.telemetry.sensorControl}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {sensorControls.map((sensor) => (
            <button
              key={sensor.id}
              onClick={() => onSensorToggle(sensor.id, !sensorStatus[sensor.id])}
              className={cn(
                'flex flex-col items-center justify-center gap-2 p-3 rounded-lg aspect-square transition-all border-2',
                sensorStatus[sensor.id]
                  ? 'bg-primary/20 border-primary/50 text-primary-foreground shadow-[0_0_10px_hsl(var(--primary)/0.3)]'
                  : 'bg-black/20 border-border/50 text-muted-foreground hover:bg-black/40 hover:border-border'
              )}
            >
              <sensor.icon className="h-6 w-6" />
              <span className="text-xs font-medium text-center">{sensor.label}</span>
              <div className={cn("w-2 h-2 rounded-full", sensorStatus[sensor.id] ? 'bg-accent animate-pulse' : 'bg-gray-600')}></div>
            </button>
          ))}
        </div>
      </div>

      <Separator className="my-2" />

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-primary/80">
          {t.telemetry.connectivity.title}
        </h3>
        <div className="p-4 bg-black/20 rounded-lg border border-border flex flex-col gap-4">
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-1">
              <Icons.wifi
                strength={data.connection}
                className="h-8 w-8 text-accent"
              />
              <span className="text-xs text-muted-foreground">
                {t.telemetry.connection}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularProgress value={data.battery} />
              <span className="text-xs text-muted-foreground">
                {t.telemetry.battery}
              </span>
            </div>
          </div>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button disabled={isConnecting}>
                <Wifi className="h-4 w-4" />
                <span>{t.telemetry.connectivity.connectButton}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end">
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-sm">{t.telemetry.connectivity.availableNetworks}</p>
                {wifiNetworks.map((net) => (
                  <Button
                    key={net}
                    variant="ghost"
                    className="justify-start gap-2"
                  onClick={() => handleConnect(net)}
                  disabled={isConnecting && net === 'NanoFish-AP'}
                >
                  <Wifi size={16} />
                  <span>{net}</span>
                  {isConnecting && net === 'NanoFish-AP' && (
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse ml-auto" />
                  )}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        </div>
      </div>

      <Separator className="my-2" />

      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-primary/80">
          {t.telemetry.video.title}
        </h3>
        <div className="p-4 bg-black/20 rounded-lg border border-border flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="background-video-url" className="text-xs text-muted-foreground">
              {t.telemetry.video.urlLabel}
            </Label>
            <div className="flex gap-2">
              <Input
                id="background-video-url"
                placeholder={t.telemetry.video.urlPlaceholder}
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
              />
              <Button onClick={handleApplyVideoUrl} disabled={!videoUrlInput.trim()}>
                <LinkIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.telemetry.video.applyUrl}</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t.telemetry.video.urlHelp}</p>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              {t.telemetry.video.localLabel}
            </Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                await handleVideoFile(file);
                event.target.value = '';
              }}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 min-w-[140px]"
              >
                <Upload className="h-4 w-4" />
                <span className="ml-2">{t.telemetry.video.chooseFile}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetVideo}
                className="min-w-[120px]"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="ml-2">{t.telemetry.video.resetButton}</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t.telemetry.video.localHelp}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default TelemetrySidebar;
