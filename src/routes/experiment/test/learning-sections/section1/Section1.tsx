import { useContext, useEffect, useState } from "react";
import TestContext from "../../TestContext";
import { motion, AnimatePresence } from "framer-motion";

type Step = {
  title: string;
  text: React.ReactNode;
  image?: string;
  isFinal?: boolean;
};

export default function Section1() {
  const [stepIndex, setStepIndex] = useState(0);
  const [showGpuTooltip, setShowGpuTooltip] = useState(false);

  const ctx = useContext(TestContext);

  // Record section 1 start time once on mount
  useEffect(() => {
    if (ctx && ctx.testMilestonesType.section1StartTime === null) {
      ctx.testMilestonesType.setSection1StartTime(Date.now());
    }
  }, [ctx]);

  // Close tooltip if clicking elsewhere
  useEffect(() => {
    const closeTooltip = () => setShowGpuTooltip(false);
    if (showGpuTooltip) {
      window.addEventListener("click", closeTooltip);
    }
    return () => window.removeEventListener("click", closeTooltip);
  }, [showGpuTooltip]);

  const steps: Step[] = [
    {
      title: "Section 1: AI's Hidden Environmental Impact",
      text: (
        <>
          In this section, we'll explore how AI systems contribute to
          environmental challenges and why energy consumption matters.
        </>
      ),
    },
    {
      title: "AI's CO₂ Emissions and Water Use",
      text: (
        <>
          Training large AI models consumes significant electricity, which
          results in CO₂ emissions. Data centers also use large amounts of water
          for cooling.
        </>
      ),
      image: "/images/data-center-co2.png",
    },
    {
      title: "AI's Energy Use and Efficiency",
      text: (
        <>
          <strong>Optimising</strong> AI models and infrastructure can{" "}
          <em>reduce energy use</em>. Smaller, more efficient models consume
          less power while still performing well.
        </>
      ),
      image: "/images/energy-efficiency.png",
    },
    {
      title: "Data Center Scale and Hardware Use",
      text: (
        <>
          AI computations happen on thousands of{" "}
          <span className="relative inline-block">
            <a
              href="https://cloud.google.com/discover/gpu-for-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:text-blue-500"
              onMouseEnter={() => setShowGpuTooltip(true)}
              onMouseLeave={() => setShowGpuTooltip(false)}
              onClick={(e) => {
                if (window.innerWidth < 768) {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowGpuTooltip((prev) => !prev);
                }
              }}
            >
              GPUs
            </a>

            <AnimatePresence>
              {showGpuTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 p-2 text-xs md:text-sm bg-black text-white rounded shadow-lg z-50"
                >
                  GPU (Graphics Processing Unit) - a processor specialised for
                  executing many tasks in parallel.
                </motion.div>
              )}
            </AnimatePresence>
          </span>{" "}
          in massive data centers. The scale of hardware directly impacts energy
          consumption.
        </>
      ),
      image: "/images/server-rack.jpg",
    },
    {
      title: "Cooling and Efficiency Techniques",
      text: (
        <>
          Modern data centers use advanced cooling (liquid cooling, AI-optimised
          airflow) to reduce water and energy use while keeping servers at
          optimal temperatures.
        </>
      ),
      image: "/images/data-center-cooling.jpg",
      isFinal: true,
    },
  ];

  if (!ctx) return null;

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
      {/* Progress Bar */}
      <div className="absolute top-12 w-full max-w-md">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">
          Step {stepIndex} of {totalSteps - 1}
        </p>
      </div>

      {/* Animated Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="flex flex-col items-center gap-4 text-center max-w-lg"
        >
          <h2 className="text-lg md:text-xl font-semibold">
            {steps[stepIndex].title}
          </h2>

          <p className="text-sm md:text-base">{steps[stepIndex].text}</p>

          {steps[stepIndex].image && (
            <img
              src={steps[stepIndex].image}
              alt={steps[stepIndex].title}
              className="mt-4 w-full rounded"
            />
          )}

          <button
            onClick={handleNext}
            className="mt-6 bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-slate-700 hover:cursor-pointer transition"
          >
            {isFinalStep ? "Continue" : "Next"}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
