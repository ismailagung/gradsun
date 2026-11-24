"use client";

import { cn } from "cn";
import { Check, Clock, Lock, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";

export interface TimePickerControlLabels {
  sessionStartTimeLabel: string;
  hour: string;
  minute: string;
  period?: string;
  bufferTitle: string;
  bufferDesc: string;
  statusAvailable: string;
  statusConflict: string;
  statusDetail: string;
  conflictDetail: string;
  durationEst: string;
  bookedBadge: string;
  availableBadge: string;
  placeholder: string;
}

interface TimePickerControlProps {
  initialHour?: string;
  initialMinute?: string;
  initialHasSelected?: boolean;
  labels: TimePickerControlLabels;
}

// 24-hour format: 00 to 23
const HOURS_24 = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
];

const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

export function TimePickerControl({
  initialHour = "16",
  initialMinute = "30",
  initialHasSelected = false,
  labels,
}: TimePickerControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSelected, setHasSelected] = useState(initialHasSelected);
  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Studio hours: 08:00 - 18:00 WIB
  // Booked sessions:
  // - Adinda: 08:30 - 10:00 (510 - 600 min)
  // - Rayhan: 13:30 - 14:30 (810 - 870 min)
  const isTimeConflict = (hr: string, min: string) => {
    const hourNum = Number.parseInt(hr, 10);
    const minNum = Number.parseInt(min, 10);
    const totalMinutes = hourNum * 60 + minNum;

    // Check outside operating hours (08:00 to 18:00)
    if (totalMinutes < 8 * 60 || totalMinutes > 18 * 60) return true;

    // Adinda conflict: 08:30 to 10:00
    if (totalMinutes >= 510 && totalMinutes < 600) return true;

    // Rayhan conflict: 13:30 to 14:30
    if (totalMinutes >= 810 && totalMinutes < 870) return true;

    return false;
  };

  const isHourConflict = (hr: string) => {
    const hourNum = Number.parseInt(hr, 10);

    // Outside studio hours
    if (hourNum < 8 || hourNum > 18) return true;

    // Overlapping booked hours (08:30-10:00 & 13:30-14:30)
    if (hourNum === 8 || hourNum === 9 || hourNum === 13 || hourNum === 14) return true;

    return false;
  };

  const currentConflict = isTimeConflict(selectedHour, selectedMinute);
  const formattedTime = `${selectedHour}:${selectedMinute} WIB`;

  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left: Input Trigger & Floating Popover (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-1.5 relative">
          {/* Label matching screenshot */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-foreground tracking-wider uppercase font-serif">
              {labels.sessionStartTimeLabel}
            </span>
            <span className="text-destructive font-bold text-sm leading-none">{"*"}</span>
          </div>

          {/* Input Box Trigger (as in user screenshot) */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              "relative flex items-center justify-between h-10 w-full px-3.5 rounded-xl border border-border bg-card cursor-pointer select-none transition-all shadow-2xs hover:border-primary/50 text-foreground font-normal",
              isOpen && "border-primary ring-2 ring-primary/20",
            )}
          >
            <Clock className="size-4 text-muted-foreground shrink-0" />
            <span
              className={cn(
                "font-mono text-xs font-semibold tracking-wider",
                hasSelected ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {hasSelected ? formattedTime : "-- : --"}
            </span>
            <Clock className="size-4 text-muted-foreground shrink-0" />
          </Button>

          {/* Floating 2-Column 24-Hour Time Picker (ONLY opens when clicked!) */}
          {isOpen && (
            <div className="absolute z-50 top-full mt-2 left-0 w-64 rounded-2xl border border-border bg-card/95 backdrop-blur-md p-3 shadow-xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
                <span className="text-[11px] font-semibold text-foreground font-serif">
                  {labels.sessionStartTimeLabel}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setIsOpen(false)}
                  className="size-5 rounded-md text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </Button>
              </div>

              {/* 2 Columns: Hour (00-23) & Minute (00-55) */}
              <div className="grid grid-cols-2 gap-2">
                {/* Column 1: Hour (00-23) */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-center text-muted-foreground uppercase tracking-wider pb-1.5 border-b border-border/50">
                    {labels.hour}
                  </span>
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto py-1 pr-1">
                    {HOURS_24.map((hr) => {
                      const isSelected = selectedHour === hr;
                      const isBlocked = isHourConflict(hr);

                      return (
                        <Button
                          key={hr}
                          type="button"
                          variant={isSelected ? "default" : "ghost"}
                          size="sm"
                          onClick={() => {
                            setSelectedHour(hr);
                            setHasSelected(true);
                          }}
                          className={cn(
                            "h-8 w-full font-mono text-xs justify-center transition-colors",
                            isSelected &&
                              "bg-primary text-primary-foreground font-bold shadow-xs hover:bg-primary/90",
                            !isSelected && !isBlocked && "hover:bg-secondary text-foreground",
                            isBlocked &&
                              !isSelected &&
                              "line-through text-muted-foreground/40 hover:bg-muted/30 opacity-60",
                          )}
                        >
                          {hr}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Column 2: Minute (00-55) */}
                <div className="flex flex-col border-l border-border/50 pl-2">
                  <span className="text-[10px] font-semibold text-center text-muted-foreground uppercase tracking-wider pb-1.5 border-b border-border/50">
                    {labels.minute}
                  </span>
                  <div className="flex flex-col gap-1 max-h-48 overflow-y-auto py-1 pr-0.5">
                    {MINUTES.map((min) => {
                      const isSelected = selectedMinute === min;

                      return (
                        <Button
                          key={min}
                          type="button"
                          variant={isSelected ? "default" : "ghost"}
                          size="sm"
                          onClick={() => {
                            setSelectedMinute(min);
                            setHasSelected(true);
                          }}
                          className={cn(
                            "h-8 w-full font-mono text-xs justify-center transition-colors",
                            isSelected &&
                              "bg-primary text-primary-foreground font-bold shadow-xs hover:bg-primary/90",
                            !isSelected && "hover:bg-secondary text-foreground",
                          )}
                        >
                          {min}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Close / Apply button in popover */}
              <div className="pt-2 mt-2 border-t border-border/50">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-xs font-medium h-7"
                >
                  <Check className="size-3 mr-1" />
                  <span>{labels.availableBadge}</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Buffer Warning Callout & Confirmation Box (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-3">
          {/* Yellow Buffer Callout Box */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <Clock className="size-4 shrink-0" />
              <span className="text-xs font-bold font-serif">{labels.bufferTitle}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/80 dark:text-amber-200/80">
              {labels.bufferDesc}
            </p>
          </div>

          {/* Status Confirmation Box */}
          {hasSelected &&
            (currentConflict ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 flex flex-col gap-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-destructive">
                    <Lock className="size-4 shrink-0" />
                    <span className="text-xs font-bold font-serif">{labels.statusConflict}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-destructive/40 text-destructive"
                  >
                    {labels.bookedBadge}
                  </Badge>
                </div>
                <p className="text-[11px] leading-relaxed text-destructive/80">
                  {labels.conflictDetail}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex flex-col gap-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <Check className="size-4 shrink-0" />
                    <span className="text-xs font-bold font-serif">{labels.statusAvailable}</span>
                  </div>
                  <Badge className="text-[10px] bg-emerald-600 text-white dark:bg-emerald-500 font-semibold">
                    {labels.availableBadge}
                  </Badge>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-900/80 dark:text-emerald-200/80 font-medium">
                  {`${formattedTime} • `}
                  {labels.statusDetail}
                </p>
                <div className="pt-2 border-t border-emerald-500/20 flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-400">
                  <Sparkles className="size-3 shrink-0" />
                  <span>{labels.durationEst}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
