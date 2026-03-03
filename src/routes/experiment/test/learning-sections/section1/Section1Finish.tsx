import confetti from "canvas-confetti";
import { useContext, useEffect, useState } from "react";
import TestContext from "../../TestContext";
import { motion } from "framer-motion";

function getDateNow() {
  return Date.now();
}

function formatNumber(number: number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(2) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(2) + "K";
  } else return number.toLocaleString();
}

export default function Section1Finish() {
  const [nextSectionDisabled, setNextSectionDisabled] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setNextSectionDisabled(false);
    }, 5000);
  }, [nextSectionDisabled]);

  const ctx = useContext(TestContext);

  const fireConfetti = () => {
    const duration = 2000;
    const end = getDateNow() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0.01, y: 0.7 },
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 0.99, y: 0.7 },
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  };

  useEffect(() => {
    if (ctx && ctx.testMilestonesType.section1EndTime === null) {
      ctx.testMilestonesType.setSection1EndTime(Date.now());
    }
  }, [ctx]);

  useEffect(() => {
    if (
      ctx &&
      ctx.testMilestonesType.section1Correct /
        (ctx.testMilestonesType.section1Correct +
          ctx.testMilestonesType.section1Incorrect) >
        0.5
    )
      fireConfetti();
  }, [ctx]);

  const formatTime = (time: number) => {
    const seconds = time < 0 ? (time * -1) / 1000 : time / 1000;
    if (seconds / 3600 >= 1)
      return `${Math.floor(seconds / 3660)}h  ${Math.floor((seconds % 3600) / 60)}m ${Math.floor(seconds % 60)}s`;
    else if (seconds / 60 >= 1)
      return `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
    return `${Math.floor(seconds)}s`;
  };

  const pts = ctx ? ctx.pts : 0;
  const streak = ctx ? ctx.streak : 0;

  const ptsGained = ctx ? ctx.testMilestonesType.section1Pts : 0;
  const streakGained = ctx ? ctx.testMilestonesType.section1Streak : 0;

  const correct = ctx ? ctx.testMilestonesType.section1Correct : 0;
  const incorrect = ctx ? ctx.testMilestonesType.section1Incorrect : 0;
  const total = correct + incorrect;

  const scorePercent = Math.round((correct / total) * 100);

  const rawTimeTaken =
    ctx &&
    ctx.testMilestonesType.section1StartTime !== null &&
    ctx.testMilestonesType.section1EndTime !== null
      ? ctx.testMilestonesType.section1EndTime -
        ctx.testMilestonesType.section1StartTime
      : 0;

  const timeTaken = formatTime(rawTimeTaken);
  if (timeTaken == "0s") {
    console.error(
      `End Time: ${ctx && ctx.testMilestonesType.section1EndTime}\nStart Time: ${ctx && ctx.testMilestonesType.section1StartTime}\nTaken: ${timeTaken}`,
    );
  }

  const participantId = localStorage.getItem("participantId")
    ? localStorage.getItem("participantId")
    : "";

  useEffect(() => {
    async function upload() {
      await fetch("/api/section-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId,
          sectionNumber: 1,
          timeSeconds: rawTimeTaken / 1000,
          score: correct,
          total: total,
          percentage: scorePercent,
        }),
      });
    }

    upload();
  }, [correct, participantId, rawTimeTaken, scorePercent, total]);

  if (!ctx) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl flex flex-col items-center text-center"
    >
      {/* 🎉 Header */}
      <h2 className="text-3xl font-bold mb-2">🎉 Section Complete!</h2>
      <p className="text-slate-500 mb-8">
        You've completed Section 1 of AI Impact.
      </p>

      {/* 🏆 Pts Burst */}

      <motion.div
        key={ptsGained}
        initial={{ scale: 1.4 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div className="text-5xl font-extrabold text-emerald-600">
          +{formatNumber(ptsGained)} Points
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Total Points: {pts.toLocaleString()}
        </p>
      </motion.div>

      {/* 📊 Stats */}
      <div className="grid grid-cols-2 gap-6 w-full mb-10">
        <StatCard label="🔥 Streak Gained" value={streakGained} />
        <StatCard label="📈 Total Streak" value={streak} />
        <StatCard label="⏱ Time Taken" value={timeTaken} />
        <StatCard label="🎯 Score" value={`${correct}/${total}`} />
      </div>

      {/* 🥇 Accuracy Badge */}
      <div className="bg-emerald-100 text-emerald-700 px-6 py-3 rounded-full font-semibold shadow-sm">
        Accuracy: {scorePercent}%
      </div>

      <button
        onClick={() => {
          ctx.next();
        }}
        className="bg-white text-black border px-6 py-3 hover:bg-black hover:text-white hover:cursor-pointer hover:drop-shadow-xl transition-all duration-300 rounded-full font-semibold shadow-sm mt-4 disabled:opacity-25 disabled:bg-white disabled:border-black disabled:text-black disabled:cursor-not-allowed"
        disabled={nextSectionDisabled}
      >
        Next section
      </button>
    </motion.div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}
