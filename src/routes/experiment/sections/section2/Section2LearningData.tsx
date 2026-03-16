import type { Step } from "../../types";

export const Section2LearningData: Step[] = [
  {
    title: (
      <div className="flex flex-col gap-2 sm:gap-4 text-center sm:text-left">
        <span className="text-lg sm:text-2xl font-semibold">
          Section 2 of 3
        </span>
        <span className="text-sm sm:text-xl text-slate-700">
          Focusing on CO₂, Electricity, and Water
        </span>
      </div>
    ),
    text: (
      <div className="flex flex-col items-center mt-4 gap-4 max-w-xl text-center sm:text-left">
        <p className="text-sm sm:text-lg">
          In this section we'll look at how much resources LLM training and
          usage requires, and <i>why scale matters</i>.
        </p>
      </div>
    ),
  },

  {
    title: "Training vs. Usage",
    text: (
      <div className="flex flex-col items-center gap-4 text-center sm:text-left">
        <p>
          <b>Training</b> an LLM is extremely resource intensive upfront.
        </p>
        <p>
          <i>However</i>, using an LLM accumulates resource consumption over
          time.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
          <img
            src="/images/chatgpt-logo.png"
            alt="ChatGPT logo"
            className="w-16 sm:w-20"
          />
          <p className="font-bold">Let's talk about GPT-3.</p>
        </div>
      </div>
    ),
  },

  {
    title: "Why Scale Matters",
    text: (
      <div className="flex flex-col items-center gap-4 text-center sm:text-left max-w-xl">
        <p>A single AI prompt doesn't seem like much.</p>
        <p>
          But globally, ChatGPT receives around{" "}
          <b>2.5 billion prompts per day</b>.
        </p>
        <p>
          When billions of people use AI daily, the small cost of each prompt
          becomes massive.
        </p>
      </div>
    ),
  },

  {
    title: "GPT-3: Electricity",
    text: (
      <div className="flex flex-col items-center gap-4 text-center sm:text-left">
        <p>
          GPT-3 used roughly <b>~1,300 MWh</b> of electricity for one training
          run.
        </p>
        <p className="text-xs text-neutral-700">
          ≈ powering 120 US homes for a year.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <img
              key={i}
              src="/gifs/electric.gif"
              alt="Electricity usage"
              className="w-10 h-auto"
            />
          ))}
        </div>

        <p>Per query this drops to ~1 Wh.</p>
        <p className="italic">365 × 2.5B queries × 1 Wh ≈ 912,500 MWh</p>
        <p className="text-xs text-neutral-700">
          ≈ electricity for 82,400 homes/year
        </p>
      </div>
    ),
  },

  {
    title: "GPT-3: Water",
    text: (
      <div className="flex flex-col items-center gap-4 text-center sm:text-left">
        <p>
          GPT-3 used roughly <b>~700,000 L</b> of water during training.
        </p>
        <p className="text-xs text-neutral-700">
          ≈ 0.25 Olympic swimming pools.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <img
              key={i}
              src="/gifs/water-drop.gif"
              alt="Water usage"
              className="w-10 h-auto"
            />
          ))}
        </div>

        <p>Per query ≈ 0.3 ml.</p>
        <p className="italic">
          365 × 2.5B × 0.3 ml ≈ <b>280 million litres</b>
        </p>
        <p className="text-xs text-neutral-700">≈ 112 Olympic swimming pools</p>
      </div>
    ),
  },

  {
    title: "GPT-3: CO₂",
    text: (
      <div className="flex flex-col items-center gap-4 text-center sm:text-left">
        <p>
          GPT-3 emitted roughly <b>~500 tonnes CO₂</b> during training.
        </p>
        <p className="text-xs text-neutral-700">≈ emissions of 100 cars/year</p>

        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <img
              key={i}
              src="/gifs/co2.gif"
              alt="CO2 emissions"
              className="w-10 h-auto"
            />
          ))}
        </div>

        <p>Per query ≈ 0.1 grams.</p>
        <p className="italic">
          365 × 2.5B × 0.1g ≈ <b>91,250 tonnes CO₂</b>
        </p>
        <p className="text-xs text-neutral-700">
          ≈ emissions from 18,000 cars/year
        </p>
      </div>
    ),
  },

  {
    title: "GPT-3 is Old",
    text: (
      <div className="flex flex-col items-center gap-4 text-center sm:text-left max-w-xl">
        <p>GPT-3 is outdated. As of 2026, the latest is GPT-5.2.</p>
        <img
          src="/images/old-robot.jpeg"
          alt="Old robot"
          className="w-32 sm:w-40 rounded-lg shadow-md"
        />
        <p>
          Each new model generation requires significantly more resources to
          train.
        </p>
        <p>
          GPT-4 was roughly <b>8.5× more resource intensive</b> than GPT-3.
        </p>
      </div>
    ),
  },

  {
    title: "The Numbers",
    text: (
      <div className="flex flex-col items-center gap-4 text-center sm:text-left max-w-xl">
        <p>
          These values are approximate and should be taken{" "}
          <i>with a pinch of salt</i>.
        </p>
        <p>
          Companies rarely disclose full environmental data, but research
          provides useful estimates.
        </p>
        <p className="font-semibold mt-2">
          Let's see what you've learnt from Section 2!
        </p>
      </div>
    ),
    isFinal: true,
  },
];
