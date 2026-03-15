import type { Question } from "../../types";

export const Section3TestData: Question[] = [
  {
    id: 1,
    prompt: "Why do individual actions matter?",

    options: {
      a: "They don't",
      b: "They can scale globally",
      c: "Only companies matter",
    },

    correct: "b",
    image: "/images/globe-hands.png",
  },

  {
    id: 2,
    prompt: "What reduces LLM environmental impact?",

    options: {
      a: "Repeated prompts",
      b: "Intentional and concise usage",
      c: "Using larger models",
    },

    correct: "b",
    image: "/images/intentional-prompts.png",
  },

  {
    id: 3,
    prompt: "What can reduce the carbon emissions of LLM data centres?",

    options: {
      a: "Nothing",
      b: "Burning more fossil fuels",
      c: "Switching to renewable energy",
    },

    correct: "c",
    image: "/images/renewable-energy.jpg",
  },

  {
    id: 4,
    prompt: "Which change could reduce LLM resource consumption?",

    options: {
      a: "Simplifying LLMs for specific tasks",
      b: "Creating larger general models",
      c: "Sending more prompts",
    },

    correct: "a",
  },

  {
    id: 5,
    prompt: "When should traditional tools be used instead of LLMs?",

    options: {
      a: "Always",
      b: "Never",
      c: "As the first option",
    },

    correct: "c",
  },
];
