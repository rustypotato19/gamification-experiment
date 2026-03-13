import { useContext, useState } from "react";

import SectionLearning from "../components/SectionLearning";
import SectionTest from "../components/SectionTest";
import SectionFinish from "../components/SectionFinish";
import { experimentSectionData } from "../config/experimentSectionData";
import TestContext from "../context/TestContext";

type Phase = "learning" | "test" | "finish";

export default function ExperimentContainer() {
  const [section, setSection] = useState(0);
  const [phase, setPhase] = useState<Phase>("learning");

  const current = experimentSectionData[section];

  const ctx = useContext(TestContext);
  if (!ctx) return null;

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

  const { title, message } = current.finish;

  if (phase === "finish")
    return <SectionFinish title={title} message={message} />;
}
