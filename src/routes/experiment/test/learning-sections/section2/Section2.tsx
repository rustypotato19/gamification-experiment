import { useContext, useEffect, useState } from "react";
import TestContext from "../../TestContext";
import { motion, AnimatePresence } from "framer-motion";

type Step = {
  title: string;
  text: React.ReactNode;
  image?: string;
  isFinal?: boolean;
};

export default function Section2() {
  const [stepIndex, setStepIndex] = useState(0);
  const ctx = useContext(TestContext);

  useEffect(() => {
    if (ctx) ctx.testMilestonesType.setSection2StartTime(Date.now());
  }, [ctx]);

  if (!ctx) return null;

  const steps: Step[] = [
    {
      title: "Section 2: How Big Is AI's Environmental Impact?",
      text: (
        <>
          In Section 1, we explored how AI uses energy and water.
          <br />
          Now let's look at <strong>how much</strong> it actually consumes - and
          why scale matters.
        </>
      ),
    },
    {
      title: "Energy Per Query",
      text: (
        <>
          A single AI query may only use a small amount of energy - often
          measured in <strong>milligrams (1/1000 grams) of CO₂</strong>
          <br />
          <br />
          But millions of users making billions of requests every day quickly
          adds up.
        </>
      ),
      image: "/gifs/multiplying-co2.gif",
    },
    {
      title: "Scale Multiplies Impact",
      text: (
        <>
          Even small per-query costs become significant at global scale.
          Generative AI systems process enormous volumes of text, images, and
          data continuously.
          <br />
          <br />
          billions of small impacts = one large environmental impact.
        </>
      ),
      image: "/gifs/growing-queries.gif"
    },
    {
      title: "Training vs Daily Use",
      text: (
        <>
          The <strong>training phase</strong> of large AI models is extremely
          energy intensive.
          <br />
          <br />
          Training can emit as much CO₂ as <strong>several cars</strong> over their lifetime.
          <br />
          <br />
          Daily user queries (inference) also consume energy, but typically far
          less than initial training.
        </>
      ),
      image: "/images/AI-training-cars.png"
    },
    {
      title: "Model Size Matters",
      text: (
        <>
          Larger models require:
          <br />
          • More GPUs • More computation • More electricity •
          <br />
          <br />
          As models grow in size and complexity, their environmental footprint
          increases significantly.
        </>
      ),
      image: "/images/complexity-env-impact-graph.png"
    },
    {
      title: "Energy Source Makes a Difference",
      text: (
        <>
          AI systems powered by <strong>renewable energy</strong> produce far
          fewer carbon emissions than those powered by coal or natural gas.
          <br />
          <br />
          The same computation can have very different environmental
          consequences depending on the energy mix.
        </>
      ),
      image: "/images/energies.png",
    },
    {
      title: "User Behaviour Also Matters",
      text: (
        <>
          Repeated or unnecessary prompting increases computation and energy
          use.
          <br />
          <br />
          Being concise and using AI only when appropriate can reduce
          environmental impact.
        </>
      ),
      image: "/images/intentional-prompts.png",
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
          className="flex flex-col items-center gap-4 text-center max-w-lg"
        >
          <h2 className="text-lg md:text-xl font-semibold">
            {steps[stepIndex].title}
          </h2>

          <p className="text-sm md:text-base">{steps[stepIndex].text}</p>

          <div className="flex justify-center items-center overflow-clip max-w-120 max-h-80">
            <img className="max-w-full h-full" src={steps[stepIndex].image}/>
          </div>

          <button
            onClick={handleNext}
            className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-orange-700 hover:cursor-pointer transition"
          >
            {isFinalStep ? "Continue" : "Next"}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
