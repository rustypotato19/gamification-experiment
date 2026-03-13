import { useContext, useState } from "react";

import SectionLearning from "../components/SectionLearning";
import SectionTest from "../components/SectionTest";
import SectionFinish from "../components/SectionFinish";
import { experimentSectionData } from "../config/experimentSectionData";
import TestContext from "../context/TestContext";

type Phase = "learning" | "test" | "finish";

export default function ExperimentContainer() {
  const [phase, setPhase] = useState<Phase>("learning");
  const ctx = useContext(TestContext);
  if (!ctx) return null;

  const currentIndex = ctx.currentIndex;
  const current = experimentSectionData[currentIndex];

  if (!current) {
    // All sections completed → optional final screen
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold">All sections completed!</h2>
        <p className="mt-4">Thank you for completing the experiment.</p>
      </div>
    );
  }

  // Learning phase
  if (phase === "learning") {
    return (
      <SectionLearning
        slides={current.learning}
        onComplete={() => setPhase("test")}
      />
    );
  }

  // Test phase
  if (phase === "test") {
    return (
      <SectionTest
        questions={current.test}
        onComplete={() => {
          // small delay for animation
          setTimeout(() => setPhase("finish"), 800);
        }}
      />
    );
  }

  // Finish phase
  const { title, message } = current.finish;
  if (phase === "finish") {
    return (
      <SectionFinish
        title={title}
        message={message}
        onComplete={() => {
          // increment context index (moves to next section)
          console.log("CTX NEXT CALLED:: EXPERIMENT-CONTAINER");
          ctx.next();

          // reset phase to learning for the new section
          setPhase("learning");
        }}
      />
    );
  }

  return null;
}
