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
    <div className="flex gap-4">
      <div className="bg-linear-to-br from-orange-500 to-red-700 text-white px-4 py-2 rounded-2xl shadow-lg flex flex-col items-center">
        <span className="text-xs opacity-80 uppercase">Score</span>

        <motion.span
          key={pts}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25 }}
          className="text-xl font-bold"
        >
          {formatNumber(pts)}
        </motion.span>
      </div>

      <div className="bg-linear-to-br from-indigo-500 to-blue-700 text-white px-4 py-2 rounded-2xl shadow-lg flex flex-col items-center">
        <span className="text-xs opacity-80 uppercase">Streak</span>

        <span className="text-xl font-bold">🔥 {streak}</span>
      </div>
    </div>
  );
}
