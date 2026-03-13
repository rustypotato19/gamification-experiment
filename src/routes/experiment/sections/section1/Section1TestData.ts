import type { Question } from "../../types";

export const Section1TestData: Question[] = [
  {
    id: 1,
    prompt: "What term best describes agents such as ChatGPT or Gemini?",

    options: {
      a: "Artificial Intelligence",
      b: "Computer Simulation",
      c: "Large Language Model",
    },

    correct: "c",
    image: "/images/different-languages.jpg",
  },

  {
    id: 2,
    prompt: "How does an LLM generate a response?",

    options: {
      a: "Uses maths to predict statistically likely responses",
      b: "Understands humans and creates ideas",
      c: "Searches the internet for answers",
    },

    correct: "a",
    image: "/gifs/hackerScreen.gif",
  },

  {
    id: 3,
    prompt: "What is required to train an LLM?",

    options: {
      a: "A few computers",
      b: "Huge data centers",
      c: "Nothing",
    },

    correct: "b",
    image: "/images/server-rack.jpg",
  },

  {
    id: 4,
    prompt: "What are the main resources consumed in LLM training?",

    options: {
      a: "Electricity and water",
      b: "Gold and silicon",
      c: "Electricity and metal",
    },

    correct: "a",
    image: "/images/data-center-co2.png",
  },

  {
    id: 5,
    prompt: "What is the main environmental output of training LLMs?",

    options: {
      a: "Noise pollution",
      b: "Light pollution",
      c: "CO₂ emissions",
    },

    correct: "c",
    image: "/images/data-center-co2.png",
  },

  {
    id: 6,
    prompt: "Why are LLM environmental effects rarely discussed?",

    options: {
      a: "There are none",
      b: "They are indirect and hard to see",
      c: "There is no data",
    },

    correct: "b",
    image: "/images/eye.jpg",
  },
];
