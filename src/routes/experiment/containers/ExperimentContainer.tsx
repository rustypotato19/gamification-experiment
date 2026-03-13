import { useState } from "react";

import SectionLearning from "../components/SectionLearning";
import SectionTest from "../components/SectionTest";
import SectionFinish from "../components/SectionFinish";
import { experimentSectionData } from "../config/experimentSectionData";

type Phase = "learning" | "test" | "finish";

export default function ExperimentContainer() {
  const [section, setSection] = useState(0);
  const [phase, setPhase] = useState<Phase>("learning");

  const current = experimentSectionData[section];

  if (phase === "learning")
    return (
      <SectionLearning
        slides={current.learning}
        onComplete={() => setPhase("test")}
      />
    );

  if (phase === "test")
    return (
      <SectionTest
        questions={current.test}
        onComplete={() => setPhase("finish")}
      />
    );

  if (phase === "finish")
    return (
      <SectionFinish
        {...current.finish}
        onNext={() => {
          if (section < experimentSectionData.length - 1) {
            setSection((s) => s + 1);
            setPhase("learning");
          }
        }}
      />
    );
}
