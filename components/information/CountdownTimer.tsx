"use client";

import { useState, useEffect, useCallback } from "react";
import { TimeRemaining, calculateTimeRemaining } from "@/types/information";

interface CountdownTimerProps {
  endDate: string;
  onExpire?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  variant?: "default" | "urgent" | "subtle";
}

interface TimeBlockProps {
  value: number;
  label: string;
  size: "sm" | "md" | "lg";
}

function TimeBlock({ value, label, size }: TimeBlockProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-sm",
    md: "w-16 h-16 text-lg",
    lg: "w-20 h-20 text-2xl",
  };

  const labelSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`
          ${sizeClasses[size]} 
          bg-gradient-to-br from-orange-500 to-amber-500 
          rounded-lg flex items-center justify-center 
          shadow-lg text-white font-bold
          relative overflow-hidden
        `}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
        <span className="relative z-10">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className={`${labelSizes[size]} text-gray-500 mt-1 uppercase tracking-wider`}>
        {label}
      </span>
    </div>
  );
}

function TimeSeparator({ size }: { size: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "text-xl mt-[-6px]",
    md: "text-2xl mt-[-8px]",
    lg: "text-3xl mt-[-10px]",
  };

  return (
    <span className={`${sizeClasses[size]} text-orange-500 font-bold`}>:</span>
  );
}

export default function CountdownTimer({
  endDate,
  onExpire,
  className = "",
  size = "md",
  showLabels = true,
  variant = "default",
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => 
    calculateTimeRemaining(endDate)
  );

  const handleExpire = useCallback(() => {
    if (onExpire) {
      onExpire();
    }
  }, [onExpire]);

  useEffect(() => {
    // Calculate immediately
    const initial = calculateTimeRemaining(endDate);
    setTimeRemaining(initial);
    
    if (initial.isExpired) {
      handleExpire();
      return;
    }

    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(endDate);
      setTimeRemaining(remaining);

      if (remaining.isExpired) {
        handleExpire();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate, handleExpire]);

  // Show expired state
  if (timeRemaining.isExpired) {
    return null;
  }

  // Variant styles
  const containerVariants = {
    default: "bg-transparent",
    urgent: "bg-red-50 rounded-xl p-4 border border-red-100",
    subtle: "bg-gray-50 rounded-lg p-3",
  };

  const urgentTextVariant = {
    default: "text-gray-900",
    urgent: "text-red-600",
    subtle: "text-gray-700",
  };

  return (
    <div className={`${containerVariants[variant]} ${className}`}>
      {variant === "urgent" && (
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-red-600">
            Ends soon!
          </span>
        </div>
      )}
      
      <div className="flex items-center justify-center gap-1">
        {timeRemaining.days > 0 && (
          <>
            <TimeBlock 
              value={timeRemaining.days} 
              label={showLabels ? "Days" : ""} 
              size={size} 
            />
            <TimeSeparator size={size} />
          </>
        )}
        
        <TimeBlock 
          value={timeRemaining.hours} 
          label={showLabels ? "Hours" : ""} 
          size={size} 
        />
        <TimeSeparator size={size} />
        
        <TimeBlock 
          value={timeRemaining.minutes} 
          label={showLabels ? "Mins" : ""} 
          size={size} 
        />
        <TimeSeparator size={size} />
        
        <TimeBlock 
          value={timeRemaining.seconds} 
          label={showLabels ? "Secs" : ""} 
          size={size} 
        />
      </div>

      {variant === "urgent" && timeRemaining.days === 0 && timeRemaining.hours < 6 && (
        <p className={`text-center text-sm mt-2 ${urgentTextVariant[variant]}`}>
          {timeRemaining.hours === 0 
            ? `Hurry! Only ${timeRemaining.minutes} minutes left!`
            : `Less than ${timeRemaining.hours} hours left!`
          }
        </p>
      )}
    </div>
  );
}

// Compact version for cards
export function CompactCountdown({ endDate, className = "" }: { endDate: string; className?: string }) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => 
    calculateTimeRemaining(endDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(endDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  if (timeRemaining.isExpired) {
    return null;
  }

  const isUrgent = timeRemaining.isExpiringSoon;

  return (
    <div 
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
        ${isUrgent 
          ? "bg-red-100 text-red-600" 
          : "bg-orange-100 text-orange-600"
        }
        ${className}
      `}
    >
      <svg 
        className="w-3 h-3" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <span>
        {timeRemaining.days > 0 && `${timeRemaining.days}d `}
        {String(timeRemaining.hours).padStart(2, "0")}:
        {String(timeRemaining.minutes).padStart(2, "0")}:
        {String(timeRemaining.seconds).padStart(2, "0")}
      </span>
    </div>
  );
}
