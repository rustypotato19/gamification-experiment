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

  const ctx = useContext(TestContext);

  const slide = slides[index];

  const [sceneBusy, setSceneBusy] = useState<boolean>(false);

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
      } else onComplete();
    }, 200);

    // Start time debug
    /* if (!ctx) return;
    console.log(
      `Index: ${ctx.currentIndex}:: Section ${ctx.currentIndex + 1}:: Start Time:: ${ctx.currentIndex == 0 ? ctx.testMilestonesType.section1StartTime : ctx.currentIndex == 1 ? ctx.testMilestonesType.section2StartTime : ctx.testMilestonesType.section3StartTime}`,
    ); */
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
        break;
    }

    // Start time debug
    /* console.log(
      `Index: ${ctx.currentIndex}:: Section ${ctx.currentIndex + 1}:: Start Time:: ${ctx.currentIndex == 0 ? ctx.testMilestonesType.section1StartTime : ctx.currentIndex == 1 ? ctx.testMilestonesType.section2StartTime : ctx.testMilestonesType.section3StartTime}`,
    ); */

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ctx) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="bg-white max-w-2xl sm:max-w-xl w-full max-h-[70dvh] overflow-y-scroll sm:overflow-auto p-3 sm:p-6 rounded-lg sm:rounded-2xl drop-shadow-lg border border-black/20 flex flex-col gap-4"
        key={index}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <h2 className="text-xl font-semibold">{slide.title}</h2>

        <p>{slide.text}</p>

        <button
          onClick={next}
          className="bg-indigo-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-xl hover:bg-indigo-700 hover:cursor-pointer disabled:bg-neutral-500 disabled:cursor-not-allowed"
          disabled={sceneBusy}
        >
          Continue
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
