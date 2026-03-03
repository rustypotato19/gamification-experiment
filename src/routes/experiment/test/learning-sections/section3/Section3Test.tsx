import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TestContext from "../../TestContext";

/* ---------------------------------- */
/* Choice Constant (consistent pattern) */
/* ---------------------------------- */
const CHOICES = ["a", "b", "c"] as const;
type Choice = (typeof CHOICES)[number];
type Question = {
  id: number;
  prompt: string;
  options: { a: string; b: string; c: string };
  correct: Choice;
  image?: string; // optional
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "What reduces AI-related environmental impact?",
    options: {
      a: "Repeated prompts",
      b: "Intentional and concise usage",
      c: "Using larger models",
    },
    correct: "b",
    image: "/images/intentional-prompts.png",
  },
  {
    id: 2,
    prompt: "When should traditional tools be preferred?",
    options: {
      a: "For simple tasks",
      b: "Never",
      c: "Only for entertainment",
    },
    correct: "a",
  },
  {
    id: 3,
    prompt: "Why do individual actions matter?",
    options: {
      a: "They don’t",
      b: "They scale globally",
      c: "Only companies matter",
    },
    correct: "b",
  },
];

function getDateNow() {
    return Date.now()
}

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */
export default function Section3Test() {
  const ctx = useContext(TestContext);
  const [current, setCurrent] = useState(-1); // -1 = intro
  const [selected, setSelected] = useState<Choice | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const [popups, setPopups] = useState<
    { id: number; x: number; y: number; message: string; positive: boolean }[]
  >([]);

  if (!ctx) return null;

  const isIntro = current === -1;
  const question = QUESTIONS[current];

  const handleAnswerClick = (
    choice: Choice,
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (!question) return;

    const isCorrect = choice === question.correct;
    if (isCorrect) ctx.addCorrect();
    else ctx.addIncorrect();

    const { clientX: x, clientY: y } = e;
    const newPopup = {
      id: getDateNow(),
      x,
      y,
      message: isCorrect ? "Correct!" : "Not quite",
      positive: isCorrect,
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
    <div className="relative flex flex-col items-center justify-center bottom-28">
      <AnimatePresence mode="wait">
        {/* Intro screen */}
        {isIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md text-center"
          >
            <h2 className="text-xl font-semibold">Section 3 Quiz</h2>
            <p className="mt-3">
              Test your understanding of reducing AI's environmental impact.
            </p>
            <button
              onClick={() => setCurrent(0)}
              className="mt-6 bg-indigo-500 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 hover:cursor-pointer transition"
            >
              Start Quiz
            </button>
          </motion.div>
        )}

        {/* Question screen */}
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
              {CHOICES.map((c) => {
                let style = "p-3 rounded-xl ring-1 cursor-pointer transition";

                if (showFeedback) {
                  if (c === question.correct)
                    style += " bg-emerald-300 ring-emerald-700";
                  else if (c === selected) style += " bg-red-300 ring-red-700";
                  else style += " bg-white ring-slate-300";
                } else {
                  style += " bg-white ring-slate-300 hover:bg-indigo-50";
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

      {/* Feedback popups */}
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
