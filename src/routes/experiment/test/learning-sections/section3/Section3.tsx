import { useContext, useEffect, useState } from "react";
import TestContext from "../../TestContext";
import { motion, AnimatePresence } from "framer-motion";

type Step = {
  title: string;
  text: React.ReactNode;
  image?: string;
  isFinal?: boolean;
};

export default function Section3() {
  const [stepIndex, setStepIndex] = useState(0);
  const ctx = useContext(TestContext);

  useEffect(() => {
    if (ctx && ctx.testMilestonesType.section3StartTime === null) {
      ctx.testMilestonesType.setSection3StartTime(Date.now());
    }
  }, [ctx]);

  if (!ctx) return null;

  const steps: Step[] = [
    {
      title: "Section 3: Responsible AI Use",
      text: (
        <>
          You've learned how AI consumes energy and water.
          <br />
          Now let's focus on what <strong>you</strong> can do.
        </>
      ),
    },
    {
      title: "Use AI Intentionally",
      text: (
        <>
          Ask concise questions.
          <br />
          Avoid repeated or unnecessary prompts.
          <br />
          Use AI where it adds value.
        </>
      ),
      image: "/images/intentional-prompts.png",
    },
    {
      title: "Choose Efficient Tools",
      text: (
        <>
          For simple calculations or quick searches, traditional tools may
          consume less energy.
          <br />
          AI is powerful - but not always necessary.
        </>
      ),
    },
    {
      title: "The Bigger Picture",
      text: (
        <>
          Billions of small decisions shape global energy use.
          <br />
          <strong>Your usage habits matter.</strong>
        </>
      ),
      isFinal: true,
    },
  ];

  const totalSteps = steps.length;
  const isFinalStep = steps[stepIndex].isFinal;

  const handleNext = () => {
    if (isFinalStep) {
      setTimeout(() => ctx.next(), 800);
    } else {
      setStepIndex((prev) => prev + 1);
    }
  };

  const progressPercent = (stepIndex / (totalSteps - 1)) * 100;

  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-6 px-4">
      <div className="absolute top-12 w-full max-w-md">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">
          Step {stepIndex} of {totalSteps - 1}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 text-center max-w-lg"
        >
          <h2 className="text-lg md:text-xl font-semibold">
            {steps[stepIndex].title}
          </h2>

          <p className="text-sm md:text-base">{steps[stepIndex].text}</p>

          <button
            onClick={handleNext}
            className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-800 transition hover:cursor-pointer"
          >
            {isFinalStep ? "Continue" : "Next"}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
