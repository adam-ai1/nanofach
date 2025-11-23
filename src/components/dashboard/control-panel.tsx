'use client';
import type { FC } from 'react';
import VirtualJoystick from '@/components/dashboard/virtual-joystick';
import { Button } from '@/components/ui/button';
import {
  ArrowDown,
  ArrowUp,
  Camera,
  RotateCcw,
  RotateCw,
  Video,
  ArrowUpCircle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useContext } from 'react';
import { LanguageContext } from '@/context/language-context';

interface ControlPanelProps {
  onRecord: () => void;
  onTakePicture: () => void;
  onSurface: () => void;
  isRecording: boolean;
  recordingTime: number;
  onMove: (direction: 'forward' | 'backward') => void;
  onAscend: () => void;
  onDescend: () => void;
  onRotate: (direction: 'left' | 'right') => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const ControlPanel: FC<ControlPanelProps> = ({
  onRecord,
  onTakePicture,
  onSurface,
  isRecording,
  recordingTime,
  onMove,
  onAscend,
  onDescend,
  onRotate,
}) => {
  const { t, language } = useContext(LanguageContext);
  const buttonStyle =
    'rounded-full w-14 h-14 bg-black/30 backdrop-blur-sm border-2 border-primary/50 text-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)] hover:bg-primary/20 hover:border-primary/80 transition-all';
  const smallButtonStyle = `${buttonStyle} w-12 h-12`;
  const recordingButtonStyle =
    'rounded-lg w-auto h-14 px-4 bg-destructive/80 backdrop-blur-sm border-2 border-destructive text-white shadow-[0_0_15px_hsl(var(--destructive)/0.5)] hover:bg-destructive/90 transition-all flex items-center gap-2';

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div
      dir={direction}
      className="flex-shrink-0 bg-black/30 backdrop-blur-sm border-t-2 border-primary/20 p-4 flex justify-center items-center gap-12"
    >
      <VirtualJoystick />
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2">
          <Button
            aria-label={t.controls.ascend}
            className={smallButtonStyle}
            onClick={onAscend}
          >
            <ArrowUp />
          </Button>
          <Button
            aria-label={t.controls.descend}
            className={smallButtonStyle}
            onClick={onDescend}
          >
            <ArrowDown />
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            aria-label="Move Forward"
            className={smallButtonStyle}
            onClick={() => onMove('forward')}
          >
            <ChevronUp />
          </Button>
          <Button
            aria-label="Move Backward"
            className={smallButtonStyle}
            onClick={() => onMove('backward')}
          >
            <ChevronDown />
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            aria-label={t.controls.rotateLeft}
            className={smallButtonStyle}
            onClick={() => onRotate('left')}
          >
            <RotateCcw />
          </Button>
          <Button
            aria-label={t.controls.rotateRight}
            className={smallButtonStyle}
            onClick={() => onRotate('right')}
          >
            <RotateCw />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {isRecording ? (
          <Button
            aria-label={t.controls.record}
            onClick={onRecord}
            className={recordingButtonStyle}
          >
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
            <span className="font-mono">{formatTime(recordingTime)}</span>
          </Button>
        ) : (
          <Button
            aria-label={t.controls.record}
            onClick={onRecord}
            className={buttonStyle}
          >
            <Video />
          </Button>
        )}
        <Button
          aria-label={t.controls.takePicture}
          onClick={onTakePicture}
          className={buttonStyle}
        >
          <Camera />
        </Button>
      </div>
      <Button
        aria-label={t.controls.surface}
        onClick={onSurface}
        className={`${buttonStyle} bg-destructive/30 border-destructive text-destructive shadow-[0_0_15px_hsl(var(--destructive)/0.5)] hover:bg-destructive/40 w-20 h-20`}
      >
        <ArrowUpCircle size={32} />
      </Button>
    </div>
  );
};

export default ControlPanel;
