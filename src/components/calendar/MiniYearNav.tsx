import { getDaysInMonth, startOfMonth, getDay } from "date-fns";
import { motion } from "framer-motion";
import { MONTH_NAMES } from "@/lib/monthImages";

interface MiniYearNavProps {
  currentMonth: number;
  currentYear: number;
  onSelectMonth: (month: number) => void;
}

const MiniYearNav = ({ currentMonth, currentYear, onSelectMonth }: MiniYearNavProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="hidden lg:flex flex-col gap-1.5 w-24"
    >
      <div className="text-xs font-display font-bold text-foreground tracking-wider mb-1 text-center">
        {currentYear}
      </div>
      {MONTH_NAMES.map((name, i) => {
        const isActive = i === currentMonth;
        return (
          <motion.button
            key={name}
            onClick={() => onSelectMonth(i)}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.95 }}
            className={`
              text-[11px] font-body tracking-wider py-1.5 px-2.5 rounded-md text-left transition-all duration-200
              ${isActive
                ? "bg-calendar-accent text-primary-foreground font-bold shadow-[0_2px_8px_hsl(var(--calendar-accent)/0.3)]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }
            `}
          >
            {name.slice(0, 3).toUpperCase()}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default MiniYearNav;
