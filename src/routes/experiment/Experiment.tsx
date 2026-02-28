import { useEffect, useState } from "react";
import Control from "./Control";
import Test from "./test/Test";

type Group = "control" | "test";

function getParticipantId(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("participantId") ?? "";
}

function getStoredGroup(): Group | null {
  if (typeof window === "undefined") return null;
  const g = window.localStorage.getItem("participantGroup");
  return g === "control" || g === "test" ? g : null;
}

export default function Experiment() {
  const [participantId] = useState(() => getParticipantId());

  const [group] = useState<Group>(() => {
    const stored = getStoredGroup();
    if (stored) return stored;

    // Default assignment
    window.localStorage.setItem("participantGroup", "test");
    return "test";
  });

  useEffect(() => {
    localStorage.setItem("studyStage", "experiment");
  }, []);

  if (!participantId) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-6 rounded-2xl shadow">
          Missing participant ID.
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50">
      {group === "control" ? (
        <Control participantId={participantId} />
      ) : (
        <Test participantId={participantId} />
      )}
    </div>
  );
}
