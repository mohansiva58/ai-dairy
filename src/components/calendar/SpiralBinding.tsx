import { motion } from "framer-motion";

interface SpiralBindingProps {
  count?: number;
}

const SpiralBinding = ({ count = 15 }: SpiralBindingProps) => {
  return (
    <div className="relative w-full h-10 flex items-center justify-center z-20 bg-transparent">
      {/* Wire rod behind spirals */}
      <div className="absolute inset-x-8 top-[55%] h-[3px] bg-gradient-to-r from-transparent via-calendar-spiral/40 to-transparent -translate-y-1/2 rounded-full" />
      
      <div className="flex justify-between w-full px-8">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ rotateX: -180, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ delay: i * 0.03, duration: 0.4, type: "spring", stiffness: 200 }}
            className="relative"
            style={{ perspective: "100px" }}
          >
            {/* Shadow under spiral */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 rounded-full bg-foreground/10 blur-[2px]" />
            {/* Spiral ring - more realistic with gradient */}
            <div className="w-5 h-7 rounded-full border-[2.5px] border-calendar-spiral/70 bg-gradient-to-b from-secondary/90 via-muted to-secondary shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_2px_4px_rgba(0,0,0,0.1)]" />
            {/* Highlight on ring */}
            <div className="absolute top-[3px] left-[4px] w-[6px] h-[3px] rounded-full bg-card/60" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SpiralBinding;
