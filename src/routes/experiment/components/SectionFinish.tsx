import { useContext, useEffect, useState, useRef } from "react";
import TestContext from "../context/TestContext";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";

type Props = { title: string; message: string };

export default function SectionFinish({ title, message }: Props) {
  const ctx = useContext(TestContext);
  const [nextSectionDisabled, setNextSectionDisabled] = useState(true);
  const hasFiredConfetti = useRef(false);

  const tm = ctx && ctx.testMilestonesType;
  const currentIndex = (ctx && ctx.currentIndex) || 0;

  // Enable next section button after 5s
  useEffect(() => {
    const timer = setTimeout(() => setNextSectionDisabled(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Pick the correct section variables based on currentIndex
  const sectionPts =
    currentIndex === 0
      ? (tm && tm.section1Pts) || 0
      : currentIndex === 1
        ? ((tm && tm.section2Pts) || 0) - ((tm && tm.section1Pts) || 0)
        : ((tm && tm.section3Pts) || 0) - ((tm && tm.section2Pts) || 0);

  const sectionStreak =
    currentIndex === 0
      ? (tm && tm.section1Streak) || 0
      : currentIndex === 1
        ? ((tm && tm.section2Streak) || 0) - ((tm && tm.section1Streak) || 0)
        : ((tm && tm.section3Streak) || 0) - ((tm && tm.section2Streak) || 0);

  const sectionCorrect =
    currentIndex === 0
      ? (tm && tm.section1Correct) || 0
      : currentIndex === 1
        ? ((tm && tm.section2Correct) || 0) - ((tm && tm.section1Correct) || 0)
        : ((tm && tm.section3Correct) || 0) - ((tm && tm.section2Correct) || 0);

  const sectionIncorrect =
    currentIndex === 0
      ? (tm && tm.section1Incorrect) || 0
      : currentIndex === 1
        ? ((tm && tm.section2Incorrect) || 0) -
          ((tm && tm.section1Incorrect) || 0)
        : ((tm && tm.section3Incorrect) || 0) -
          ((tm && tm.section2Incorrect) || 0);

  const sectionStartTime =
    currentIndex === 0
      ? (tm && tm.section1StartTime) || 0
      : currentIndex === 1
        ? (tm && tm.section2StartTime) || 0
        : (tm && tm.section3StartTime) || 0;

  const sectionEndTime =
    currentIndex === 0
      ? (tm && tm.section1EndTime) || 0
      : currentIndex === 1
        ? (tm && tm.section2EndTime) || 0
        : (tm && tm.section3EndTime) || 0;

  const total = sectionCorrect + sectionIncorrect;
  const scorePercent =
    total > 0 ? Math.round((sectionCorrect / total) * 100) : 0;

  const scoreColor =
    scorePercent >= 80
      ? "bg-emerald-100 text-emerald-700"
      : scorePercent >= 50
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  // Fire confetti if accuracy > 50%
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

  // Record section end time if null
  useEffect(() => {
    const now = (ctx && ctx.getDateNow()) || 0;

    if (currentIndex === 0 && tm && tm.section1EndTime === null) {
      tm.setSection1EndTime(now);
    }
    if (currentIndex === 1 && tm && tm.section2EndTime === null) {
      tm.setSection2EndTime(now);
    }
    if (currentIndex === 2 && tm && tm.section3EndTime === null) {
      tm.setSection3EndTime(now);
    }
  }, [currentIndex, tm, ctx]);

  const rawTimeTaken = sectionEndTime - sectionStartTime;
  const timeTaken = (ctx && ctx.formatTime(rawTimeTaken)) || 0;
  const pts = (ctx && ctx.pts) || 0;
  const streak = (ctx && ctx.streak) || 0;

  // Upload section data once
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
  }, []); // only on mount

  // Early return if context not available
  if (!ctx) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl flex flex-col items-center text-center bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-black/20"
      >
        <h2 className="text-xl sm:text-3xl font-bold sm:mb-2">
          {title}
        </h2>
        <p className="text-slate-500 mb-8 text-sm sm:text-base">
          {message}
        </p>

        {/* Points Burst */}
        <motion.div
          key={sectionPts}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="text-2xl sm:text-5xl font-extrabold text-emerald-600">
            +{ctx.formatNumber(sectionPts)} Points
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Total Points: {pts?.toLocaleString() ?? 0}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 sm:gap-6 w-full mb-10">
          <StatCard label="🔥 Streak Gained" value={sectionStreak ?? 0} />
          <StatCard label="📈 Total Streak" value={streak ?? 0} />
          <StatCard label="⏱ Time Taken" value={timeTaken} />
          <StatCard
            label="🎯 Score"
            value={`${sectionCorrect ?? 0}/${total}`}
          />
        </div>

        {/* Accuracy Badge */}
        <div
          className={`${scoreColor} px-6 py-3 rounded-full font-semibold shadow-sm mb-4`}
        >
          Accuracy: {scorePercent}%
        </div>

        <button
          onClick={ctx.next}
          disabled={nextSectionDisabled}
          className="bg-white text-black border px-6 py-3 hover:bg-black hover:text-white transition rounded-full font-semibold shadow-sm disabled:opacity-25 disabled:cursor-not-allowed"
        >
          Next Section
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 sm:p-5 shadow-sm hover:shadow-md transition">
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-lg sm:text-2xl font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}
