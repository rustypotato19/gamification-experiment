import { useMemo, useState } from "react";

type Likert = 1 | 2 | 3 | 4 | 5;

type Question = {
  id: number;
  prompt: string;
  dimension: string;
};

function getParticipantId(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("participantId") ?? "";
}

async function submitSurvey(params: {
  participantId: string;
  answers: Likert[];
  startedAtISO: string;
  submittedAtISO: string;
}) {
  try {
    const res = await fetch("/api/ux-survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Submission failed: ${res.status} ${text}`);
    }

    return { ok: true as const };
  } catch (err) {
    console.error(err);
    return {
      ok: false as const,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    dimension: "Enjoyment",
    prompt: "I enjoyed interacting with the learning experience.",
  },
  { id: 2, dimension: "Enjoyment", prompt: "The activity was entertaining." },
  {
    id: 3,
    dimension: "Focused Attention",
    prompt: "I was fully concentrated while completing the activity.",
  },
  {
    id: 4,
    dimension: "Focused Attention",
    prompt: "I lost track of time while interacting with the experience.",
  },
  {
    id: 5,
    dimension: "Perceived Learning",
    prompt: "The experience helped me learn new information.",
  },
  {
    id: 6,
    dimension: "Perceived Learning",
    prompt:
      "I understand the environmental impact of generative AI better now.",
  },
  { id: 7, dimension: "Usability", prompt: "The system was easy to use." },
  {
    id: 8,
    dimension: "Usability",
    prompt: "The interface was clear and understandable.",
  },
  {
    id: 9,
    dimension: "Challenge",
    prompt: "The difficulty level of the experience was appropriate.",
  },
  {
    id: 10,
    dimension: "Challenge",
    prompt: "The experience challenged me to think.",
  },
  {
    id: 11,
    dimension: "Satisfaction",
    prompt: "Overall, I am satisfied with this learning experience.",
  },
  {
    id: 12,
    dimension: "Satisfaction",
    prompt: "I would recommend this learning experience to others.",
  },
];

export default function UXSurvey() {
  const participantId = getParticipantId();
  const [startedAtISO] = useState(() => new Date().toISOString());
  const [answers, setAnswers] = useState<(Likert | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [touched, setTouched] = useState(false);

  // Persist one-time submission
  const [alreadySubmitted, setAlreadySubmitted] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("surveySubmitted") === "true",
  );

  const allAnswered = useMemo(
    () => answers.every((a) => a !== null),
    [answers],
  );

  const setAnswer = (index: number, value: Likert) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const onSubmit = async () => {
    setTouched(true);

    if (!participantId) {
      setSubmitted({
        ok: false,
        message: "Missing participant ID. Please return to the consent page.",
      });
      return;
    }

    if (!allAnswered || alreadySubmitted) return;

    setSubmitting(true);
    setSubmitted(null);

    const submittedAtISO = new Date().toISOString();
    const payloadAnswers = answers.map((a) => a!) as Likert[];

    const res = await submitSurvey({
      participantId,
      answers: payloadAnswers,
      startedAtISO,
      submittedAtISO,
    });

    setSubmitting(false);

    if (res.ok) {
      localStorage.setItem("surveySubmitted", "true");
      setAlreadySubmitted(true);
      setSubmitted({
        ok: true,
        message: "Survey submitted successfully. Thank you for participating!",
      });
    } else {
      setSubmitted({
        ok: false,
        message: `Could not submit results (${res.error})`,
      });
    }
  };

  const likertLabels = [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ];

  return (
    <div className="min-h-screen bg-neutral-100 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">User Experience Survey</h1>
          <p className="mt-2 text-slate-600">
            Please rate your experience using the scale below.
          </p>
          <div className="mt-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-600">
              Participant ID:{" "}
              <span className="font-mono text-slate-900">
                {participantId || "Not found"}
              </span>
            </p>
          </div>
        </header>

        <main className="space-y-5">
          {QUESTIONS.map((q, idx) => (
            <section
              key={q.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <div className="mb-3">
                <p className="text-xs text-slate-500">{q.dimension}</p>
                <h2 className="text-sm font-semibold text-slate-800">
                  {q.id}. {q.prompt}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-4">
                {[1, 2, 3, 4, 5].map((value) => {
                  const selected = answers[idx] === value;
                  return (
                    <label
                      key={value}
                      className={`rounded-xl p-3 text-center text-sm ring-1 cursor-pointer transition-all duration-200
                        ${selected ? "bg-slate-900 text-white ring-slate-900" : "bg-white hover:bg-slate-50 ring-slate-200"}`}
                    >
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        className="hidden"
                        checked={selected}
                        onChange={() => setAnswer(idx, value as Likert)}
                        disabled={alreadySubmitted}
                      />
                      <div className="font-semibold">{value}</div>
                      <div className="text-xs mt-1">
                        {likertLabels[value - 1]}
                      </div>
                    </label>
                  );
                })}
              </div>

              {touched && answers[idx] === null && (
                <p className="mt-3 text-sm font-medium text-red-600">
                  Please select an answer.
                </p>
              )}
            </section>
          ))}

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                Progress:{" "}
                <span className="font-semibold text-slate-900">
                  {answers.filter(Boolean).length}
                </span>{" "}
                / {answers.length}
              </div>

              <button
                type="button"
                onClick={onSubmit}
                disabled={
                  !allAnswered ||
                  submitting ||
                  submitted?.ok ||
                  alreadySubmitted
                }
                className={`rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm ring-1 transition-all duration-200 ${
                  allAnswered && !submitting && !submitted && !alreadySubmitted
                    ? "bg-slate-900 text-white ring-slate-900 hover:bg-slate-700 hover:cursor-pointer"
                    : "bg-slate-200 text-slate-500 ring-slate-200 cursor-not-allowed"
                }`}
              >
                {submitting
                  ? "Submitting…"
                  : alreadySubmitted
                    ? "Survey Already Submitted"
                    : "Submit Survey"}
              </button>
            </div>

            {submitted && (
              <p
                className={`mt-4 text-sm font-medium ${submitted.ok ? "text-green-700" : "text-amber-700"}`}
              >
                {submitted.message}
              </p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
