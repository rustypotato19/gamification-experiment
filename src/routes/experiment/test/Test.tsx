import { useContext, useEffect, useState } from "react";
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
import Section3Test from "./learning-sections/section3/Section3Test";
import Section3Finish from "./learning-sections/section3/Section3Finish";
import FinishingScreen from "./learning-sections/FinishingScreen";

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

  const allowedStages = [1, 4, 7];

  const questions = [
    <Section1 key="section1" />,
    <Section1Test key="section1test" />,
    <Section1Finish key="section1finish" />,

    <Section2 key="section2" />,
    <Section2Test key="section2test" />,
    <Section2Finish key="section2finish" />,

    <Section3 key="section3" />,
    <Section3Test key="section3test" />,
    <Section3Finish key="section3finish" />,

    <FinishingScreen key="finishingScreen" />,
  ];

  useEffect(() => {
    async function init() {
      if (!ctx) return;

      const res = await fetch(`/api/section-progress/${participantId}`);
      const data = await res.json();

      if (!data.ok) return;

      const last = data.progress.last_completed_stage;

      if (last === 0) ctx.setCurrentIndex(0);
      else if (last === 1) ctx.setCurrentIndex(3);
      else if (last === 2) ctx.setCurrentIndex(6);
      else if (last === 3) ctx.setCurrentIndex(9);
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showWithrawPopup, setShowWithdrawPopup] = useState(false);

  const [dbBusy, setDbBusy] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  async function postJson<T>(
    url: string,
    body: unknown,
    signal?: AbortSignal,
  ): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        return { ok: false, error: `HTTP ${res.status} ${text}`.trim() };
      }

      const data = (await res.json().catch(() => null)) as T | null;
      return { ok: true, data: data ?? ({} as T) };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Unknown network error",
      };
    }
  }

  const onWithdraw = async () => {
    setDbError(null);

    const pid = participantId;
    if (!pid) {
      // Still clear local state
      window.localStorage.removeItem("consentGiven");
      window.localStorage.removeItem("consentTimestamp");
      window.location.href = "/consent";
      /* alert(
        "You have withdrawn from the study. You may close this page. If you have already submitted any anonymous survey responses, they may still be retained in aggregated form.",
      ); */
      return;
    }

    setDbBusy(true);

    // Try to mark withdrawn in DB
    const res = await postJson<{ ok: boolean }>(`/api/withdraw`, {
      participantId: pid,
    });

    // Clear entire local state regardless
    window.localStorage.clear();

    setDbBusy(false);

    if (!res.ok) {
      setDbError(
        `Withdrawn locally, but the server could not be reached. (${res.error})`,
      );
    }

    window.location.href = "/withdrawn";
    /* alert(
      "You have withdrawn from the study. You may close this page. If you have already submitted any anonymous survey responses, they may still be retained in aggregated form.",
    ); */
  };

  if (!ctx) return null;

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
            <button
              onClick={() => {
                setShowWithdrawPopup(true);
              }}
              className="w-fit h-fit px-4 py-2 bg-red-700 text-white font-bold rounded-2xl text-sm relative top-4 hover:bg-red-500 hover:cursor-pointer"
            >
              Withdraw
            </button>
          </div>

          <button
            className="absolute top-6 right-10"
            onClick={() => {
              ctx.setCurrentIndex(0);
            }}
          >
            Section 1
          </button>
          <button
            className="absolute top-12 right-10"
            onClick={() => {
              ctx.setCurrentIndex(1);
            }}
          >
            Section 1 quiz
          </button>
          <button
            className="absolute top-18 right-10"
            onClick={() => {
              ctx.setCurrentIndex(3);
            }}
          >
            Section 2
          </button>
          <button
            className="absolute top-24 right-10"
            onClick={() => {
              ctx.setCurrentIndex(4);
            }}
          >
            Section 2 quiz
          </button>
          <button
            className="absolute top-30 right-10"
            onClick={() => {
              ctx.setCurrentIndex(6);
            }}
          >
            Section 3
          </button>
          <button
            className="absolute top-36 right-10"
            onClick={() => {
              ctx.setCurrentIndex(7);
            }}
          >
            Section 3 quiz
          </button>
          <button
            className="absolute top-42 right-10"
            onClick={() => {
              ctx.setCurrentIndex(8);
            }}
          >
            Section 3 finish
          </button>
          <button
            className="absolute top-48 right-10"
            onClick={() => {
              ctx.setCurrentIndex(9);
            }}
          >
            End
          </button>

          {showWithrawPopup && (
            <div className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] w-screen h-screen z-50 bg-black/30 backdrop-blur-xs flex justify-center items-center">
              <div className="flex gap-3 flex-col justify-center items-center w-fit h-fit bg-white py-8 px-16 rounded-2xl border drop-shadow-2xl">
                <h1 className="font-bold text-2xl mb-8">
                  Confirm Withdrawal from Study
                </h1>
                {dbError ? (
                  <>
                    <p>Error: {dbError}</p>
                    <p>Unable to process withdrawal at this time</p>
                    <p>
                      Please reach out to me at{" "}
                      <strong>konrad.mitura@yorksj.ac.uk</strong>, or{" "}
                      <strong>konradmitura8@gmail.com</strong> stating your
                      participant id and the error above.
                    </p>
                    <p>Participant ID: {participantId}</p>
                  </>
                ) : (
                  <>
                    <p>
                      If you withdraw from this study, you will not be able to
                      participate again.
                    </p>
                    <p>
                      Your records, scores and progress may still be retained
                      until the deadline for this dissertation
                    </p>
                    <p className="mt-6 font-semibold">
                      Do you still wish to withdraw?
                    </p>
                  </>
                )}
                <div className="w-2/3 flex items-center justify-between mt-6">
                  <button
                    onClick={() => {
                      setShowWithdrawPopup(false);
                    }}
                    className="text-xl font-bold bg-red-700 text-white px-3 py-1 rounded-xl hover:bg-red-500 hover:cursor-pointer disabled:bg-neutral-500 disabled:cursor-not-allowed"
                    disabled={dbBusy}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onWithdraw();
                    }}
                    className="text-xl font-bold bg-emerald-700 text-white px-3 py-1 rounded-xl hover:bg-emerald-500 hover:cursor-pointer disabled:bg-neutral-500 disabled:cursor-not-allowed"
                    disabled={dbBusy}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          )}

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
