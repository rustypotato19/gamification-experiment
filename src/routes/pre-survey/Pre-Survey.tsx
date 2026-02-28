import { useMemo, useState } from "react";

type Choice = "a" | "b" | "c";
type Question = {
  id: number;
  prompt: string;
  options: { a: string; b: string; c: string };
};

const ANSWER_KEY: Choice[] = [
  "b",
  "b",
  "b",
  "b",
  "a",
  "b",
  "c",
  "b",
  "c",
  "c",
  "b",
  "c",
  "c",
  "b",
  "b",
];

function getParticipantId(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("participantId") ?? "";
}

function computeScore(answers: (Choice | null)[]): {
  correct: number;
  total: number;
} {
  let correct = 0;
  for (let i = 0; i < ANSWER_KEY.length; i++) {
    if (answers[i] && answers[i] === ANSWER_KEY[i]) correct++;
  }
  return { correct, total: ANSWER_KEY.length };
}

async function submitSurvey(params: {
  surveyType: "pre" | "post";
  participantId: string;
  answers: Choice[];
  scoreCorrect: number;
  scoreTotal: number;
  startedAtISO: string;
  submittedAtISO: string;
}) {
  try {
    const res = await fetch(`/api/surveys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Submission failed: ${res.status} ${text}`.trim());
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

const PRE_QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "Why is AI's environmental impact often underestimated by users?",
    options: {
      a: "AI runs locally on phones",
      b: "The impact is indirect and invisible",
      c: "AI uses no physical resources",
    },
  },
  {
    id: 2,
    prompt:
      "How much CO₂ does a single ChatGPT query approximately generate (on average)?",
    options: { a: "80 milligrams", b: "3 grams", c: "250 grams" },
  },
  {
    id: 3,
    prompt:
      "Which activity is most equivalent to a 30-minute conversation with ChatGPT in energy use?",
    options: {
      a: "Driving a car for 10 minutes",
      b: "Taking a warm shower",
      c: "Brewing cup of coffee",
    },
  },
  {
    id: 4,
    prompt: "Why is water usage an environmental concern for AI systems?",
    options: {
      a: "Water is used to clean servers regularly",
      b: "Water is used to cool data centres",
      c: "It's not a concern, AI uses no water",
    },
  },
  {
    id: 5,
    prompt:
      "How much water does a 30-minute conversation with ChatGPT require (indirectly, via data centre cooling)?",
    options: {
      a: "0.25 L (~1 glass)",
      b: "1 L (~4 glasses)",
      c: "9.4 L (~38 glasses)",
    },
  },
  {
    id: 6,
    prompt:
      "What is the main reason generative AI systems consume large amounts of electricity?",
    options: {
      a: "---",
      b: "Data centre operation",
      c: "Internet speed",
    },
  },
  {
    id: 7,
    prompt: "Which phase of generative AI has the highest environmental cost?",
    options: {
      a: "Daily user queries",
      b: "Software updates",
      c: "Model training",
    },
  },
  {
    id: 8,
    prompt: "Training a large language model can emit as much CO₂ as:",
    options: {
      a: "Charging a phone for a year",
      b: "Several cars over an entire lifetime",
      c: "Running a laptop for a week",
    },
  },
  {
    id: 9,
    prompt:
      "Which factor most increases the carbon footprint of generative AI?",
    options: {
      a: "The brand of the AI model",
      b: "The time of day the AI is used",
      c: "AI model size and complexity",
    },
  },
  {
    id: 10,
    prompt:
      "Which user behaviour can help reduce the environmental impact of generative AI?",
    options: {
      a: "Asking longer questions",
      b: "Being polite to the AI",
      c: "Being concise with prompts",
    },
  },
  {
    id: 11,
    prompt:
      "What is the problem with using generative AI instead of tradtional tools (e.g., search engines, calculators) for simple tasks?",
    options: {
      a: "None, AI causes no problems",
      b: "AI has higher hidden environmental costs",
      c: "AI provides faster results",
    },
  },
  {
    id: 12,
    prompt:
      "Which energy source makes generative AI significantly less carbon-intensive?",
    options: {
      a: "Coal",
      b: "Natural gas",
      c: "Renewable energy",
    },
  },
  {
    id: 13,
    prompt:
      "What happens to AI’s environmental footprint when models grow larger?",
    options: {
      a: "It decreases slightly",
      b: "It stays the same",
      c: "It increases significantly",
    },
  },
  {
    id: 14,
    prompt:
      "How does repeated or redundant prompting affect environmental impact?",
    options: {
      a: "It reduces energy use",
      b: "It increases unnecessary computation",
      c: "It has no effect",
    },
  },
  {
    id: 15,
    prompt:
      "Which resource is most heavily consumed by data centres running generative AI models?",
    options: { a: "Water", b: "Electricity", c: "Rare earth metals" },
  }
];

