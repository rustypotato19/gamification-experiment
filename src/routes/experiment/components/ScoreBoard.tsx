import { motion } from "framer-motion";

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
  if (num >= 1000) return (num / 1000).toFixed(2) + "K";
  return num.toString();
}

type Props = {
  pts: number;
  streak: number;
};

export default function ScoreBoard({ pts, streak }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 min-w-0">
      {/* Score */}
      <div
        className="
        bg-linear-to-br from-orange-500 to-red-700
        text-white
        px-3 sm:px-4
        py-2
        rounded-2xl
        shadow-lg
        flex flex-col items-center
        min-w-22.5
      "
      >
        <span className="text-[10px] sm:text-xs opacity-80 uppercase tracking-wide">
          Score
        </span>

        <motion.span
          key={pts}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25 }}
          className="text-lg sm:text-xl font-bold tabular-nums"
        >
          {formatNumber(pts)}
        </motion.span>
      </div>

      {/* Streak */}
      <div
        className="
        bg-linear-to-br from-indigo-500 to-blue-700
        text-white
        px-3 sm:px-4
        py-2
        rounded-2xl
        shadow-lg
        flex flex-col items-center
        min-w-22.5
      "
      >
        <span className="text-[10px] sm:text-xs opacity-80 uppercase tracking-wide">
          Streak
        </span>

        <span className="text-lg sm:text-xl font-bold tabular-nums">
          🔥 {streak}
        </span>
      </div>
    </div>
  );
}
