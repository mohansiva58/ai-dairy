import { useMemo, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  startOfMonth,
  getDay,
  getDaysInMonth,
  isSameDay,
  isToday,
  isAfter,
  isBefore,
  differenceInCalendarDays,
} from "date-fns";
import { getHolidayForDate } from "@/lib/holidays";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CalendarGridProps {
  month: number;
  year: number;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
  hoveredDate: Date | null;
  focusedDate: Date | null;
}

const DAY_HEADERS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const CalendarGrid = ({
  month,
  year,
  rangeStart,
  rangeEnd,
  onDateClick,
  onDateHover,
  hoveredDate,
  focusedDate,
}: CalendarGridProps) => {
  const firstDay = startOfMonth(new Date(year, month));
  const totalDays = getDaysInMonth(firstDay);
  const startOffset = (getDay(firstDay) + 6) % 7;
  const prevMonthDays = getDaysInMonth(new Date(year, month - 1));
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<Date | null>(null);

  const cells = useMemo(() => {
    const arr: { day: number; inMonth: boolean; date: Date }[] = [];
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      arr.push({ day: d, inMonth: false, date: new Date(year, month - 1, d) });
    }
    for (let d = 1; d <= totalDays; d++) {
      arr.push({ day: d, inMonth: true, date: new Date(year, month, d) });
    }
    const remainder = arr.length % 7;
    if (remainder > 0) {
      for (let d = 1; d <= 7 - remainder; d++) {
        arr.push({ day: d, inMonth: false, date: new Date(year, month + 1, d) });
      }
    }
    return arr;
  }, [month, year, startOffset, totalDays, prevMonthDays]);

  const getEffectiveEnd = useCallback(() => {
    return rangeEnd ?? hoveredDate;
  }, [rangeEnd, hoveredDate]);

  const isInRange = useCallback((date: Date) => {
    if (!rangeStart) return false;
    const end = getEffectiveEnd();
    if (!end) return false;
    const [s, e] = isBefore(rangeStart, end) ? [rangeStart, end] : [end, rangeStart];
    return isAfter(date, s) && isBefore(date, e);
  }, [rangeStart, getEffectiveEnd]);

  const isRangeEdge = useCallback((date: Date) => {
    const end = getEffectiveEnd();
    if (rangeStart && isSameDay(date, rangeStart)) return "start";
    if (end && isSameDay(date, end)) return "end";
    return null;
  }, [rangeStart, getEffectiveEnd]);

  // Drag to select
  const handlePointerDown = (date: Date) => {
    if (!date) return;
    setIsDragging(true);
    dragStartRef.current = date;
    onDateClick(date);
  };

  const handlePointerEnter = (date: Date) => {
    onDateHover(date);
    if (isDragging && dragStartRef.current && rangeStart && !rangeEnd) {
      // Live drag preview is handled by hoveredDate
    }
  };

  const handlePointerUp = (date: Date) => {
    if (isDragging && dragStartRef.current && !isSameDay(date, dragStartRef.current)) {
      onDateClick(date);
    }
    setIsDragging(false);
    dragStartRef.current = null;
  };

  return (
    <div className="px-3 md:px-6 pb-4 pt-2 select-none">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[10px] md:text-xs font-body font-bold tracking-[0.15em] py-2 uppercase ${
              i >= 5 ? "text-calendar-weekend" : "text-muted-foreground/70"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Separator line */}
      <div className="h-[1px] bg-border mb-2" />

      {/* Date cells */}
      <div
        className="grid grid-cols-7"
        onPointerLeave={() => {
          if (isDragging) {
            setIsDragging(false);
            dragStartRef.current = null;
          }
        }}
      >
        <AnimatePresence mode="popLayout">
          {cells.map((cell, idx) => {
            const today = isToday(cell.date);
            const inRange = cell.inMonth && isInRange(cell.date);
            const edge = cell.inMonth ? isRangeEdge(cell.date) : null;
            const holiday = cell.inMonth ? getHolidayForDate(month, cell.day) : undefined;
            const isWeekend = idx % 7 >= 5;
            const isFocused = focusedDate && isSameDay(cell.date, focusedDate);
            const row = Math.floor(idx / 7);
            const col = idx % 7;

            // Position in range for rounded corners
            const isRangeStart = edge === "start";
            const isRangeEnd = edge === "end";

            const dayContent = (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: row * 0.04 + col * 0.02, duration: 0.3 }}
                onPointerDown={(e) => {
                  if (cell.inMonth) {
                    e.preventDefault();
                    handlePointerDown(cell.date);
                  }
                }}
                onPointerEnter={() => cell.inMonth && handlePointerEnter(cell.date)}
                onPointerUp={() => cell.inMonth && handlePointerUp(cell.date)}
                className={`
                  relative flex flex-col items-center justify-center h-10 md:h-12 cursor-pointer transition-colors duration-100 font-body
                  ${!cell.inMonth ? "text-muted-foreground/25 cursor-default" : ""}
                  ${inRange && !edge ? "bg-calendar-range" : ""}
                  ${isRangeStart ? "rounded-l-full" : ""}
                  ${isRangeEnd ? "rounded-r-full" : ""}
                  ${cell.inMonth && !edge && !inRange ? "hover:bg-calendar-hover rounded-lg" : ""}
                `}
              >
                {/* Range connector behind edges */}
                {isRangeStart && (
                  <div className="absolute inset-y-0 right-0 left-1/2 bg-calendar-range -z-0" />
                )}
                {isRangeEnd && (
                  <div className="absolute inset-y-0 left-0 right-1/2 bg-calendar-range -z-0" />
                )}

                {/* Edge circle */}
                {edge && (
                  <motion.div
                    layoutId={`edge-${edge}`}
                    className="absolute w-9 h-9 md:w-10 md:h-10 rounded-full bg-calendar-range-edge shadow-[0_2px_8px_hsl(var(--calendar-accent)/0.4)]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  />
                )}

                {/* Today indicator */}
                {today && !edge && (
                  <motion.div
                    className="absolute w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-calendar-today shadow-[0_0_8px_hsl(var(--calendar-today)/0.3)]"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  />
                )}

                {/* Keyboard focus ring */}
                {isFocused && !edge && (
                  <div className="absolute w-9 h-9 md:w-10 md:h-10 rounded-full ring-2 ring-ring ring-offset-1 ring-offset-card" />
                )}

                {/* Day number */}
                <span
                  className={`
                    relative z-10 text-sm md:text-base leading-none
                    ${edge ? "text-primary-foreground font-bold" : ""}
                    ${!cell.inMonth ? "" : isWeekend && !edge ? "text-calendar-weekend font-semibold" : ""}
                    ${cell.inMonth && !edge && !isWeekend ? "text-foreground font-medium" : ""}
                    ${today && !edge ? "font-bold" : ""}
                  `}
                >
                  {cell.day}
                </span>

                {/* Holiday indicator */}
                {holiday && (
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-0.5 -right-0.5 text-[11px] leading-none z-20 drop-shadow-sm"
                  >
                    {holiday.emoji}
                  </motion.span>
                )}

                {/* Subtle dot for events/holidays */}
                {holiday && (
                  <div className="absolute bottom-1 w-1 h-1 rounded-full bg-calendar-accent z-10" />
                )}
              </motion.div>
            );

            if (holiday) {
              return (
                <Tooltip key={`${month}-${idx}`}>
                  <TooltipTrigger asChild>{dayContent}</TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="text-xs font-body bg-foreground text-card px-3 py-1.5 rounded-lg shadow-xl"
                  >
                    <span className="mr-1">{holiday.emoji}</span>
                    {holiday.name}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={`${month}-${idx}`}>{dayContent}</div>;
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CalendarGrid;
