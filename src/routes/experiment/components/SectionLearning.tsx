import { useContext, useEffect, useState } from "react";
import type { Step } from "../types";
import TestContext from "../context/TestContext";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  slides: Step[];
  onComplete: () => void;
};

export default function SectionLearning({ slides, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [sceneBusy, setSceneBusy] = useState(false);

  const ctx = useContext(TestContext);
  const slide = slides[index];

  function nextToggleBusy() {
    setSceneBusy(true);

    setTimeout(() => {
      setSceneBusy(false);
    }, 3500);
  }

  function next() {
    nextToggleBusy();

    setTimeout(() => {
      if (index < slides.length - 1) {
        setIndex((i) => i + 1);
        ctx?.setSectionStep(ctx.sectionStep + 1);
      } else {
        onComplete();
      }
    }, 200);
  }

  useEffect(() => {
    if (!ctx) return;

    ctx.setShowPtsAndStreak(false);
    ctx.setShowSectionProgressPercent(true);

    switch (ctx.currentIndex) {
      case 0:
        ctx.testMilestonesType.setSection1StartTime(Date.now());
        break;
      case 1:
        ctx.testMilestonesType.setSection2StartTime(Date.now());
        break;
      case 2:
        ctx.testMilestonesType.setSection3StartTime(Date.now());
        break;
      default:
        console.log(`Some Error occurred\nIndex:: ${ctx.currentIndex}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ctx) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 80 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="
        w-full
        max-w-170
        min-w-0
        max-h-[70vh]
        overflow-y-auto
        bg-white
        px-4 sm:px-6
        py-5 sm:py-6
        rounded-xl sm:rounded-2xl
        shadow-lg
        border border-black/10
        flex flex-col
        gap-4
      "
      >
        <h2 className="text-lg sm:text-xl font-semibold wrap-break-word">
          {slide.title}
        </h2>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          {slide.text}
        </p>

        <button
          onClick={next}
          disabled={sceneBusy}
          className="
          mt-2
          w-full sm:w-auto
          bg-indigo-600
          text-white
          px-4 py-2
          rounded-xl
          transition
          hover:bg-indigo-700
          hover:cursor-pointer
          disabled:bg-neutral-400
          disabled:cursor-not-allowed
        "
        >
          Continue
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
