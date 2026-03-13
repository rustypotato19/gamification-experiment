import { useState } from "react";

type Props = {
  title: string;
  message: string;
  participantId: string;
  currentStageIndex: number; // optional
  onNext: () => void;
};

export default function SectionFinish({
  title,
  message,
  participantId,
  currentStageIndex,
  onNext,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveProgress = async () => {
    setBusy(true);
    setError(null);

    try {
      const res = await fetch(`/api/section-progress/${participantId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ last_completed_stage: currentStageIndex }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      console.log(res);
      onNext();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.message || "Failed to update progress");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white max-w-xl w-full p-6 rounded-2xl drop-shadow-lg border border-black/20 text-center flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p>{message}</p>
      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={saveProgress}
        disabled={busy}
        className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 hover:cursor-pointer"
      >
        {busy ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}
