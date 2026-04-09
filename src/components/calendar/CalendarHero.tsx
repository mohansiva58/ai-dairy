import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMonthImage, MONTH_NAMES } from "@/lib/monthImages";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeroProps {
  month: number;
  year: number;
  direction: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHero = ({ month, year, direction, onPrevMonth, onNextMonth }: CalendarHeroProps) => {
  const imgSrc = getMonthImage(month);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0.5, y: 0.5 });
  }, []);

  // Parallax transform based on mouse
  const parallaxX = (mousePos.x - 0.5) * -20;
  const parallaxY = (mousePos.y - 0.5) * -10;

  // 3D flip variants
  const flipVariants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: "16/9", perspective: "1200px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={`${year}-${month}`}
          custom={direction}
          variants={flipVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
        >
          {/* Parallax image */}
          <motion.img
            src={imgSrc}
            alt={`${MONTH_NAMES[month]} landscape`}
            className="absolute inset-0 w-[110%] h-[110%] object-cover -left-[5%] -top-[5%]"
            width={1280}
            height={720}
            animate={{
              x: parallaxX,
              y: parallaxY,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 30 }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/30 to-transparent pointer-events-none" />

      {/* Diagonal decorative shape (like reference) */}
      <svg
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        viewBox="0 0 1200 150"
        preserveAspectRatio="none"
        style={{ height: "80px" }}
      >
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--calendar-header-gradient-start))" />
            <stop offset="100%" stopColor="hsl(var(--calendar-header-gradient-end))" />
          </linearGradient>
        </defs>
        <path
          d="M0,150 L0,100 Q200,40 500,80 T1000,50 L1200,30 L1200,150 Z"
          fill="url(#waveGrad)"
          opacity="0.85"
        />
        <path
          d="M0,150 L0,120 Q300,60 600,100 T1200,60 L1200,150 Z"
          fill="hsl(var(--calendar-bg))"
        />
      </svg>

      {/* Month/Year overlay */}
      <motion.div
        className="absolute bottom-6 right-6 text-right z-10 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        key={`text-${year}-${month}`}
      >
        <div className="text-primary-foreground/80 font-body text-base md:text-lg tracking-[0.3em] font-light">
          {year}
        </div>
        <h1 className="text-primary-foreground font-display text-3xl md:text-5xl font-black tracking-wide uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
          {MONTH_NAMES[month]}
        </h1>
      </motion.div>

      {/* Nav arrows - premium glass style */}
      <motion.button
        onClick={onPrevMonth}
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.9 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-card/20 backdrop-blur-md border border-card/20 hover:bg-card/40 transition-colors text-primary-foreground shadow-lg z-10"
        aria-label="Previous month"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
      <motion.button
        onClick={onNextMonth}
        whileHover={{ scale: 1.1, x: 2 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-card/20 backdrop-blur-md border border-card/20 hover:bg-card/40 transition-colors text-primary-foreground shadow-lg z-10"
        aria-label="Next month"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default CalendarHero;
