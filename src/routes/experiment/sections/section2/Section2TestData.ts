import type { Question } from "../../types";

export const Section2TestData: Question[] = [
  {
    id: 1,
    prompt: "Why does small per-query energy use still matter?",

    options: {
      a: "Each query uses a huge amount of electricity",
      b: "Billions of queries multiply the impact",
      c: "AI runs only once per day",
    },

    correct: "b",
  },

  {
    id: 2,
    prompt: "Which stage of the GPT-3 lifecycle used the most energy overall?",

    options: {
      a: "Model training",
      b: "Daily prompts",
      c: "Annual usage at global scale",
    },

    correct: "c",
  },

  {
    id: 3,
    prompt: "How much electricity was used to train GPT-3?",

    options: {
      a: "~1,300 MWh (~120 homes for a year)",
      b: "~12,000 MWh (~1,000 homes)",
      c: "~260 MWh (~24 homes)",
    },

    correct: "a",
  },

  {
    id: 4,
    prompt: "How much water does a typical GPT-3 conversation roughly use?",

    options: {
      a: "~0.5 glasses",
      b: "~1 glass",
      c: "~2 glasses",
    },

    correct: "b",
  },

  {
    id: 5,
    prompt: "How much CO₂ was produced during GPT-3 training?",

    options: {
      a: "Equivalent to running hundreds of cars for a year",
      b: "Equivalent to running ~3 cars for a year",
      c: "Equivalent to one long-distance flight",
    },

    correct: "a",
  },
];
