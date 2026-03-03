import { useState } from "react";
import TestContext from "./TestContext";

type Props = {
  children: React.ReactNode;
};

export default function TestProvider({ children }: Props) {
  const [pts, setPts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Section 1
  const [section1Pts, setSection1Pts] = useState(0);
  const [section1Streak, setSection1Streak] = useState(0);
  const [section1StartTime, setSection1StartTime] = useState<number | null>(null);
  const [section1EndTime, setSection1EndTime] = useState<number | null>(null);
  const [section1Correct, setSection1Correct] = useState(0);
  const [section1Incorrect, setSection1Incorrect] = useState(0);

  // Section 2
  const [section2Pts, setSection2Pts] = useState(0);
  const [section2Streak, setSection2Streak] = useState(0);
  const [section2StartTime, setSection2StartTime] = useState<number | null>(null);
  const [section2EndTime, setSection2EndTime] = useState<number | null>(null);
  const [section2Correct, setSection2Correct] = useState(0);
  const [section2Incorrect, setSection2Incorrect] = useState(0);

  const addCorrect = (multiplier?: number) => {
    const basePts = multiplier ? multiplier * 100 : 100;
    const streakMultiplier = 1 + streak * 0.2;

    setPts((x) => x + basePts * streakMultiplier);
    setStreak((s) => s + 1);

    if (currentIndex <= 5) {
      // Section 1
      if (currentIndex < 2) {
        setSection1Pts((p) => p + basePts * streakMultiplier);
        setSection1Streak((s) => s + 1);
        setSection1Correct((c) => c + 1);
      } else {
        // Section 2
        setSection2Pts((p) => p + basePts * streakMultiplier);
        setSection2Streak((s) => s + 1);
        setSection2Correct((c) => c + 1);
      }
    }
  };

  const addIncorrect = () => {
    setStreak(0);

    if (currentIndex <= 5) {
      if (currentIndex < 2) setSection1Incorrect((c) => c + 1);
      else setSection2Incorrect((c) => c + 1);
    }
  };

  const next = () => {
    setCurrentIndex((i) => i + 1);
  };

  const testMilestonesType = {
    section1Pts,
    section1Streak,
    section1StartTime,
    section1EndTime,
    section1Correct,
    section1Incorrect,
    setSection1Pts,
    setSection1Streak,
    setSection1StartTime,
    setSection1EndTime,
    setSection1Correct,
    setSection1Incorrect,

    section2Pts,
    section2Streak,
    section2StartTime,
    section2EndTime,
    section2Correct,
    section2Incorrect,
    setSection2Pts,
    setSection2Streak,
    setSection2StartTime,
    setSection2EndTime,
    setSection2Correct,
    setSection2Incorrect,
  };

  return (
    <TestContext.Provider
      value={{
        pts,
        streak,
        currentIndex,
        setCurrentIndex,
        next,
        addCorrect,
        addIncorrect,
        testMilestonesType,
      }}
    >
      {children}
    </TestContext.Provider>
  );
}
