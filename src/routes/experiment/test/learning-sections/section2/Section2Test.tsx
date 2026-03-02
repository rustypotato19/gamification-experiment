import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TestContext from "../../TestContext";

type Choice = "a" | "b" | "c";

type Question = {
  id: number;
  prompt: string;
  options: { a: string; b: string; c: string };
  correct: Choice;
  image?: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "Why can small per-query energy use still matter?",
    options: {
      a: "Because each query uses a lot of electricity",
      b: "Because billions of queries multiply the total impact",
      c: "Because AI runs only once per day",
    },
    correct: "b",
    image: "/gifs/multiplying-co2.gif",
  },
  {
    id: 2,
    prompt: "Which phase of AI typically consumes the most energy?",
    options: {
      a: "Training large models",
      b: "Daily user prompts",
      c: "Shutting servers down",
    },
    correct: "a",
    image: "/images/AI-training-cars.png",
  },
  {
    id: 3,
    prompt: "Why does model size matter?",
    options: {
      a: "Larger models need more GPUs and electricity",
      b: "Larger models use less energy",
      c: "Model size has no environmental effect",
    },
    correct: "a",
    image: "/images/complexity-env-impact-graph.png",
  },
  {
    id: 4,
    prompt: "How does energy source affect AI impact?",
    options: {
      a: "Energy source doesn't matter",
      b: "Renewables reduce carbon emissions",
      c: "Coal produces fewer emissions",
    },
    correct: "b",
    image: "/images/energies.png",
  },
  {
    id: 5,
    prompt: "How can user behaviour reduce environmental impact?",
    options: {
      a: "By sending repeated unnecessary prompts",
      b: "By using AI intentionally and concisely",
      c: "By increasing model size",
    },
    correct: "b",
    image: "/images/intentional-prompts.png",
  },
];

function getDateNow() {
  return Date.now();
}

export default function Section2Test() {
  const ctx = useContext(TestContext);

  const [current, setCurrent] = useState(-1);
  const [selected, setSelected] = useState<Choice | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const [popups, setPopups] = useState<
    { id: number; x: number; y: number; message: string; positive: boolean }[]
  >([]);

  const isIntro = current === -1;
  const question = QUESTIONS[current];

  if (!ctx) return null;

  const handleAnswerClick = (
    choice: Choice,
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (!question) return;

    const correct = choice === question.correct;
    if (correct) ctx.addCorrect();
    else ctx.addIncorrect();

    const { clientX: x, clientY: y } = e;
    const newPopup = {
      id: getDateNow(),
      x,
      y,
      message: correct ? "Correct!" : "Not quite",
      positive: correct,
    };

    setPopups((prev) => [...prev, newPopup]);
    setTimeout(
      () => setPopups((prev) => prev.filter((p) => p.id !== newPopup.id)),
      1000,
    );

    setSelected(choice);
    setShowFeedback(true);

    setTimeout(() => {
      setSelected(null);
      setShowFeedback(false);

      if (current < QUESTIONS.length - 1) setCurrent((c) => c + 1);
      else ctx.next();
    }, 800);
  };

  return (
    <div className="relative bottom-28 flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {isIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md text-center"
          >
            <h2 className="text-xl font-semibold">Section 2 Quiz</h2>
            <p className="mt-3">
              Let's test your understanding of AI's scale and impact.
            </p>
            <button
              onClick={() => setCurrent(0)}
              className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-2xl hover:bg-orange-700 hover:cursor-pointer transition"
            >
              Start Quiz
            </button>
          </motion.div>
        )}

        {current >= 0 && question && (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl bg-white border-2 border-neutral-200 p-6 rounded-2xl drop-shadow-xl flex flex-col gap-4"
          >
            <h2 className="text-lg font-semibold">
              Question {current + 1} / {QUESTIONS.length}
            </h2>

            <p>{question.prompt}</p>

            {question.image && (
              <div className="flex justify-center items-center w-full max-w-160 h-60 overflow-clip">
                <img
                  src={question.image}
                  alt="Question visual"
                  className="max-w-full h-full rounded"
                />
              </div>
            )}

            <div className="flex flex-col gap-3 mt-4">
              {(["a", "b", "c"] as Choice[]).map((c) => {
                let style = "p-3 rounded-xl ring-1 cursor-pointer transition";

                if (showFeedback) {
                  if (c === question.correct)
                    style += " bg-emerald-300 ring-emerald-700";
                  else if (c === selected) style += " bg-red-300 ring-red-700";
                  else style += " bg-white ring-slate-300";
                } else {
                  style += " bg-white ring-slate-300 hover:bg-orange-50";
                }

                return (
                  <div
                    key={c}
                    className={style}
                    onClick={(e) => !showFeedback && handleAnswerClick(c, e)}
                  >
                    <strong className="mr-2">{c})</strong>
                    {question.options[c]}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 pointer-events-none z-50">
        {popups.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -30 }}
            transition={{ duration: 1 }}
            style={{ position: "absolute", left: p.x, top: p.y }}
            className={`px-3 py-1 rounded-lg text-white font-semibold ${
              p.positive ? "bg-emerald-500" : "bg-red-500"
            }`}
          >
            {p.message}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
