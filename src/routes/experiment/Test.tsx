import { useContext, useEffect, useState } from "react";
import TestProvider from "./context/TestProvider";
import TestContext from "./context/TestContext";
import { AnimatePresence, motion } from "framer-motion";
import { experimentSections } from "./config/experimentSections";
import SectionFinish from "./components/SectionFinish";
import { experimentSectionData } from "./config/experimentSectionData";

type Props = { participantId: string };
type Phase = "learning" | "finish";

function TestInner({ participantId }: Props) {
  const ctx = useContext(TestContext);
  const [phase, setPhase] = useState<Phase>("learning");
  const [progressApplied, setProgressApplied] = useState(false);
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [dbBusy, setDbBusy] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const [progressPercent, setProgressPercent] = useState(0);

  const sectionData = experimentSectionData[ctx?.currentIndex ?? 0];

  const totalSteps = sectionData?.learning?.length ?? 1;

  const sections = experimentSections;

  useEffect(() => {
    if (!ctx) return;
    setProgressPercent(ctx.getSectionProgressPercent);
  }, [ctx]);

  // --- Fetch progress only ONCE ---
  useEffect(() => {
    if (!ctx || progressApplied) return;

    async function initProgress() {
      try {
        const res = await fetch(`/api/section-progress/${participantId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const lastCompletedStage = data.progress?.last_completed_stage ?? 0;
        const mappedIndex = Math.min(lastCompletedStage, sections.length - 1);

        if (ctx) ctx.setCurrentIndex(mappedIndex);
        setProgressApplied(true); // prevent future overwrites
      } catch (err) {
        console.error("Failed to fetch progress", err);
        if (ctx) ctx.setCurrentIndex(0);
        setProgressApplied(true);
      }
    }

    initProgress();
  }, [ctx, participantId, sections.length, progressApplied]);

  // --- Update local score & streak ---
  useEffect(() => {
    if (!ctx) return;
    setScore(ctx.pts);
    setStreak(ctx.streak);
  }, [ctx, ctx?.pts, ctx?.streak]);

  const CurrentSection = sections[
    (ctx && ctx.currentIndex) || 0
  ] as React.ComponentType<{
    onComplete: () => void;
  }>;

  if (!ctx) return null;

  // --- Called by learning/test steps ---
  const handleSectionComplete = () => setPhase("finish");

  // --- Called by Finish screen Next button ---
  const handleFinishNext = () => {
    ctx.next();
    setPhase("learning");
  };

  // --- Withdraw handler ---
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

  return (
    <div className="h-full w-full flex flex-col p-2 md:p-6 bg-neutral-200">
      <main className="flex-1 max-h-full bg-white rounded-3xl shadow-xl p-4 sm:p-8 flex flex-col items-center justify-center">
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Participant ID */}
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Participant: {participantId}
          </p>

          {/* Progress */}

          {ctx.showSectionProgressPercent && (
            <div className="w-full sm:max-w-md mx-auto sm:mx-0">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-700"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <p className="text-xs text-gray-500 mt-1 text-center">
                Step {ctx.sectionStep + 1} of {totalSteps}
              </p>
            </div>
          )}

          {/* Withdraw button */}
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={() => setShowWithdrawPopup(true)}
              className="px-2 py-1 text-xs sm:text-[1rem] font-semibold sm:px-4 sm:py-2 bg-red-700 text-white sm:font-bold rounded-2xl hover:bg-red-500 hover:cursor-pointer z-50"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Withdraw Popup */}
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
        <div className="flex-1 max-h-[80vh] flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            {phase === "learning" && (
              <motion.div
                key={`section-${ctx.currentIndex}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <CurrentSection onComplete={handleSectionComplete} />
              </motion.div>
            )}

            {phase === "finish" && (
              <SectionFinish
                onComplete={handleFinishNext}
                title="Section Complete!"
                message="Great job completing this section."
              />
            )}
          </AnimatePresence>
        </div>

        {/* Score + Streak */}
        {window.innerWidth > 480 && ctx.showPtsAndStreak && (
          <AnimatePresence>
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
