import { useEffect, useState } from "react";
import Control from "./control/Control";
import Test from "./test/Test";

type Group = "control" | "test";

function getParticipantId(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("participantId") ?? "";
}

export default function Experiment() {
  const [participantId] = useState(() => getParticipantId());
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("studyStage", "experiment");
  }, []);

  useEffect(() => {
    if (!participantId) return;

    async function fetchGroup() {
      try {
        const res = await fetch(`/api/participant-group/${participantId}`);

        const data = await res.json();

        if (!data.ok) throw new Error(data.error);

        const g: Group = data.group;

        setGroup(g);
        localStorage.setItem("participantGroup", g);
      } catch (err) {
        console.error("Failed to fetch participant group", err);

        // fallback if API fails
        const stored = localStorage.getItem("participantGroup");
        if (stored === "control" || stored === "test") {
          setGroup(stored);
        } else {
          setGroup("test");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchGroup();
  }, [participantId]);

  if (!participantId) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-6 rounded-2xl shadow">
          Missing participant ID.
        </div>
      </div>
    );
  }

  if (loading || !group) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-6 rounded-2xl shadow">
          Loading experiment...
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
