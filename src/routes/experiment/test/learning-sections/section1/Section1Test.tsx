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
      a: "It uses maths to predict the most statistically probable repsonse",
      b: "It simply understands us, and has opinions and creative ability of its own",
      c: "It searches the internet for a response to your question, and provides the first response",
    },
    correct: "a",
    image: "/gifs/hackerScreen.gif",
  },
  {
    id: 3,
    prompt: "What is required to train an LLM?",
    options: {
      a: "A few computers in an I.T. room",
      b: "Huge data centers filled with computational components",
      c: "There is no requirements, the LLM knows what to do",
    },
    correct: "b",
    image: "/images/server-rack.jpg",
  },
  {
    id: 4,
    prompt: "What are the 2 main resources consumed in LLM training?",
    options: {
      a: "Electricity and Water",
      b: "Gold and Silicon",
      c: "Electricity and Metal",
    },
    correct: "a",
    image: "/images/data-center-co2.png"
  },
  {
    id: 5,
    prompt: "What is the primary negative product of LLM training and usage?",
    options: {
      a: "Noise pollution",
      b: "Light pollution",
      c: "CO₂ emission",
    },
    correct: "c",
    image: "/images/data-center-co2.png"
  },
  {
    id: 6,
    prompt: "Why are the environmental effects of LLMs not talked about?",
    options: {
      a: "There are no environmental effects of using LLMs",
      b: "The environmental effects are indirect and difficult to identify",
      c: "There isn't any data on the environmental effects of LLMs",
    },
    correct: "b",
    image: "/images/eye.jpg"
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
            className="w-full max-w-100 bg-white p-6 rounded-2xl drop-shadow-2xl text-center border border-green-700/40"
          >
            <h2 className="text-xl font-semibold">Time for a Quiz!</h2>
            <p className="mt-3 max-w-full">
              Let's test your knowledge on what "AI" is, and how it affects the
              environment.
            </p>
            <button
              onClick={() => setCurrent(0)}
              className="mt-6 bg-green-700 text-white px-6 py-3 rounded-2xl hover:bg-green-900 hover:cursor-pointer transition"
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
            className="relative top-8 h-full w-full max-w-2xl bg-white border-2 border-neutral-200 p-6 rounded-2xl drop-shadow-xl flex flex-col gap-4"
          >
            <h2 className="text-lg font-semibold">
              Question {current + 1} / {QUESTIONS.length}
            </h2>
            <p>{question.prompt}</p>
            {question.image && (
              <img
                src={question.image}
                alt="Question visual"
                className={`${current + 1 == 2 && "h-30 w-full rounded-2xl drop-shadow-xl border border-black/20"} ${current + 1 == 3 && "h-60 w-full rounded-2xl drop-shadow-xl border border-black/20"} ${current + 1 > 2 && current + 1 != 3 && "max-w-80 h-full rounded"} mx-auto`}
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
