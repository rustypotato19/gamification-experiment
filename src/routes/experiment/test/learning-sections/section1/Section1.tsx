import { useContext, useEffect, useState } from "react";
import TestContext from "../../TestContext";
import { motion, AnimatePresence } from "framer-motion";

type Step = {
  title: string | React.ReactNode;
  text: string | React.ReactNode;
  bg_image?: string;
  isFinal?: boolean;
};

export default function Section1() {
  const [stepIndex, setStepIndex] = useState(0);
  const [showGpuTooltip, setShowGpuTooltip] = useState(false);

  const [allowNext, setAllowNext] = useState(true);

  const [hugeText, setHugeText] = useState(false);

  useEffect(() => {
    if (stepIndex == 3)
      setTimeout(() => {
        setHugeText(true);
      }, 1500);
  }, [stepIndex]);

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
      title: (
        <div className="flex flex-col gap-4">
          <span className="text-xl sm:text-2xl">Section 1 of 3</span>
          What is AI? And how does it affect the environment?
        </div>
      ),
      text: (
        <div className="flex flex-col sm:flex-row justify-center items-center">
          <p className="text-md sm:text-lg mt-4">
            In this section, you'll be introduced to "<b>AI</b>", it's general
            impacts on the environment and why these impacts are so difficult to
            see.
          </p>
          <img src="/images/ai-robot.png" className="h-40 mt-6 sm:mt-0" />
        </div>
      ),
    },
    {
      title: 'What actually is "AI"?',
      text: (
        <div className="flex flex-col justify-center items-center gap-2">
          <p>
            <b>AI</b> is a scary term, but what we've come to know as AI - from
            the likes of ChatGPT, Gemini etc. - are actually{" "}
            <b>Large Language Models (LLMs)</b>.<br />
          </p>
          <img
            src="/images/different-languages.jpg"
            className="max-h-40 w-80"
          />
        </div>
      ),
    },
    {
      title: "LLMs",
      text: (
        <div className="flex flex-col items-center justify-center gap-3">
          <p>
            LLMs <i>scan millions of text files</i>, then based on those,
            they'll use maths to determine which word should come next.
          </p>
          <img
            src="/gifs/hackerScreen.gif"
            className="w-full h-30 rounded-2xl drop-shadow-xl border"
          />
          <p>
            LLMs don't <b>understand</b>, they calculate what the most
            statistically appropriate response is.
          </p>
          <p>
            Modern day LLMs can have their behaviour manually altered during the
            training process, but this is complicated.
          </p>
        </div>
      ),
    },
    {
      title: "Why does this matter?",
      text: (
        <div className="flex flex-col items-center justify-center gap-3">
          <p>
            Training AI models is <b>extremely intensive</b>.
          </p>
          <p>
            They can require <i>millions of hours</i> of simulations, requiring
            <span
              className={`${hugeText ? "text-4xl" : "text-md"} mx-2 italic transition-all duration-2000 applyElectricFont`}
            >
              huge
            </span>{" "}
            amounts of processing power.
          </p>
          <p>
            <b>This is where the problems start.</b>
          </p>
        </div>
      ),
    },
    {
      title: "Data Centers",
      text: (
        <div className="flex flex-col items-center justify-center gap-3">
          <p>Massive data centers are used to train LLM models.</p>
          <img
            src="/images/server-rack.jpg"
            alt="Generic depiction of many server racks in a data center."
            className="h-full max-w-60 sm:max-w-90 rounded-2xl drop-shadow-xl border"
          />
          <p>
            These can house thousands of <b>CPUs</b>, <b>GPUs</b> and terrabytes
            of <b>RAM</b> - all very key components of computing.
          </p>
          <p>Running these, requires a lot of resources.</p>
        </div>
      ),
    },
    {
      title: "Data Centers II",
      text: (
        <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
          <p>
            Large quantities of water and electrcitiy are required in the
            training of LLMs - these unfortuntely resulting in the production of{" "}
            <b>Carbon Dioxide (CO₂)</b>
          </p>
          <img
            src="/images/data-center-co2.png"
            alt="Cartoon-style image showing a lot of electricity and water is put into servers to get AI as a product, this procudes a fair amount of carbon dioxide"
            className="h-full ax-w-60 sm:max-w-90 "
          />
          <p>
            A majority of the worlds <b>electricity</b> is still generated by
            the burning of fossil fuels, such as <b>oil</b> and <b>coal</b>.
          </p>
          <p>
            <b>Water</b> has to be pumped in, and sometimes processed, before it
            reaches data centers where it is used for <b>cooling</b> - this also
            requires electricity.
          </p>
        </div>
      ),
    },
    {
      title: "Invisible Impact",
      text: (
        <div className="flex flex-col items-center justify-center gap-3">
          <p>This is what makes the impact of using AI, so difficult to see.</p>
          <p>
            It's out of sight, hidden behind a mask of{" "}
            <i>utility and convenience</i>.
          </p>
          <img src="images/eye.jpg" className="h-full max-w-40" />
          <p>This is why education on this topic is important</p>
          <p className="font-semibold">
            For now, time for a quiz. Let's see what you've picked up.
          </p>
        </div>
      ),
      isFinal: true,
    },
  ];

  if (!ctx) return null;

  const totalSteps = steps.length;
  const isFinalStep = steps[stepIndex].isFinal;

  const handleNext = () => {
    setAllowNext(false);
    setTimeout(() => {
      setAllowNext(true);
    }, 5000);

    setTimeout(() => {
      if (isFinalStep) {
        setTimeout(() => ctx.next(), 800);
      } else {
        if (allowNext) setStepIndex((prev) => prev + 1);
      }
    }, 100);
  };

  const progressPercent = (stepIndex / (totalSteps - 1)) * 100;

  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-6 px-4">
      {/* Progress Bar */}
      <div className="absolute top-7 sm:top-12 w-full max-w-full sm:max-w-md px-8 sm:px-0">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden max-w-full">
          <motion.div
            className="h-full bg-green-700"
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
          className="flex flex-col items-center gap-4 text-center max-w-lg relative bottom-4 sm:bottom-12"
        >
          <h2 className="text-lg md:text-xl font-semibold">
            {steps[stepIndex].title}
          </h2>

          <p className="text-sm md:text-base">{steps[stepIndex].text}</p>

          <button
            onClick={() => {
              handleNext();
            }}
            className="mt-2 sm:mt-6 bg-green-700 text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-green-800 hover:cursor-pointer transition disabled:bg-neutral-500 disabled:cursor-not-allowed"
            disabled={!allowNext}
          >
            {isFinalStep ? "Continue" : "Next"}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
