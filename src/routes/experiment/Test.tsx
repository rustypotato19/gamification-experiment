import { useContext, useEffect, useState } from "react";
import TestProvider from "./context/TestProvider";
import TestContext from "./context/TestContext";
/* import { AnimatePresence, motion } from "framer-motion"; */

// Import config
import { experimentSections } from "./config/experimentSections";
import { AnimatePresence, motion } from "framer-motion";

type Props = { participantId: string };

function TestInner({ participantId }: Props) {
  const ctx = useContext(TestContext);
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [dbBusy, setDbBusy] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const sections = experimentSections;

  useEffect(() => {
    async function initProgress() {
      const res = await fetch(`/api/section-progress/${participantId}`);
      const data = await res.json();
      if (!data.ok) return;

      // console.log(data);

      const lastIndexMap = experimentSections
        .map((_, i) => i * 3) // learning indices
        .concat(sections.length - 1);
      ctx?.setCurrentIndex(
        lastIndexMap[data.progress.last_completed_stage] ?? 0,
      );
    }
    initProgress();
  }, [ctx, participantId, sections.length]);

  useEffect(() => {
    if (!ctx) return;
    function updateLocalScores() {
      setScore(ctx ? ctx.pts : 0);
      setStreak(ctx ? ctx.streak : 0);
    }
    updateLocalScores();
  }, [ctx, ctx?.pts, ctx?.streak]);

  const postJson = async <T,>(url: string, body: unknown) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
      const data = await res.json().catch(() => null);
      return { ok: true, data: data ?? ({} as T) };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Network error",
      };
    }
  };

  const onWithdraw = async () => {
    setDbError(null);
    setDbBusy(true);

    const res = await postJson(`/api/withdraw`, { participantId });
    window.localStorage.clear();
    setDbBusy(false);

    if (!res.ok)
      setDbError(`Withdrawn locally, but server failed: ${res.error}`);
    window.location.href = "/withdrawn";
  };

  if (!ctx) return null;

  const CurrentSection = sections[ctx.currentIndex];

  /* console.log(
    "currentIndex",
    ctx.currentIndex,
    "CurrentSection",
    CurrentSection.name,
  ); */

  return (
    <div className="h-full w-full flex flex-col p-2 md:p-6 bg-neutral-200">
      <main className="flex-1 max-h-full bg-white rounded-3xl shadow-xl p-4 sm:p-8 flex flex-col items-center justify-center">
        <div className="flex w-full h-fit justify-between items-start">
          <p className="text-xs text-slate-500">Participant: {participantId}</p>
          <button
            onClick={() => setShowWithdrawPopup(true)}
            className="px-4 py-2 bg-red-700 text-white font-bold rounded-2xl hover:bg-red-500 hover:cursor-pointer"
          >
            Withdraw
          </button>
        </div>

        <AnimatePresence mode="wait">
          {showWithdrawPopup && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen z-50 bg-black/30 backdrop-blur-xs flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="bg-white py-8 px-16 rounded-2xl shadow-xl flex flex-col items-center"
                initial={{ scale: 0.85, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <h1 className="font-bold text-2xl mb-6">Confirm Withdrawal</h1>

                {dbError ? (
                  <p className="text-red-500">{dbError}</p>
                ) : (
                  <p>Do you really want to withdraw?</p>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setShowWithdrawPopup(false)}
                    className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-500 hover:cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={onWithdraw}
                    className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 hover:cursor-pointer"
                    disabled={dbBusy}
                  >
                    Withdraw
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 max-h-[80dvh] flex items-center justify-center">
          <CurrentSection />
        </div>

        {/* Points + streak */}
        {window.innerWidth > 480 && (
          <AnimatePresence>
            {ctx.showPtsAndStreak && (
              <motion.div
                key="scorebar"
                className="flex gap-4 mt-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.35 }}
              >
                <motion.div
                  className="bg-orange-500 text-white px-4 py-2 rounded-2xl font-semibold drop-shadow-2xl border border-black/20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.25 }}
                >
                  Score: {score}
                </motion.div>
                <motion.div
                  className="bg-indigo-500 text-white px-4 py-2 rounded-2xl font-semibold drop-shadow-2xl border border-black/20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.25 }}
                >
                  Streak: {streak}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
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
