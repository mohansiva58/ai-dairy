import { motion } from "framer-motion";

const PageCurl = () => {
  return (
    <motion.div
      className="absolute bottom-0 right-0 w-16 h-16 z-30 cursor-pointer group"
      whileHover={{ scale: 1.1 }}
      title="Page corner"
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        style={{ filter: "drop-shadow(-2px -2px 3px rgba(0,0,0,0.15))" }}
      >
        <defs>
          <linearGradient id="curlGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--muted))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
          <linearGradient id="curlShadow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Shadow under curl */}
        <path
          d="M64,64 L64,20 Q54,24 40,30 Q24,38 20,64 Z"
          fill="url(#curlShadow)"
          className="transition-all duration-300 group-hover:opacity-80"
        />
        {/* Curled page */}
        <motion.path
          d="M64,64 L64,24 Q56,28 44,33 Q28,42 24,64 Z"
          fill="url(#curlGrad)"
          className="transition-all duration-500"
          whileHover={{
            d: "M64,64 L64,16 Q52,22 36,30 Q18,42 16,64 Z",
          }}
        />
        {/* Fold line */}
        <path
          d="M64,24 Q50,30 24,64"
          fill="none"
          stroke="hsl(var(--foreground))"
          strokeOpacity="0.06"
          strokeWidth="0.5"
        />
      </svg>
    </motion.div>
  );
};

export default PageCurl;
