import { useContext, useState } from "react";
import SectionLearning from "../../components/SectionLearning";
import SectionTest from "../../components/SectionTest";
import SectionFinish from "../../components/SectionFinish";
import { Section1LearningData } from "./Section1LearningData";
import { Section1TestData } from "./Section1TestData";
import { Section1FinishData } from "./Section1FinishData";

import TestContext from "../../context/TestContext";

export default function Section1() {
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
          slides={Section1LearningData}
          onComplete={handleNext}
        />
      )}
      {step === "test" && (
        <SectionTest questions={Section1TestData} onComplete={handleNext} />
      )}
      {step === "finish" && (
        <SectionFinish
          title={Section1FinishData.title}
          message={Section1FinishData.message}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
