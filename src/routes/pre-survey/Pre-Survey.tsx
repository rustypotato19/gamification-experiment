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
  "c",
  "c",
  "c",
  "b",
  "b",
  "a",
  "a",
  "c",
  "c",
  "b",
  "b",
];

function getParticipantId(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("participantId") ?? "";
}

function computeScore(answers: (Choice | null)[]) {
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
    const res = await fetch("/api/surveys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error(`Submission failed: ${res.status}`);
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
  // SECTION 1
  {
    id: 1,
    prompt:
      "Why is generative AI's environmental impact often underestimated by users?",
    options: {
      a: "AI runs locally on phones",
      b: "The impact is indirect and invisible",
      c: "AI uses no physical resources",
    },
  },
  {
    id: 2,
    prompt:
      "What is the main reason generative AI systems consume large amounts of electricity?",
    options: {
      a: "Lighting the data center",
      b: "Computer components in the servers",
      c: "Maintaining internet speed",
    },
  },
  {
    id: 3,
    prompt:
      "Which resource is most heavily consumed by data centres running generative AI models?",
    options: { a: "Water", b: "Electricity", c: "Rare earth metals" },
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
  // SECTION 2
  {
    id: 5,
    prompt: "Which phase of generative AI has the highest environmental cost?",
    options: {
      a: "Daily user queries",
      b: "Software updates",
      c: "Model training",
    },
  },
  {
    id: 6,
    prompt:
      "Which factor most increases the carbon footprint of generative AI?",
    options: {
      a: "The device the AI is used on",
      b: "The time of day the AI is used",
      c: "AI model size and complexity",
    },
  },
  {
    id: 7,
    prompt:
      "What happens to AI's environmental footprint when models grow larger?",
    options: {
      a: "It decreases slightly",
      b: "It stays the same",
      c: "It increases significantly",
    },
  },
  {
    id: 8,
    prompt: "Training a large language model can emit as much CO₂ as:",
    options: {
      a: "Charging a phone for a year",
      b: "Several hundred cars over a year",
      c: "Running a laptop for a week",
    },
  },
  {
    id: 9,
    prompt:
      "How much CO₂ does a single ChatGPT query approximately generate (on average)?",
    options: { a: "1.5 grams", b: "0.1 grams", c: "5 grams" },
  },
  {
    id: 10,
    prompt:
      "How much water does a conversation with ChatGPT require (indirectly, via data centre cooling)?",
    options: {
      a: "0.25 L (~1 glass)",
      b: "1 L (~4 glasses)",
      c: "9.4 L (~38 glasses)",
    },
  },
  // SECTION 3
  {
    id: 11,
    prompt: "Which option is the most energy intensive?",
    options: {
      a: "General-purpose generative AI",
      b: "Specialised generative AI",
      c: "Internet search",
    },
  },
  {
    id: 12,
    prompt:
      "Which energy source makes generative AI significantly less carbon-intensive?",
    options: { a: "Coal", b: "Natural gas", c: "Renewable energy" },
  },
  {
    id: 13,
    prompt:
      "Which user behaviour can help reduce the environmental impact of generative AI?",
    options: {
      a: "Asking longer questions",
      b: "Being polite to the AI",
      c: "Being concise with prompts",
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
      "What is the problem with using generative AI instead of traditional tools (e.g., search engines, calculators) for simple tasks?",
    options: {
      a: "None, AI causes no problems",
      b: "AI has higher hidden environmental costs",
      c: "AI provides faster results",
    },
  },
];

export default function PreSurvey() {
  const participantId = getParticipantId();
  const [startedAtISO] = useState(() => new Date().toISOString());
  const [answers, setAnswers] = useState<(Choice | null)[]>(
    Array(PRE_QUESTIONS.length).fill(null),
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [touched, setTouched] = useState(false);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [scorePopupDismissed, setScorePopupDismissed] = useState(false);

  const allAnswered = useMemo(
    () => answers.every((a) => a !== null),
    [answers],
  );
  const score = useMemo(() => computeScore(answers), [answers]);

  const setAnswer = (idx: number, value: Choice) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = value;
      if (next.every((a) => a !== null) && !scorePopupDismissed) {
        setTimeout(() => setShowScorePopup(true), 400);
      }
      return next;
    });
  };

  const correctFor = (idx: number) => ANSWER_KEY[idx];

  const onSubmit = async () => {
    setTouched(true);
    if (!participantId) {
      setSubmitted({
        ok: false,
        message: "Missing participant ID. Please return to consent.",
      });
      return;
    }
    if (!allAnswered) return;

    setSubmitting(true);
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
        message: "Pre-learning survey submitted successfully.",
      });
      window.location.href = "/experiment";
    } else {
      setSubmitted({ ok: false, message: `Submission failed: ${res.error}` });
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
          {PRE_QUESTIONS.map((q, idx) => {
            const selected = answers[idx];
            const correct = correctFor(idx);
            return (
              <section
                key={q.id}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <h2 className="text-sm font-semibold text-slate-800">
                  {q.id}. {q.prompt}
                </h2>
                <div className="mt-4 space-y-2">
                  {(["a", "b", "c"] as Choice[]).map((choice) => {
                    const isSelected = selected === choice;
                    const isCorrectChoice = choice === correct;
                    const showCorrectHighlight = isSelected && isCorrectChoice;
                    const showIncorrectHighlight =
                      isSelected && !isCorrectChoice;

                    const base =
                      "flex items-start gap-3 rounded-xl p-3 ring-1 transition-all duration-200";
                    const interactive =
                      selected !== null
                        ? "cursor-not-allowed opacity-90"
                        : "cursor-pointer";
                    const neutral = "bg-white ring-slate-200 hover:bg-slate-50";
                    const correctStyle = "bg-emerald-100 ring-emerald-400";
                    const incorrectStyle = "bg-red-100 ring-red-400";

                    const labelClass = `${base} ${interactive} ${showIncorrectHighlight ? incorrectStyle : showCorrectHighlight ? correctStyle : neutral}`;

                    const feedbackText = isSelected
                      ? isCorrectChoice
                        ? "Correct!"
                        : "Incorrect."
                      : null;
                    const feedbackClass = `text-xs font-semibold ${isSelected ? (isCorrectChoice ? "text-green-700" : "text-red-800") : ""}`;

                    return (
                      <label key={choice} className={labelClass}>
                        <input
                          type="radio"
                          name={`q${q.id}`}
                          className="mt-1 h-4 w-4"
                          checked={isSelected}
                          disabled={selected !== null}
                          onChange={() =>
                            selected === null && setAnswer(idx, choice)
                          }
                        />
                        <div className="flex w-full items-start justify-between gap-3">
                          <span className="text-sm text-slate-700">
                            <span className="font-semibold">{choice})</span>{" "}
                            {q.options[choice]}
                          </span>
                          {feedbackText && (
                            <span className={feedbackClass}>
                              {feedbackText}
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                {touched && selected === null && (
                  <p className="mt-3 text-sm font-medium text-red-600">
                    Please select an answer.
                  </p>
                )}
              </section>
            );
          })}

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-slate-600">
              Progress:{" "}
              <span className="font-semibold text-slate-900">
                {answers.filter(Boolean).length}
              </span>{" "}
              / {answers.length} • Score:{" "}
              <span className="font-semibold text-slate-900">
                {score.correct} / {score.total}
              </span>
            </div>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!allAnswered || submitting}
              className={`rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm ring-1 transition ${allAnswered && !submitting ? "bg-slate-900 text-white ring-slate-900 hover:opacity-95 hover:bg-slate-700 cursor-pointer" : "bg-slate-200 text-slate-500 ring-slate-200 cursor-not-allowed"}`}
            >
              {submitting ? "Submitting…" : "Submit & Continue"}
            </button>
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

      {showScorePopup && allAnswered && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
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
            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                className={`rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm ring-1 transition ${!submitting ? "bg-slate-900 text-white ring-slate-900 hover:opacity-95 hover:bg-slate-700 cursor-pointer" : "bg-slate-200 text-slate-500 ring-slate-200 cursor-not-allowed"}`}
              >
                {submitting ? "Submitting…" : "Submit & Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
