import { useState, useCallback, useEffect, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isBefore, isSameDay, format, addDays, subDays, differenceInCalendarDays } from "date-fns";
import CalendarHero from "./CalendarHero";
import CalendarGrid from "./CalendarGrid";
import NotesArea from "./NotesArea";
import SpiralBinding from "./SpiralBinding";
import MiniYearNav from "./MiniYearNav";
import PageCurl from "./PageCurl";
import { getHolidaysForMonth } from "@/lib/holidays";
import { CalendarDays, MapPin, Undo2 } from "lucide-react";

const ParticleBackground = lazy(() => import("./ParticleBackground"));

const WallCalendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [focusedDate, setFocusedDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState(0);
  const calendarRef = useRef<HTMLDivElement>(null);

  const goToMonth = useCallback(
    (delta: number) => {
      setDirection(delta);
      let newMonth = currentMonth + delta;
      let newYear = currentYear;
      if (newMonth > 11) { newMonth = 0; newYear++; }
      else if (newMonth < 0) { newMonth = 11; newYear--; }
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    },
    [currentMonth, currentYear]
  );

  const jumpToMonth = useCallback(
    (month: number) => {
      setDirection(month > currentMonth ? 1 : -1);
      setCurrentMonth(month);
    },
    [currentMonth]
  );

  const handleDateClick = useCallback(
    (date: Date) => {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(date);
        setRangeEnd(null);
      } else {
        if (isSameDay(date, rangeStart)) {
          setRangeEnd(date);
        } else if (isBefore(date, rangeStart)) {
          setRangeEnd(rangeStart);
          setRangeStart(date);
        } else {
          setRangeEnd(date);
        }
      }
      setFocusedDate(date);
    },
    [rangeStart, rangeEnd]
  );

  const goToToday = () => {
    setDirection(today.getMonth() > currentMonth ? 1 : -1);
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setFocusedDate(today);
  };

  const clearSelection = () => {
    setRangeStart(null);
    setRangeEnd(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!calendarRef.current?.contains(document.activeElement) && document.activeElement !== document.body) return;

      const base = focusedDate ?? new Date(currentYear, currentMonth, 1);
      let next: Date | null = null;

      switch (e.key) {
        case "ArrowRight": next = addDays(base, 1); break;
        case "ArrowLeft": next = subDays(base, 1); break;
        case "ArrowDown": next = addDays(base, 7); break;
        case "ArrowUp": next = subDays(base, 7); break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedDate) handleDateClick(focusedDate);
          return;
        case "Escape":
          clearSelection();
          return;
        default: return;
      }

      e.preventDefault();
      if (next) {
        if (next.getMonth() !== currentMonth || next.getFullYear() !== currentYear) {
          setDirection(next > base ? 1 : -1);
          setCurrentMonth(next.getMonth());
          setCurrentYear(next.getFullYear());
        }
        setFocusedDate(next);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedDate, currentMonth, currentYear, handleDateClick]);

  const holidays = getHolidaysForMonth(currentMonth);
  const rangeDays = rangeStart && rangeEnd
    ? Math.abs(differenceInCalendarDays(rangeEnd, rangeStart)) + 1
    : null;

  return (
    <>
      {/* 3D Particle Background */}
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>

      <div
        className="min-h-screen flex items-start md:items-center justify-center p-3 md:p-8 relative z-10"
        ref={calendarRef}
        tabIndex={-1}
      >
        <div className="flex gap-4 items-start w-full max-w-lg md:max-w-2xl lg:max-w-3xl justify-center">
          {/* Main calendar */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-lg md:max-w-2xl relative"
            style={{ perspective: "1200px" }}
          >
            {/* Paper texture overlay */}
            <div
              className="absolute inset-0 rounded-xl pointer-events-none z-10 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Calendar card */}
            <div className="bg-card/95 backdrop-blur-sm rounded-xl shadow-[0_25px_80px_-20px_hsl(var(--calendar-shadow)/0.5),0_4px_6px_-2px_hsl(var(--calendar-shadow)/0.15)] overflow-hidden relative">
              <SpiralBinding count={13} />
              <CalendarHero
                month={currentMonth}
                year={currentYear}
                direction={direction}
                onPrevMonth={() => goToMonth(-1)}
                onNextMonth={() => goToMonth(1)}
              />

              {/* Selection bar */}
              <AnimatePresence>
                {(rangeStart || rangeEnd) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 md:px-6 py-2.5 bg-calendar-range/60 backdrop-blur-sm flex items-center justify-between text-xs font-body border-b border-calendar-accent/10"
                  >
                    <div className="flex items-center gap-2 text-foreground">
                      <CalendarDays className="w-3.5 h-3.5 text-calendar-accent" />
                      {rangeStart && (
                        <span className="font-medium">
                          {format(rangeStart, "MMM d, yyyy")}
                          {rangeEnd && !isSameDay(rangeStart, rangeEnd) && (
                            <span className="text-calendar-accent font-bold"> → </span>
                          )}
                          {rangeEnd && !isSameDay(rangeStart, rangeEnd) && format(rangeEnd, "MMM d, yyyy")}
                          {!rangeEnd && (
                            <span className="text-muted-foreground ml-1 animate-pulse">pick end date...</span>
                          )}
                        </span>
                      )}
                      {rangeDays && rangeDays > 1 && (
                        <span className="bg-calendar-accent text-primary-foreground px-1.5 py-0.5 rounded-md font-bold text-[10px]">
                          {rangeDays} days
                        </span>
                      )}
                    </div>
                    <button
                      onClick={clearSelection}
                      className="text-muted-foreground hover:text-destructive transition-colors font-semibold flex items-center gap-1"
                    >
                      <Undo2 className="w-3 h-3" />
                      Clear
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Today button */}
              <div className="px-4 md:px-6 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {holidays.length > 0 && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-calendar-accent" />
                      <div className="flex gap-1 flex-wrap">
                        {holidays.slice(0, 3).map((h) => (
                          <span
                            key={h.date}
                            className="text-[10px] font-body bg-calendar-accent-light text-foreground px-1.5 py-0.5 rounded-full font-medium"
                          >
                            {h.emoji} {h.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <motion.button
                  onClick={goToToday}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[10px] font-body font-bold text-calendar-accent border border-calendar-accent/30 px-2 py-1 rounded-md hover:bg-calendar-accent/10 transition-colors tracking-wider uppercase"
                >
                  Today
                </motion.button>
              </div>

              <CalendarGrid
                month={currentMonth}
                year={currentYear}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onDateClick={handleDateClick}
                onDateHover={setHoveredDate}
                hoveredDate={hoveredDate}
                focusedDate={focusedDate}
              />

              <NotesArea
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                month={currentMonth}
                year={currentYear}
              />

              <PageCurl />
            </div>

            {/* Keyboard hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex items-center justify-center gap-4 mt-4 text-[10px] text-muted-foreground/60 font-body"
            >
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[9px] font-mono border border-border shadow-sm">←→↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[9px] font-mono border border-border shadow-sm">Enter</kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-[9px] font-mono border border-border shadow-sm">Esc</kbd>
                clear
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <span>🖱️ drag</span>
                range
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <span>🎤 voice</span>
                notes
              </span>
            </motion.div>
          </motion.div>

          {/* Mini year navigator */}
          <MiniYearNav
            currentMonth={currentMonth}
            currentYear={currentYear}
            onSelectMonth={jumpToMonth}
          />
        </div>
      </div>
    </>
  );
};

export default WallCalendar;
