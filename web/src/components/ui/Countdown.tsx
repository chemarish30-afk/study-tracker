'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CountdownProps {
  targetDate: Date;
  className?: string;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({ targetDate, className, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        setIsComplete(true);
        onComplete?.();
        clearInterval(timer);
      }
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (isComplete) {
    return (
      <div className={cn('text-center', className)}>
        <div className="text-2xl font-bold text-red-600">Exam Day!</div>
        <div className="text-sm text-gray-500">Good luck!</div>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-4 gap-4', className)}>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{timeLeft.days}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">Days</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{timeLeft.hours}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">Hours</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{timeLeft.minutes}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">Minutes</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{timeLeft.seconds}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">Seconds</div>
      </div>
    </div>
  );
}

