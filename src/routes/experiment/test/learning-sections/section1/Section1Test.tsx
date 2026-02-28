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
    prompt:
      "Which one of the following statements about data centers' environmental impact is true?",
    options: {
      a: "Data centers use large amounts of energy and water",
      b: "Data centers do not use large amounts of energy or water",
      c: "Data centers only use energy but not water",
    },
    correct: "a",
    image: "/images/data-center-co2.png",
  },
  {
    id: 2,
    prompt:
      "What is the effect of data centers' energy use on the environment?",
    options: {
      a: "The effect is negligible",
      b: "Data centers largely contribute to CO₂ emissions",
      c: "Data centers provide water for local communities",
    },
    correct: "b",
  },
  {
    id: 3,
    prompt: "Why do data centers use large amounts of water?",
    options: {
      a: "Cleaning and maintenance",
      b: "Cooling servers efficiently",
      c: "Generating electricity on-site",
    },
    correct: "b",
    image: "/images/data-center-cooling.jpg",
  },
  {
    id: 4,
    prompt: "Which approach helps reduce AI's energy use?",
    options: {
      a: "Using smaller/optimised AI models",
      b: "Spending less time optimising models",
      c: "Running models on older hardware",
    },
    correct: "a",
    image: "/images/energy-efficiency.png",
  },
  {
    id: 5,
    prompt:
      "What is a key physical factor in a data center's environmental impact?",
    options: {
      a: "The number of servers and their energy efficiency",
      b: "The location of the data center",
      c: "Brand of network switches",
    },
    correct: "a",
    image: "/images/server-rack.jpg",
  },
  {
    id: 6,
    prompt: "Which part of server racks make them so energy-intensive?",
    options: {
      a: "The CPUs",
      b: "The GPUs",
      c: "The RAM",
    },
    correct: "b",
    image: "/images/gpu.jpg",
  },
];

export default function Section1Test() {
  const ctx = useContext(TestContext);

  const [current, setCurrent] = useState(-1); // -1 = intro
  const [selected, setSelected] = useState<Choice | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const [popups, setPopups] = useState<
    { id: number; x: number; y: number; message: string; positive: boolean }[]
  >([]);
  const popupIdRef = useState(0)[0];

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
      id: popupIdRef + 1,
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
      else ctx.next(); // end of quiz, go to next section
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
            <h2 className="text-xl font-semibold">Time for a Quiz!</h2>
            <p className="mt-3">
              Let's test your knowledge on AI's environmental impact.
            </p>
            <button
              onClick={() => setCurrent(0)}
              className="mt-6 bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-700 hover:cursor-pointer transition"
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
              <img
                src={question.image}
                alt="Question visual"
                className="mt-4 max-w-sm mx-auto rounded"
              />
            )}
            <div className="flex flex-col gap-3 mt-4">
              {(["a", "b", "c"] as Choice[]).map((c) => {
                const isSelected = selected === c;
                let style = "p-3 rounded-xl ring-1 cursor-pointer transition";

                if (showFeedback) {
                  if (c === question.correct)
                    style += " bg-emerald-300 ring-emerald-700";
                  else if (c === selected) style += " bg-red-300 ring-red-700";
                  else style += " bg-white ring-slate-300";
                } else {
                  style += isSelected
                    ? " bg-slate-100 ring-slate-500"
                    : " bg-white ring-slate-300 hover:bg-slate-100";
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
