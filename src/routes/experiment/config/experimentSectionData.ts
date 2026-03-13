import { Section1LearningData } from "../sections/section1/Section1LearningData";
import { Section1TestData } from "../sections/section1/Section1TestData";
import { Section1FinishData } from "../sections/section1/Section1FinishData";

import { Section2LearningData } from "../sections/section2/Section2LearningData";
import { Section2TestData } from "../sections/section2/Section2TestData";
import { Section2FinishData } from "../sections/section2/Section2FinishData";

import { Section3LearningData } from "../sections/section3/Section3LearningData";
import { Section3TestData } from "../sections/section3/Section3TestData";
import { Section3FinishData } from "../sections/section3/Section3FinishData";

export const experimentSectionData = [
  {
    learning: Section1LearningData,
    test: Section1TestData,
    finish: Section1FinishData,
  },

  {
    learning: Section2LearningData,
    test: Section2TestData,
    finish: Section2FinishData,
  },

  {
    learning: Section3LearningData,
    test: Section3TestData,
    finish: Section3FinishData,
  },
];
