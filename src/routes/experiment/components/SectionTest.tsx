import { useContext, useEffect, useRef, useState } from "react";
import TestContext from "../context/TestContext";
import MediaFrame from "./MediaFrame";
import { AnimatePresence, motion } from "framer-motion";

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

  const [popup, setPopup] = useState<{
    points?: number;
    streak?: number;
    x: number;
    y: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctx) return;
    ctx.setShowPtsAndStreak(true);
    ctx.setShowSectionProgressPercent(false);
  }, [ctx]);

  if (!ctx) return null;

  function answer(
    choice: Choice,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    if (selected) return;
    if (!ctx) return null;

    const correct = choice === question.correct;

    let gained = 0;

    if (correct) {
      const basePts = 100;
      const streakMultiplier = 1 + ctx.streak * 0.2;

      gained = Math.round(basePts * streakMultiplier);

      ctx.addCorrect();

      const rect = containerRef.current?.getBoundingClientRect();

      if (rect) {
        setPopup({
          points: gained,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    } else {
      ctx.addIncorrect();

      const rect = containerRef.current?.getBoundingClientRect();

      if (rect) {
        setPopup({
          streak: -1,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }

    setSelected(choice);

    setTimeout(() => {
      setPopup(null);
      setSelected(null);

      if (index < questions.length - 1) {
        setIndex((i) => i + 1);
      } else {
        onComplete();
      }
    }, 900);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={containerRef}
        key={index}
        className="
        relative
        bg-white
        w-full
        max-w-[80vw]
        sm:max-w-[40vw]
        mx-auto
        max-h-[70vh]
        sm:max-h-[60vh]
        p-4 sm:p-6
        rounded-xl sm:rounded-2xl
        drop-shadow-lg
        border border-black/20
        flex flex-col
        gap-4
      "
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.75 }}
      >
        {/* Question Header */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-sm sm:text-lg">
            Question {index + 1} / {questions.length}
          </h2>

          <div className="text-sm sm:text-base font-semibold text-orange-500">
            <span className="animate-pulse duration-75">🔥</span> {ctx.streak}
          </div>
        </div>

        <p className="text-sm sm:text-base leading-relaxed">
          {question.prompt}
        </p>

        {question.image && (
          <div className="flex justify-center">
            <MediaFrame src={question.image} />
          </div>
        )}

        {/* Floating Points Popup */}
        <AnimatePresence>
          {popup?.points && (
            <motion.div
              key={popup.points + popup.x}
              initial={{ opacity: 0, y: 0, scale: 0.7 }}
              animate={{ opacity: 1, y: -150, scale: 0.9 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 1.5 }}
              style={{
                position: "absolute",
                left: popup.x,
                top: popup.y,
              }}
              className="
                pointer-events-none
                -translate-x-1/2
                -translate-y-1/2
                px-6
                py-2
                rounded-full
                backdrop-blur-md
                bg-white/50
                border
                border-emerald-300
                text-emerald-600
                font-extrabold
                text-xl sm:text-2xl
                shadow-lg
                select-none
              "
            >
              +{popup.points} Pts
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Negative Popup */}
        <AnimatePresence>
          {popup?.streak && (
            <motion.div
              key={popup.x}
              initial={{ opacity: 0, y: 0, scale: 0.7 }}
              animate={{ opacity: 1, y: -150, scale: 0.9 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 1.5 }}
              style={{
                position: "absolute",
                left: popup.x,
                top: popup.y,
              }}
              className="
                pointer-events-none
                -translate-x-1/2
                -translate-y-1/2
                px-6
                py-2
                rounded-full
                backdrop-blur-md
                bg-white/50
                border
                border-red-300
                text-red-600
                font-extrabold
                text-xl sm:text-2xl
                shadow-lg
                select-none
              "
            >
              {ctx.streak != 0 ? "Streak Lost!" : "Incorrect!"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answers */}
        <div className="flex flex-col gap-2">
          {(["a", "b", "c"] as Choice[]).map((choice) => {
            let style = `
              p-2
              rounded-xl
              ring-1
              text-sm sm:text-base
              cursor-pointer
              transition
              active:scale-[0.97]
              select-none
            `;

            if (!selected) style += " hover:bg-neutral-200";

            if (selected) {
              if (choice === question.correct) {
                style += " bg-emerald-300 ring-emerald-400";
              } else if (choice === selected) {
                style += " bg-red-300 ring-red-400";
              }
            }

            return (
              <div
                key={choice}
                className={style}
                onClick={(e) => answer(choice, e)}
              >
                <strong className="mr-2">{choice})</strong>
                {question.options[choice]}
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
