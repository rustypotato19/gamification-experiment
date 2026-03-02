import confetti from "canvas-confetti";
import { useContext, useEffect, useState } from "react";
import TestContext from "../../TestContext";
import { motion } from "framer-motion";

function formatNumber(number: number) {
  if (number >= 1000000) return (number / 1000000).toFixed(2) + "M";
  if (number >= 1000) return (number / 1000).toFixed(2) + "K";
  return number.toLocaleString();
}

export default function Section2Finish() {
  const ctx = useContext(TestContext);
  const [nextDisabled, setNextDisabled] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setNextDisabled(false), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (ctx && ctx.testMilestonesType.section2EndTime === null) {
      ctx.testMilestonesType.setSection2EndTime(Date.now());
    }
  }, [ctx]);

  useEffect(() => {
    if (!ctx) return;

    const correct = ctx.testMilestonesType.section2Correct;
    const incorrect = ctx.testMilestonesType.section2Incorrect;
    const total = correct + incorrect;

    if (total > 0 && correct / total > 0.5) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 55,
          origin: { x: 0.01, y: 0.7 },
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 55,
          origin: { x: 0.99, y: 0.7 },
        });

        if (Date.now() < end) requestAnimationFrame(frame);
      };

      frame();
    }
  }, [ctx]);

  if (!ctx) return null;

  const {
    section2Pts,
    section2Streak,
    section2Correct,
    section2Incorrect,
    section2StartTime,
    section2EndTime,
  } = ctx.testMilestonesType;

  const total = section2Correct + section2Incorrect;
  const scorePercent =
    total > 0 ? Math.round((section2Correct / total) * 100) : 0;

  const rawTime =
    section2StartTime && section2EndTime
      ? section2EndTime - section2StartTime
      : 0;

  const seconds = Math.floor(rawTime / 1000);

  const timeTaken =
    seconds >= 3600
      ? `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m ${seconds % 60}s`
      : seconds >= 60
        ? `${Math.floor(seconds / 60)}m ${seconds % 60}s`
        : `${seconds}s`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl flex flex-col items-center text-center"
    >
      <h2 className="text-3xl font-bold mb-2">🎉 Section 2 Complete!</h2>

      <motion.div
        key={section2Pts}
        initial={{ scale: 1.4 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div className="text-5xl font-extrabold text-orange-500">
          +{formatNumber(section2Pts)} Points
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Total Points: {ctx.pts.toLocaleString()}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-6 w-full mb-10">
        <StatCard label="🔥 Streak Gained" value={section2Streak} />
        <StatCard label="📈 Total Streak" value={ctx.streak} />
        <StatCard label="⏱ Time Taken" value={`${timeTaken}`} />
        <StatCard label="🎯 Score" value={`${section2Correct}/${total}`} />
      </div>

      <div className="bg-orange-100 text-orange-700 px-6 py-3 rounded-full font-semibold shadow-sm">
        Accuracy: {scorePercent}%
      </div>

      <button
        onClick={() => ctx.next()}
        className="bg-white text-black border px-6 py-3 hover:bg-black hover:text-white hover:cursor-pointer hover:drop-shadow-xl transition-all duration-300 rounded-full font-semibold shadow-sm mt-4 disabled:opacity-25 disabled:bg-white disabled:border-black disabled:text-black disabled:cursor-not-allowed"
        disabled={nextDisabled}
      >
        Next Section
      </button>
    </motion.div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}
