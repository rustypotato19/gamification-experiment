import { useState } from "react";
import type { Step } from "../types";

type Props = {
  slides: Step[];
  onComplete: () => void;
};

export default function SectionLearning({ slides, onComplete }: Props) {
  const [index, setIndex] = useState(0);

  const slide = slides[index];

  function next() {
    if (index < slides.length - 1) setIndex((i) => i + 1);
    else onComplete();
  }

  return (
    <div className="bg-white max-w-xl w-full p-6 rounded-2xl drop-shadow-lg border border-black/20 flex flex-col gap-4">
      <h2 className="text-xl font-semibold">{slide.title}</h2>

      <p>{slide.text}</p>

      {/* {slide.image && <MediaFrame src={slide.image} />} */}

      <button
        onClick={next}
        className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 hover:cursor-pointer"
      >
        Continue
      </button>
    </div>
  );
}
