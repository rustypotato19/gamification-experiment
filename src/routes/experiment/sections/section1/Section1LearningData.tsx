import type { Step } from "../../types";

export const Section1LearningData: Step[] = [
  {
    title: (
      <div className="flex flex-col gap-2 sm:gap-4 text-center sm:text-left">
        <span className="text-lg sm:text-2xl font-semibold">
          Section 1 of 3
        </span>
        <span className="text-sm sm:text-xl text-slate-700">
          What is AI? And how does it affect the environment?
        </span>
      </div>
    ),
    text: (
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-4">
        <p className="text-sm sm:text-lg max-w-md sm:max-w-xl text-center sm:text-left">
          In this section, you'll be introduced to "<b>AI</b>", its general
          impacts on the environment and why these impacts are often invisible.
        </p>
        <img
          src="/images/ai-robot.png"
          alt="AI robot illustration"
          className="w-full max-w-xs sm:max-w-sm h-auto rounded-lg shadow-md"
        />
      </div>
    ),
  },

  {
    title: 'What actually is "AI"?',
    text: (
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm sm:text-base max-w-lg text-center">
          <b>AI</b> is a scary term, but most AI systems like ChatGPT or Gemini
          are actually <b>Large Language Models (LLMs)</b>.
        </p>
        <img
          src="/images/different-languages.jpg"
          alt="Different languages"
          className="w-full max-w-xs sm:max-w-md rounded-lg shadow-md"
        />
      </div>
    ),
  },

  {
    title: "LLMs",
    text: (
      <div className="flex flex-col items-center gap-4 text-center sm:text-left">
        <p>
          LLMs <i>scan millions of text files</i> and calculate what word should
          come next.
        </p>
        <img
          src="/gifs/hackerScreen.gif"
          alt="LLM processing"
          className="w-full max-w-xs sm:max-w-md rounded-2xl shadow-lg"
        />
        <p>
          They don’t understand—they calculate statistical probabilities for
          responses.
        </p>
        <p>
          Modern LLMs can be manually tuned during training, but it’s
          complicated.
        </p>
      </div>
    ),
  },

  {
    title: "Why does this matter?",
    text: (
      <div className="flex flex-col items-center gap-4 text-center">
        <p>
          Training AI models is <b>extremely intensive</b>.
        </p>
        <p>
          Requires <i>millions of simulation hours</i> and
          <span className="mx-1 italic font-bold applyElectricFont animate-grow-once">huge</span>{" "}
          processing power.
        </p>
        <p>
          <b>This is where the problems start.</b>
        </p>
      </div>
    ),
  },

  {
    title: "Data Centers",
    text: (
      <div className="flex flex-col items-center gap-4 text-center sm:text-left">
        <p>Massive data centers are used to train LLM models.</p>
        <img
          src="/images/server-rack.jpg"
          alt="Data center racks"
          className="w-full max-w-xs sm:max-w-md rounded-2xl shadow-lg"
        />
        <p>Thousands of CPUs, GPUs, and terabytes of RAM are used.</p>
        <p>Running these centers consumes a huge amount of energy.</p>
      </div>
    ),
  },

  {
    title: "Data Centers II",
    text: (
      <div className="flex flex-col items-center gap-4 text-center sm:text-left">
        <p>
          Training LLMs requires lots of water and electricity, producing
          significant <b>CO₂</b>.
        </p>
        <img
          src="/images/data-center-co2.png"
          alt="Data center CO2 emissions"
          className="w-full max-w-xs sm:max-w-md rounded-lg shadow-md"
        />
        <p>Most electricity still comes from fossil fuels.</p>
        <p>
          Water is pumped into servers for cooling, which also uses electricity.
        </p>
      </div>
    ),
  },

  {
    title: "Invisible Impact",
    text: (
      <div className="flex flex-col items-center gap-4 text-center">
        <p>This is why the environmental impact of AI is hard to see.</p>
        <p>Hidden behind utility and convenience.</p>
        <img
          src="/images/eye.jpg"
          alt="Invisible impact"
          className="w-32 sm:w-48 rounded-lg shadow-md"
        />
        <p>Education on this topic is important.</p>
        <p className="font-semibold">Time for a quiz!</p>
      </div>
    ),
    isFinal: true,
  },
];