export default function PreSurvey() {
  const participantId = getParticipantId();
  const [startedAtISO] = useState(() => new Date().toISOString());
  const [answers, setAnswers] = useState<(Choice | null)[]>(() =>
    Array(PRE_QUESTIONS.length).fill(null),
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [touched, setTouched] = useState(false);

  const allAnswered = useMemo(
    () => answers.every((a) => a !== null),
    [answers],
  );
  const score = useMemo(() => computeScore(answers), [answers]);

  const [showScorePopup, setShowScorePopup] = useState(false);
  const [scorePopupDismissed, setScorePopupDismissed] = useState(false);

  const setAnswer = (idx: number, value: Choice) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = value;

      // If this click completes the survey, show the popup (unless dismissed)
      const nowAllAnswered = next.every((a) => a !== null);
      if (nowAllAnswered && !scorePopupDismissed) {
        setShowScorePopup(true);
      }

      return next;
    });
  };

  const correctFor = (questionIndex: number) => ANSWER_KEY[questionIndex];

  const onSubmit = async () => {
    setTouched(true);
    if (!participantId) {
      setSubmitted({
        ok: false,
        message: "Missing participant ID. Please return to the consent page.",
      });
      return;
    }
    if (!allAnswered) return;

    setSubmitting(true);
    setSubmitted(null);

    const submittedAtISO = new Date().toISOString();
    const payloadAnswers = answers.map((a) => a!) as Choice[];

    const res = await submitSurvey({
      surveyType: "pre",
      participantId,
      answers: payloadAnswers,
      scoreCorrect: score.correct,
      scoreTotal: score.total,
      startedAtISO,
      submittedAtISO,
    });

    setSubmitting(false);

    if (res.ok) {
      setSubmitted({
        ok: true,
        message: "Pre-learning survey submitted (or queued) successfully.",
      });
      // TODO: navigate to the experiment page
      window.location.href = "/experiment";
    } else {
      setSubmitted({
        ok: false,
        message: `Could not submit right now. You can still proceed if your flow allows it. (${res.error})`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-200 text-slate-900">
      <div
        className={`mx-auto max-w-3xl px-4 py-10 ${showScorePopup && !scorePopupDismissed ? "blur-sm" : ""}`}
      >
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Pre-Learning Survey</h1>
          <p className="mt-2 text-slate-600">
            Answer all questions. This should take around 5 minutes.
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
          {PRE_QUESTIONS.map((q, idx) => (
            <section
              key={q.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <h2 className="text-sm font-semibold text-slate-800">
                {q.id}. {q.prompt}
              </h2>

              <div className="mt-4 space-y-2">
                {(["a", "b", "c"] as Choice[]).map((choice) => {
                  const selected = answers[idx];
                  const correct = correctFor(idx);

                  const hasAnswered = selected !== null;
                  const locked = hasAnswered;

                  const isSelected = selected === choice;
                  const isCorrectChoice = choice === correct;

                  // Visual states:
                  const showCorrectHighlight = hasAnswered && isCorrectChoice; // highlight correct once answered
                  const showIncorrectHighlight =
                    hasAnswered && isSelected && !isCorrectChoice; // wrong selection red

                  const base =
                    "flex items-start gap-3 rounded-xl p-3 ring-1 transition-all duration-200";
                  const interactive = locked
                    ? "cursor-not-allowed opacity-90"
                    : "cursor-pointer";
                  const neutral = locked
                    ? "bg-white ring-slate-200"
                    : "bg-white ring-slate-200 hover:bg-slate-50";

                  const correctStyle = "bg-emerald-100 ring-emerald-400";
                  const incorrectStyle = "bg-red-100 ring-red-400";

                  const labelClass =
                    `${base} ${interactive} ` +
                    (showIncorrectHighlight
                      ? incorrectStyle
                      : showCorrectHighlight
                        ? correctStyle
                        : neutral);

                  let feedbackText: string | null = null;
                  let feedbackClass = "text-xs font-semibold";

                  if (hasAnswered) {
                    if (isSelected && isCorrectChoice) {
                      feedbackText = "Correct!";
                      feedbackClass += " text-green-700";
                    } else if (isSelected && !isCorrectChoice) {
                      feedbackText = "Incorrect.";
                      feedbackClass += " text-red-800";
                    } else if (!isSelected && isCorrectChoice) {
                      feedbackText = "Correct answer";
                      feedbackClass += " text-green-700";
                    }
                  }

                  return (
                    <label key={choice} className={labelClass}>
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        className="mt-1 h-4 w-4"
                        checked={isSelected}
                        disabled={locked}
                        onChange={() => {
                          if (locked) return;
                          setAnswer(idx, choice);
                        }}
                      />

                      <div className="flex w-full items-start justify-between gap-3">
                        <span className="text-sm text-slate-700">
                          <span className="font-semibold">{choice})</span>{" "}
                          {q.options[choice]}
                        </span>

                        {feedbackText ? (
                          <span className={feedbackClass}>{feedbackText}</span>
                        ) : null}
                      </div>
                    </label>
                  );
                })}
              </div>

              {touched && answers[idx] === null ? (
                <p className="mt-3 text-sm font-medium text-red-600">
                  Please select an answer.
                </p>
              ) : null}
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
                <span className="ml-3 text-slate-400">•</span>
                <span className="ml-3">
                  Score :{" "}
                  <span className="font-semibold text-slate-900">
                    {score.correct}
                  </span>{" "}
                  / {score.total}
                </span>
              </div>

              <button
                type="button"
                className={`rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm ring-1 transition ${
                  allAnswered && !submitting
                    ? "bg-slate-900 text-white ring-slate-900 hover:opacity-95 hover:bg-slate-700 hover:cursor-pointer"
                    : "bg-slate-200 text-slate-500 ring-slate-200 cursor-not-allowed"
                } transition-all duration-200`}
                onClick={onSubmit}
                disabled={!allAnswered || submitting}
              >
                {submitting ? "Submitting…" : "Submit & Continue"}
              </button>
            </div>

            {submitted ? (
              <p
                className={`mt-4 text-sm font-medium ${submitted.ok ? "text-green-700" : "text-amber-700"}`}
              >
                {submitted.message}
              </p>
            ) : null}

            <p className="mt-3 text-xs text-slate-500">
              Submission is sent to your backend API (
              <span className="font-mono">/api/surveys</span>) and
              stored in SQL.
            </p>
          </section>
        </main>
      </div>
      {showScorePopup && allAnswered ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
          {/* click-off backdrop (optional) */}
          <div
            className="absolute inset-0 bg-black/10"
            onClick={() => {
              setShowScorePopup(false);
              setScorePopupDismissed(true);
            }}
          />

          <div className="absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  All done 🎉
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Your score:{" "}
                  <span className="font-semibold text-slate-900">
                    {score.correct} / {score.total}
                  </span>
                </p>
              </div>

              <button
                type="button"
                className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-200 cursor-pointer transition-all duration-200"
                onClick={() => {
                  setShowScorePopup(false);
                  setScorePopupDismissed(true);
                }}
              >
                Close
              </button>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                className={`rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm ring-1 transition ${
                  !submitting
                    ? "bg-slate-900 text-white ring-slate-900 hover:opacity-95 hover:bg-slate-700 hover:cursor-pointer transition-all duration-200"
                    : "bg-slate-200 text-slate-500 ring-slate-200 cursor-not-allowed"
                }`}
                onClick={onSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit & Continue"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
