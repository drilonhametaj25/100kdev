"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  expiresAt: string | null;
  onExpired?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeLeft(expiresAt: string): TimeLeft {
  const difference = new Date(expiresAt).getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  };
}

export function CountdownTimer({ expiresAt, onExpired }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const initial = calculateTimeLeft(expiresAt);
    setTimeLeft(initial);
    setIsExpired(initial.total <= 0);

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(expiresAt);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total <= 0) {
        setIsExpired(true);
        onExpired?.();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpired]);

  if (!expiresAt) return null;

  if (timeLeft === null) {
    return (
      <div className="flex items-center gap-2 text-white/50 font-mono">
        <span className="animate-pulse">Loading...</span>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="flex flex-col items-center p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <span className="text-red-400 font-mono font-bold text-lg">
          Offerta Scaduta
        </span>
        <span className="text-white/50 text-sm mt-1">
          This offer has expired
        </span>
      </div>
    );
  }

  const timeBlocks = [
    { value: timeLeft.days, label: "days" },
    { value: timeLeft.hours, label: "hrs" },
    { value: timeLeft.minutes, label: "min" },
    { value: timeLeft.seconds, label: "sec" },
  ];

  const displayBlocks = timeLeft.days > 0 ? timeBlocks : timeBlocks.slice(1);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-3">
        <span
          className="w-2 h-2 rounded-full live-pulse"
          style={{ backgroundColor: "#a855f7" }}
        />
        <span className="text-sm font-mono uppercase tracking-wider text-white/70">
          Time remaining
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {displayBlocks.map((block, index) => (
          <div key={block.label} className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center">
              <span
                className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold glow-purple"
                style={{ color: "#a855f7" }}
              >
                {String(block.value).padStart(2, "0")}
              </span>
              <span className="text-xs text-white/40 uppercase mt-1">
                {block.label}
              </span>
            </div>
            {index < displayBlocks.length - 1 && (
              <span className="text-2xl sm:text-3xl font-mono font-bold text-white/30">
                :
              </span>
            )}
          </div>
        ))}
      </div>

      {timeLeft.total < 60 * 60 * 1000 && (
        <div className="mt-4 px-4 py-2 bg-price-social/20 rounded-full">
          <span className="text-price-social font-mono text-sm font-bold animate-pulse">
            HURRY! Less than 1 hour left
          </span>
        </div>
      )}
    </div>
  );
}
