import { useContext, useEffect, useState } from "react";

import SectionLearning from "../components/SectionLearning";
import SectionTest from "../components/SectionTest";
import SectionFinish from "../components/SectionFinish";
import { experimentSectionData } from "../config/experimentSectionData";
import TestContext from "../context/TestContext";

type Phase = "learning" | "test" | "finish";

export default function ExperimentContainer() {
  const [phase, setPhase] = useState<Phase>("learning");

  const ctx = useContext(TestContext);

  const currentIndex = ctx?.currentIndex ?? 0;
  const current = experimentSectionData[currentIndex] || null;

  // Ensure phase resets when moving to a new section
  useEffect(() => {
    function setLearningPhase() {
      setPhase("learning");
    }
    setLearningPhase();
  }, [currentIndex]);

  if (!ctx) return null;

  return (
    <div
      className="
      min-h-full
      w-full
      flex
      items-center
      justify-center
      px-4
      py-6
      sm:px-6
      bg-white
    "
    >
      {!current ? (
        <div className="text-center max-w-xl">
          <h2 className="text-2xl font-bold">All sections completed!</h2>
          <p className="mt-4 text-slate-600">
            Thank you for completing the experiment.
          </p>
        </div>
      ) : phase === "learning" ? (
        <SectionLearning
          slides={current.learning}
          onComplete={() => setPhase("test")}
        />
      ) : phase === "test" ? (
        <SectionTest
          questions={current.test}
          onComplete={() => {
            setTimeout(() => setPhase("finish"), 900);
          }}
        />
      ) : (
        <SectionFinish
          title={current.finish.title}
          message={current.finish.message}
          onComplete={() => {
            console.log("CTX NEXT CALLED:: EXPERIMENT-CONTAINER");

            ctx.next();

            setPhase("learning");
          }}
        />
      )}
    </div>
  );
}
