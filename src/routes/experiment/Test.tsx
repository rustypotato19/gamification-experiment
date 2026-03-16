import { useContext, useEffect, useState } from "react";
import TestProvider from "./context/TestProvider";
import TestContext from "./context/TestContext";
import { AnimatePresence, motion } from "framer-motion";
import { experimentSections } from "./config/experimentSections";
import SectionFinish from "./components/SectionFinish";
import { experimentSectionData } from "./config/experimentSectionData";

type Props = { participantId: string };
type Phase = "learning" | "finish";

// --- Withdraw Popup Component ---
function WithdrawPopup({
  show,
  onCancel,
  onConfirm,
  busy,
  error,
}: {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  busy: boolean;
  error?: string | null;
}) {
  if (!show) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="absolute inset-0 z-50 bg-black/30 backdrop-blur-xs flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="bg-white py-8 px-12 rounded-2xl shadow-xl flex flex-col items-center max-w-xs text-center"
          initial={{ scale: 0.85, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.85, y: 20 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className="text-2xl font-bold mb-4">Confirm Withdrawal</h2>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p>Do you really want to withdraw?</p>
          )}
          <div className="flex gap-4 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-500"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={busy}
              className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
            >
              Withdraw
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// --- Main Test Inner Component ---
function TestInner({ participantId }: Props) {
  const ctx = useContext(TestContext);
  const [phase, setPhase] = useState<Phase>("learning");
  const [progressApplied, setProgressApplied] = useState(false);
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [dbBusy, setDbBusy] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const sections = experimentSections;
  const sectionData = experimentSectionData[ctx?.currentIndex ?? 0];
  const totalSteps = sectionData?.learning?.length ?? 1;

  // --- Apply initial progress from DB ---
  useEffect(() => {
    if (progressApplied) return;

    async function fetchProgress() {
      try {
        const res = await fetch(`/api/section-progress/${participantId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const lastStage = data.progress?.last_completed_stage ?? 0;
        const mappedIndex = Math.min(lastStage, sections.length - 1);

        ctx?.setCurrentIndex(mappedIndex);
      } catch (err) {
        console.error("Failed to fetch progress", err);
        ctx?.setCurrentIndex(0);
      } finally {
        setProgressApplied(true);
      }
    }

    fetchProgress();
  }, [ctx, participantId, progressApplied, sections.length]);

  // --- Update local score & streak ---
  useEffect(() => {
    setScore(ctx?.pts ?? 0);
    setStreak(ctx?.streak ?? 0);
  }, [ctx, ctx?.pts, ctx?.streak]);

  // --- Update progress bar ---
  useEffect(() => {
    setProgressPercent(ctx?.getSectionProgressPercent ?? 0);
  }, [ctx]);

  const CurrentSection = sections[
    ctx?.currentIndex ?? 0
  ] as React.ComponentType<{
    onComplete: () => void;
  }>;

  // --- Section completion handlers ---
  const handleSectionComplete = () => setPhase("finish");
  const handleFinishNext = () => {
    ctx?.next();
    setPhase("learning");
  };

  // --- Withdraw ---
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

  return (
    <div className="h-full w-full flex flex-col p-2 md:p-6 bg-neutral-200">
      <main className="flex-1 max-h-full bg-white rounded-3xl shadow-xl p-4 sm:p-8 flex flex-col items-center justify-center relative">
        {/* Top Bar */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 z-50">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Participant: {participantId}
          </p>

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

          <div className="flex justify-center sm:justify-end">
            <button
              onClick={() => setShowWithdrawPopup(true)}
              className="px-2 py-1 text-xs sm:text-[1rem] font-semibold sm:px-4 sm:py-2 bg-red-700 text-white rounded-2xl hover:bg-red-500 hover:cursor-pointer"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Withdraw Popup */}
        <WithdrawPopup
          show={showWithdrawPopup}
          onCancel={() => setShowWithdrawPopup(false)}
          onConfirm={onWithdraw}
          busy={dbBusy}
          error={dbError}
        />

        {/* Main Content */}
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

        {/* Score + Streak (Desktop Only) */}
        <div className="hidden sm:flex gap-4 mt-4">
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
        </div>
      </main>
    </div>
  );
}

// --- Exported Test Component ---
export default function Test(props: Props) {
  return (
    <TestProvider>
      <TestInner {...props} />
    </TestProvider>
  );
}
