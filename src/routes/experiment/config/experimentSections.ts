import FinishingScreen from "../FinishingScreen";
import Section1 from "../sections/section1/Section1";
import Section2 from "../sections/section2/Section2";
import Section3 from "../sections/section3/Section3";

export const experimentSections: React.FC<{ onComplete?: () => void }>[] = [
  Section1,
  Section2,
  Section3,
  FinishingScreen,
];
