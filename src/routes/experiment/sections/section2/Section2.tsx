import { useContext, useState } from "react";
import SectionLearning from "../../components/SectionLearning";
import SectionTest from "../../components/SectionTest";
import SectionFinish from "../../components/SectionFinish";
import { Section2LearningData } from "./Section2LearningData";
import { Section2TestData } from "./Section2TestData";
import { Section2FinishData } from "./Section2FinishData";

import TestContext from "../../context/TestContext";

export default function Section2() {
  const [step, setStep] = useState<"learning" | "test" | "finish">("learning");

  const ctx = useContext(TestContext);
  if (!ctx) return null;

  function handleNext() {
    if (step === "learning") setStep("test");
    else if (step === "test") setStep("finish");
    else ctx?.next();
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {step === "learning" && (
        <SectionLearning
          slides={Section2LearningData}
          onComplete={handleNext}
        />
      )}
      {step === "test" && (
        <SectionTest questions={Section2TestData} onComplete={handleNext} />
      )}
      {step === "finish" && (
        <SectionFinish
          title={Section2FinishData.title}
          message={Section2FinishData.message}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
