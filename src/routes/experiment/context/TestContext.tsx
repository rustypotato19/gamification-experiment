import { createContext } from "react";

export type TestContextType = {
  pts: number;
  streak: number;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  next: () => void;
  addCorrect: (multiplier?: number) => void;
  addIncorrect: () => void;
  testMilestonesType: TestMilestonesType;
};

export type TestMilestonesType = {
  section1Pts: number;
  section1Streak: number;
  section1StartTime: number | null;
  section1EndTime: number | null;
  section1Correct: number;
  section1Incorrect: number;
  setSection1Pts: (pts: number) => void;
  setSection1Streak: (streak: number) => void;
  setSection1StartTime: (miliseconds: number) => void;
  setSection1EndTime: (miliseconds: number) => void;
  setSection1Correct: (numCorrect: number) => void;
  setSection1Incorrect: (numIncorrect: number) => void;

  section2Pts: number;
  section2Streak: number;
  section2StartTime: number | null;
  section2EndTime: number | null;
  section2Correct: number;
  section2Incorrect: number;
  setSection2Pts: (pts: number) => void;
  setSection2Streak: (streak: number) => void;
  setSection2StartTime: (miliseconds: number) => void;
  setSection2EndTime: (miliseconds: number) => void;
  setSection2Correct: (numCorrect: number) => void;
  setSection2Incorrect: (numIncorrect: number) => void;

  section3Pts: number;
  section3Streak: number;
  section3StartTime: number | null;
  section3EndTime: number | null;
  section3Correct: number;
  section3Incorrect: number;
  setSection3Pts: (pts: number) => void;
  setSection3Streak: (streak: number) => void;
  setSection3StartTime: (miliseconds: number) => void;
  setSection3EndTime: (miliseconds: number) => void;
  setSection3Correct: (numCorrect: number) => void;
  setSection3Incorrect: (numIncorrect: number) => void;
};

const TestContext = createContext<TestContextType | null>(null);

export default TestContext;
