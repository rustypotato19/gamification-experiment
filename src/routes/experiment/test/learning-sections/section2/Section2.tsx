import { useContext, useEffect, useState } from "react";
import TestContext from "../../TestContext";
import { motion, AnimatePresence } from "framer-motion";

type Step = {
  title: string | React.ReactNode;
  text: React.ReactNode;
  isFinal?: boolean;
};

export default function Section2() {
  const [stepIndex, setStepIndex] = useState(0);
  const ctx = useContext(TestContext);

  const [allowNext, setAllowNext] = useState(true);

  useEffect(() => {
    if (ctx) ctx.testMilestonesType.setSection2StartTime(Date.now());
  }, [ctx]);

  if (!ctx) return null;

  const steps: Step[] = [
    {
      title: (
        <div className="flex flex-col gap-4">
          <span className="text-2xl">Section 2 of 3</span>
          Focusing on CO₂, Electricity and Water
        </div>
      ),
      text: (
        <div className="flex justify-center items-center">
          <p className="text-lg mt-4">
            In this section, we'll go through just how much resources LLM
            training and usage requires, and <i>why scale matters</i>
          </p>
        </div>
      ),
    },
    {
      title: "Training vs. Usage",
      text: (
        <div className="flex flex-col justify-center items-center">
          <p>
            <b>Training</b> an LLM model is very resource intensive up-front.
          </p>
          <p>
            <i>However</i>, when <b>using</b> an LLM the amount of resources
            used builds up over a longer period of time.
          </p>
          <div className="flex flex-row justify-center items-center px-4 gap-4 mt-6">
            <img src="/images/chatgpt-logo.png" className="h-full w-20" />
            <p className="w-30 font-bold">Let's talk about GPT-3.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Why Scale Matters",
      text: (
        <div className="flex flex-col justify-center items-center gap-4">
          <p>A single AI prompt doesn't seem like much.</p>
          <p>
            But globally, ChatGPT receives around{" "}
            <b>2.5 billion prompts per day</b>.
          </p>
          <p>
            When billions of people use AI every day, the small cost of each
            prompt quickly becomes extremely large.
          </p>
        </div>
      ),
    },
    {
      title: "GPT-3: Electricity",
      text: (
        <div className="flex flex-col justify-center items-center gap-4">
          <div>
            <p>
              GPT-3 was reported to have used <b>~1,300 MWh</b> of electricity
              for one training run.
            </p>
            <p className="text-xs text-neutral-700">
              This is roughly as much as it takes to run ~120 US homes for 1
              year
            </p>
          </div>
          <div className="flex w-full justify-around overflow-hidden">
            <img src="/gifs/electric.gif" className="w-10" />
            <img src="/gifs/electric.gif" className="w-10" />
            <img src="/gifs/electric.gif" className="w-10" />
            <img src="/gifs/electric.gif" className="w-10" />
            <img src="/gifs/electric.gif" className="w-10" />
            <img src="/gifs/electric.gif" className="w-10" />
            <img src="/gifs/electric.gif" className="w-10" />
            <img src="/gifs/electric.gif" className="w-10" />
            <img src="/gifs/electric.gif" className="w-10" />
            <img src="/gifs/electric.gif" className="w-10" />
            <img src="/gifs/electric.gif" className="w-10" />
            <img src="/gifs/electric.gif" className="w-10" />
          </div>
          <div>
            <p>
              Per query, this number drops to ~1 Wh - however:
            </p>
            <p className="mt-2 italic">
              365 days x 2.5 bil. queries x 1 Wh = ~912.5 billion Wh (or 912,500
              MWh)
            </p>
            <p className="text-xs text-neutral-700">
              This is roughly as much as it takes to run <b>~82,400</b> (~55%)
              US homes for 1 year
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "GPT-3: Water",
      text: (
        <div className="flex flex-col justify-center items-center gap-4">
          <div>
            <p>
              GPT-3 was reported to have used <b>~700,000L</b> of water for one
              training run.
            </p>
            <p className="text-xs text-neutral-700">
              This is roughly as much as it takes to fill ~2.8M glasses of water
              / ~0.25 olympic swimming pools
            </p>
          </div>
          <div className="flex w-full justify-around overflow-hidden">
            <img src="/gifs/water-drop.gif" className="w-10" />
            <img src="/gifs/water-drop.gif" className="w-10" />
            <img src="/gifs/water-drop.gif" className="w-10" />
            <img src="/gifs/water-drop.gif" className="w-10" />
            <img src="/gifs/water-drop.gif" className="w-10" />
            <img src="/gifs/water-drop.gif" className="w-10" />
            <img src="/gifs/water-drop.gif" className="w-10" />
            <img src="/gifs/water-drop.gif" className="w-10" />
            <img src="/gifs/water-drop.gif" className="w-10" />
            <img src="/gifs/water-drop.gif" className="w-10" />
            <img src="/gifs/water-drop.gif" className="w-10" />
            <img src="/gifs/water-drop.gif" className="w-10" />
          </div>
          <div>
            <p>Per query, this number drops to ~0.3 ml - however:</p>
            <p className="mt-2 italic">
              365 days x 2.5 bil. queries x 0.3 ml = ~280 billion ml (or{" "}
              <b>280 million L</b>)
            </p>
            <p className="text-xs text-neutral-700">
              This is roughly as much as it takes to fill <b>1.1 billion</b>{" "}
              glasses of water / <b>112</b> olympic swimming pools
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "GPT-3: CO₂",
      text: (
        <div className="flex flex-col justify-center items-center gap-4">
          <div>
            <p>
              GPT-3 was reported to have emitted <b>~500 tonnes</b> of CO₂ or
              equivalent (tCO₂e) for one training run.
            </p>
            <p className="text-xs text-neutral-700">
              This is roughly as much as it takes to drive ~100 cars for 1 year
            </p>
          </div>
          <div className="flex w-full justify-around overflow-hidden">
            <img src="/gifs/co2.gif" className="w-10" />
            <img src="/gifs/co2.gif" className="w-10" />
            <img src="/gifs/co2.gif" className="w-10" />
            <img src="/gifs/co2.gif" className="w-10" />
            <img src="/gifs/co2.gif" className="w-10" />
            <img src="/gifs/co2.gif" className="w-10" />
            <img src="/gifs/co2.gif" className="w-10" />
            <img src="/gifs/co2.gif" className="w-10" />
            <img src="/gifs/co2.gif" className="w-10" />
            <img src="/gifs/co2.gif" className="w-10" />
            <img src="/gifs/co2.gif" className="w-10" />
            <img src="/gifs/co2.gif" className="w-10" />
          </div>
          <div>
            <p>Per query, this number drops to ~0.1 grams - however:</p>
            <p className="mt-2 italic">
              365 days x 2.5 bil. queries x 0.1 gram = ~91.2 billion grams (or{" "}
              <b>91,250 tCO₂e</b>)
            </p>
            <p className="text-xs text-neutral-700">
              This is roughly as much as it takes to drive <b>18,250</b> cars
              for 1 year
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "GPT-3 is Old",
      text: (
        <div className="flex flex-col justify-center items-center gap-4">
          <p>
            The GPT-3 model is now heavily outdated - but it had the largest
            number of data available - and as of March 2026, the newest release
            is GPT-5.2
          </p>
          <img src="/images/old-robot.jpeg" className="h-full max-w-40" />
          <p>
            Every new, more advanced model requires more and more to create -
            some reports claim that GPT-4 was roughly <b>8.5x</b> more resource
            intensive to train than GPT-3.
          </p>
        </div>
      ),
    },
    {
      title: "The Numbers",
      text: (
        <div className="flex flex-col justify-center items-center gap-4">
          <p>
            The presented values are to be <i>taken with a pinch of salt</i>
          </p>
          <p>
            Companies such as OpenAI don't tend to be very open about their
            water usage and carbon emissions, but certain <b>insights</b> and{" "}
            <b>calculations</b> over the years have allowed speculations and
            predictions to form.
          </p>
          <p className="font-semibold mt-4">
            Let's see what you've learnt from section 2.
          </p>
        </div>
      ),
      isFinal: true,
    },
  ];

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
      <div className="absolute top-12 w-full max-w-md">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-orange-400"
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
          className="flex flex-col items-center gap-4 text-center max-w-lg relative bottom-12"
        >
          <h2 className="text-lg md:text-xl font-semibold">
            {steps[stepIndex].title}
          </h2>

          <p className="text-sm md:text-base">{steps[stepIndex].text}</p>

          <button
            onClick={handleNext}
            className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-orange-700 hover:cursor-pointer transition disabled:bg-neutral-500 disabled:cursor-not-allowed"
            disabled={!allowNext}
          >
            {isFinalStep ? "Continue" : "Next"}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
