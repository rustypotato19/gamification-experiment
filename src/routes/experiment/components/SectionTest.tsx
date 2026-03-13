import { useContext, useState } from "react";
import TestContext from "../context/TestContext";
import MediaFrame from "./MediaFrame";

type Choice = "a" | "b" | "c";

type Question = {
  id: number;
  prompt: string;
  options: {
    a: string;
    b: string;
    c: string;
  };
  correct: Choice;
  image?: string;
};

type Props = {
  questions: Question[];
  onComplete: () => void;
};

export default function SectionTest({ questions, onComplete }: Props) {
  const ctx = useContext(TestContext);

  const [index, setIndex] = useState(0);

  const question = questions[index];

  const [selected, setSelected] = useState<Choice | null>(null);

  if (!ctx) return null;

  function answer(choice: Choice) {
    const correct = choice === question.correct;

    if (ctx && correct) ctx.addCorrect();
    else ctx?.addIncorrect();

    setSelected(choice);

    setTimeout(() => {
      setSelected(null);

      if (index < questions.length - 1) setIndex((i) => i + 1);
      else onComplete();
    }, 250);
  }

  return (
    <div className="bg-white max-w-xl w-full p-6 rounded-2xl drop-shadow-lg border border-black/20 flex flex-col gap-4">
      <h2 className="font-semibold">
        Question {index + 1} / {questions.length}
      </h2>

      <p>{question.prompt}</p>

      {question.image && <MediaFrame src={question.image} />}

      <div className="flex flex-col gap-3">
        {(["a", "b", "c"] as Choice[]).map((choice) => {
          let style = `p-3 rounded-xl ring-1 cursor-pointer transition ${!selected && "hover:bg-neutral-300"}`;

          if (selected) {
            if (choice === question.correct) style += " bg-emerald-300";
            else if (choice === selected) style += " bg-red-300";
          }

          return (
            <div
              key={choice}
              className={style}
              onClick={() => !selected && answer(choice)}
            >
              <strong className="mr-2">{choice})</strong>

              {question.options[choice]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
