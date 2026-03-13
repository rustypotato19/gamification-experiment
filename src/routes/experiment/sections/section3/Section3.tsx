import { useContext, useState } from "react";
import SectionLearning from "../../components/SectionLearning";
import SectionTest from "../../components/SectionTest";
import SectionFinish from "../../components/SectionFinish";
import { Section3LearningData } from "./Section3LearningData";
import { Section3TestData } from "./Section3TestData";
import { Section3FinishData } from "./Section3FinishData";

import TestContext from "../../context/TestContext";

export default function Section3() {
  const [step, setStep] = useState<"learning" | "test" | "finish">("learning");

  const ctx = useContext(TestContext);
  if (!ctx) return null;

  function handleNext() {
    console.log("SECTION-3 STEP NEXT CALLED", step);
    if (step === "learning") setStep("test");
    else if (step === "test") setStep("finish");
    // **do NOT call ctx.next() here for finish**
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {step === "learning" && (
        <SectionLearning
          slides={Section3LearningData}
          onComplete={handleNext}
        />
      )}
      {step === "test" && (
        <SectionTest questions={Section3TestData} onComplete={handleNext} />
      )}
      {step === "finish" && (
        <SectionFinish
          title={Section3FinishData.title}
          message={Section3FinishData.message}
          onComplete={handleNext}
        />
      )}
    </div>
  );
}
