import { useContext } from "react";
import TestProvider from "./TestProvider";
import TestContext from "./TestContext";

import Section1 from "./learning-sections/section1/Section1";
import Section1Test from "./learning-sections/section1/Section1Test";
import Section1Finish from "./learning-sections/section1/Section1Finish";

import { AnimatePresence, motion } from "framer-motion";
import Section2 from "./learning-sections/section2/Section2";
import Section2Test from "./learning-sections/section2/Section2Test";
import Section2Finish from "./learning-sections/section2/Section2Finish";
import Section3 from "./learning-sections/section3/Section3";

function formatNumber(number: number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(2) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(2) + "K";
  } else return number.toLocaleString();
}

type Props = {
  participantId: string;
};

function TestInner({ participantId }: Props) {
  const ctx = useContext(TestContext);
  if (!ctx) return null;

  const allowedStages = [1,4]

  const questions = [
    <Section1 key="section1" />,
    <Section1Test key="section1test" />,
    <Section1Finish key="section1finish" />,

    <Section2 key="section2" />,
    <Section2Test key="section2test" />,
    <Section2Finish key="section2finish" />,

    <Section3 key="section3" />,
  ];

  return (
    <div className="h-full flex flex-col p-4 md:p-6 bg-neutral-200">
      <main className="flex-1 bg-white rounded-3xl shadow-xl p-8 flex flex-col">
        {/* Header Row */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-xs text-slate-500">
              Participant: {participantId}
            </p>
            <h1 className="text-2xl font-bold">AI Impact Mission 🚀</h1>
          </div>

          {/* Score + Streak (Hidden on Stage 0) */}
          <AnimatePresence>
            {allowedStages.includes(ctx.currentIndex) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex gap-4"
              >
                {/* Score Card */}
                <div className="bg-linear-to-br from-orange-500 to-red-700 text-white px-4 py-2 rounded-2xl shadow-lg flex flex-col items-center w-fit h-fit transition-all duration-200">
                  <span className="text-xs uppercase tracking-wide opacity-80">
                    Score
                  </span>
                  <motion.span
                    key={ctx.pts}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="text-xl font-bold"
                  >
                    {formatNumber(ctx.pts)}
                  </motion.span>
                  <span className="text-xs opacity-80">Pts</span>
                </div>

                {/* Streak Card */}
                <div className="bg-linear-to-br from-indigo-500 to-blue-700 text-white px-4 py-2 rounded-2xl shadow-lg flex flex-col items-center w-fit h-fit transition-all duration-200">
                  <span className="text-xs uppercase tracking-wide opacity-80">
                    Streak
                  </span>
                  <span className="text-xl font-bold flex items-center">
                    🔥
                    <span className="relative top-px right-0.5">
                      {ctx.streak}
                    </span>
                  </span>
                  <span className="text-xs opacity-80">
                    x{1 + ctx.streak / 5}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center">
          {questions[ctx.currentIndex]}
        </div>
      </main>
    </div>
  );
}

export default function Test(props: Props) {
  return (
    <TestProvider>
      <TestInner {...props} />
    </TestProvider>
  );
}
