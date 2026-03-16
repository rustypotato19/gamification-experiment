import { useContext, useEffect, useState, useRef } from "react";
import TestContext from "../context/TestContext";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";

type Props = { title: string; message: string; onComplete?: () => void };

export default function SectionFinish({ title, message }: Props) {
  const ctx = useContext(TestContext);
  const [nextSectionDisabled, setNextSectionDisabled] = useState(true);
  const hasFiredConfetti = useRef(false);

  const tm = ctx && ctx.testMilestonesType;
  const currentIndex = (ctx && ctx.currentIndex) || 0;

  useEffect(() => {
    if (ctx) {
      ctx.setShowPtsAndStreak(false);
      ctx.setShowSectionProgressPercent(false);
    }

    const timer = setTimeout(() => setNextSectionDisabled(false), 5000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ptsMap = [tm?.section1Pts, tm?.section2Pts, tm?.section3Pts];

  const streakMap = [
    tm?.section1Streak,
    tm?.section2Streak,
    tm?.section3Streak,
  ];

  const correctMap = [
    tm?.section1Correct,
    tm?.section2Correct,
    tm?.section3Correct,
  ];

  const incorrectMap = [
    tm?.section1Incorrect,
    tm?.section2Incorrect,
    tm?.section3Incorrect,
  ];

  const startTimeMap = [
    tm?.section1StartTime,
    tm?.section2StartTime,
    tm?.section3StartTime,
  ];

  const endTimeMap = [
    tm?.section1EndTime,
    tm?.section2EndTime,
    tm?.section3EndTime,
  ];

  const sectionPts = ptsMap[currentIndex] ?? 0;
  const sectionStreak = streakMap[currentIndex] ?? 0;
  const sectionCorrect = correctMap[currentIndex] ?? 0;
  const sectionIncorrect = incorrectMap[currentIndex] ?? 0;

  const sectionStartTime = startTimeMap[currentIndex] ?? 0;
  const sectionEndTime = endTimeMap[currentIndex] ?? 0;

  const total = sectionCorrect + sectionIncorrect;
  const scorePercent =
    total > 0 ? Math.round((sectionCorrect / total) * 100) : 0;

  const scoreColor =
    scorePercent >= 80
      ? "bg-emerald-100 text-emerald-700"
      : scorePercent >= 50
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  useEffect(() => {
    if (hasFiredConfetti.current || total === 0) return;

    const accuracy = sectionCorrect / total;
    if (accuracy > 0.5) {
      confetti({
        particleCount: window.innerWidth > 480 ? 100 : 50,
        spread: 70,
        origin: { x: 0.5, y: 0.6 },
      });
    }

    hasFiredConfetti.current = true;
  }, [sectionCorrect, sectionIncorrect, total]);

  useEffect(() => {
    if (!tm) return;
    const now = Date.now();

    switch (currentIndex) {
      case 0:
        ctx.testMilestonesType.setSection1EndTime(now);
        break;
      case 1:
        ctx.testMilestonesType.setSection2EndTime(now);
        break;
      case 2:
        ctx.testMilestonesType.setSection3EndTime(now);
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rawTimeTaken = sectionEndTime - sectionStartTime;
  const timeTaken = (ctx && ctx.formatTime(rawTimeTaken)) || 0;
  const pts = (ctx && ctx.pts) || 0;
  const streak = (ctx && ctx.streak) || 0;

  useEffect(() => {
    const pid =
      (ctx && ctx.pid) || localStorage.getItem("participantId") || "null";

    async function upload() {
      try {
        await fetch("/api/section-complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participantId: pid,
            sectionNumber: currentIndex + 1,
            timeSeconds: Math.round(rawTimeTaken / 1000),
            score: sectionCorrect,
            total,
            percentage: scorePercent,
          }),
        });
      } catch (e) {
        console.error("Failed to upload section data", e);
      }
    }

    upload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ctx) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="
        w-full
        max-w-170
        min-w-0
        flex flex-col items-center text-center
        bg-white
        px-4 sm:px-8
        py-6 sm:py-8
        rounded-2xl
        shadow-lg
        border border-black/10
      "
      >
        <h2 className="text-xl sm:text-3xl font-bold">{title}</h2>

        <p className="text-slate-500 mt-2 mb-6 text-sm sm:text-base max-w-prose">
          {message}
        </p>

        {/* Points */}
        <motion.div
          key={sectionPts}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.35 }}
          className="mb-8"
        >
          <div className="text-2xl sm:text-4xl font-extrabold text-emerald-600">
            +{ctx.formatNumber(sectionPts)} Points
          </div>

          <p className="text-sm text-slate-500 mt-1">
            Total Points: {pts?.toLocaleString() ?? 0}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 w-full mb-8">
          <StatCard label="🔥 Streak Gained" value={sectionStreak ?? 0} />
          <StatCard label="📈 Total Streak" value={streak ?? 0} />
          <StatCard label="⏱ Time Taken" value={timeTaken} />
          <StatCard label="🎯 Score" value={`${sectionCorrect}/${total}`} />
        </div>

        {/* Accuracy */}
        <div
          className={`${scoreColor} px-5 py-2 rounded-full font-semibold shadow-sm mb-6`}
        >
          Accuracy: {scorePercent}%
        </div>

        {/* Button */}
        <button
          onClick={() => {
            if (nextSectionDisabled) return;
            ctx?.next();
          }}
          disabled={nextSectionDisabled}
          className="
          w-full sm:w-auto
          bg-white
          text-black
          border
          px-6 py-3
          rounded-full
          font-semibold
          shadow-sm
          transition
          hover:bg-black hover:text-white
          hover: cursor-pointer
          disabled:opacity-30
          disabled:cursor-not-allowed
          disabled:bg-white
          disabled:text-black
        "
        >
          Next Section
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="
      min-w-0
      bg-slate-50
      border border-slate-200
      rounded-xl
      px-2 py-2 sm:px-3 sm:py-3
      shadow-sm
    "
    >
      <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wide">
        {label}
      </p>

      <p className="mt-1 text-lg sm:text-2xl font-bold text-slate-800 wrap-break-word">
        {value}
      </p>
    </div>
  );
}
