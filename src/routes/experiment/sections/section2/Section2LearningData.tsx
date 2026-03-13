import type { Step } from "../../types";

export const Section2LearningData: Step[] = [
  {
    title: (
      <div className="flex flex-col gap-4">
        <span className="text-xl sm:text-2xl">Section 2 of 3</span>
        Focusing on CO₂, Electricity and Water
      </div>
    ),

    text: (
      <div className="flex justify-center items-center">
        <p className="text-md sm:text-lg mt-4">
          In this section we'll look at how much resources LLM training and
          usage requires, and <i>why scale matters</i>.
        </p>
      </div>
    ),
  },

  {
    title: "Training vs. Usage",

    text: (
      <div className="flex flex-col justify-center items-center">
        <p>
          <b>Training</b> an LLM is extremely resource intensive upfront.
        </p>

        <p>
          <i>However</i>, when <b>using</b> an LLM the resource consumption
          accumulates over long periods of time.
        </p>

        <div className="flex flex-row justify-center items-center px-4 gap-4 mt-6">
          <img src="/images/chatgpt-logo.png" className="w-20" />
          <p className="font-bold">Let's talk about GPT-3.</p>
        </div>
      </div>
    ),
  },

  {
    title: "Why Scale Matters",

    text: (
      <div className="flex flex-col justify-center items-center gap-4">
        <p>A single AI prompt doesn't seem like much.</p>

        <p>
          But globally, ChatGPT receives around
          <b> 2.5 billion prompts per day</b>.
        </p>

        <p>
          When billions of people use AI daily, the small cost of each prompt
          becomes extremely large.
        </p>
      </div>
    ),
  },

  {
    title: "GPT-3: Electricity",

    text: (
      <div className="flex flex-col justify-center items-center gap-4">
        <div>
          <p>
            GPT-3 used roughly <b>~1,300 MWh</b> of electricity for one training
            run.
          </p>

          <p className="text-xs text-neutral-700">
            Roughly equal to powering ~120 US homes for a year.
          </p>
        </div>

        <div className="flex w-full justify-around overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <img key={i} src="/gifs/electric.gif" className="w-10" />
          ))}
        </div>

        <div>
          <p>Per query this drops to about ~1 Wh.</p>

          <p className="italic mt-2">365 × 2.5B queries × 1 Wh ≈ 912,500 MWh</p>

          <p className="text-xs text-neutral-700">
            Roughly the electricity used by ~82,400 homes per year.
          </p>
        </div>
      </div>
    ),
  },

  {
    title: "GPT-3: Water",

    text: (
      <div className="flex flex-col justify-center items-center gap-4">
        <div>
          <p>
            GPT-3 used roughly <b>~700,000 L</b> of water during training.
          </p>

          <p className="text-xs text-neutral-700">
            Roughly 0.25 Olympic swimming pools.
          </p>
        </div>

        <div className="flex w-full justify-around overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <img key={i} src="/gifs/water-drop.gif" className="w-10" />
          ))}
        </div>

        <div>
          <p>Per query this drops to roughly ~0.3 ml.</p>

          <p className="italic mt-2">
            365 × 2.5B × 0.3 ml ≈ <b>280 million litres</b>
          </p>

          <p className="text-xs text-neutral-700">
            Roughly 112 Olympic swimming pools.
          </p>
        </div>
      </div>
    ),
  },

  {
    title: "GPT-3: CO₂",

    text: (
      <div className="flex flex-col justify-center items-center gap-4">
        <div>
          <p>
            GPT-3 emitted roughly <b>~500 tonnes CO₂</b> during training.
          </p>

          <p className="text-xs text-neutral-700">
            About the emissions of ~100 cars for one year.
          </p>
        </div>

        <div className="flex w-full justify-around overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <img key={i} src="/gifs/co2.gif" className="w-10" />
          ))}
        </div>

        <div>
          <p>Per query this drops to ~0.1 grams.</p>

          <p className="italic mt-2">
            365 × 2.5B × 0.1g ≈ <b>91,250 tonnes CO₂</b>
          </p>

          <p className="text-xs text-neutral-700">
            Equivalent to roughly 18,000 cars driving for a year.
          </p>
        </div>
      </div>
    ),
  },

  {
    title: "GPT-3 is Old",

    text: (
      <div className="flex flex-col justify-center items-center gap-4">
        <p>
          GPT-3 is now very outdated. As of 2026 the newest release is GPT-5.2.
        </p>

        <img src="/images/old-robot.jpeg" className="max-w-40" />

        <p>
          Each new generation of models requires significantly more resources to
          train.
        </p>

        <p>
          Some reports estimate GPT-4 was roughly
          <b> 8.5× more resource intensive</b> than GPT-3.
        </p>
      </div>
    ),
  },

  {
    title: "The Numbers",

    text: (
      <div className="flex flex-col justify-center items-center gap-4">
        <p>
          These values should be taken <i>with a pinch of salt</i>.
        </p>

        <p>
          Companies rarely disclose full environmental data, but research and
          analysis has produced useful estimates.
        </p>

        <p className="font-semibold mt-4">
          Let's see what you've learnt from Section 2.
        </p>
      </div>
    ),

    isFinal: true,
  },
];
