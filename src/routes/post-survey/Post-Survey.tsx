import { useEffect, useMemo, useState } from "react";

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

const POST_QUESTIONS: Question[] = [
  {
    id: 1,
    prompt:
      "Which resource do data centres primarily consume when running large AI models?",
    options: {
      a: "Water",
      b: "Electricity",
      c: "Rare earth metals",
    },
  },
  {
    id: 2,
    prompt:
      "Why do many people overlook the environmental effects of generative AI?",
    options: {
      a: "AI runs mostly on personal devices",
      b: "The environmental costs happen behind the scenes",
      c: "AI systems require almost no infrastructure",
    },
  },
  {
    id: 3,
    prompt:
      "Why do generative AI services require significant electrical power?",
    options: {
      a: "To power lighting in server facilities",
      b: "To run the computing hardware in servers",
      c: "To maintain internet connectivity speeds",
    },
  },
  {
    id: 4,
    prompt:
      "Why is water usage linked to the environmental impact of AI systems?",
    options: {
      a: "Water is used to wash hardware components",
      b: "Water helps cool the equipment in data centres",
      c: "AI systems do not rely on water at all",
    },
  },
  {
    id: 5,
    prompt:
      "During which stage of an AI model's lifecycle is the environmental cost typically highest?",
    options: {
      a: "When users ask everyday questions",
      b: "During regular software updates",
      c: "During the model training process",
    },
  },
  {
    id: 6,
    prompt:
      "What factor most strongly increases the environmental footprint of AI systems?",
    options: {
      a: "The type of device used by the user",
      b: "The time of day people use AI",
      c: "The scale and complexity of the model",
    },
  },
  {
    id: 7,
    prompt:
      "What generally happens to environmental impact as AI models become larger?",
    options: {
      a: "It decreases slightly",
      b: "It stays roughly the same",
      c: "It increases substantially",
    },
  },
  {
    id: 8,
    prompt:
      "Training a large language model may produce a similar amount of CO₂ as:",
    options: {
      a: "Charging a smartphone for an entire year",
      b: "The yearly emissions of hundreds of cars",
      c: "Using a laptop for one week",
    },
  },
  {
    id: 9,
    prompt:
      "Approximately how much CO₂ is produced by a single AI chatbot query on average?",
    options: {
      a: "1.5 grams",
      b: "0.1 grams",
      c: "5 grams",
    },
  },
  {
    id: 10,
    prompt:
      "Which of the following generally requires the most energy to operate?",
    options: {
      a: "General-purpose generative AI",
      b: "Specialised generative AI tools",
      c: "A traditional internet search",
    },
  },
  {
    id: 11,
    prompt:
      "How much water can be indirectly required for cooling during a typical chatbot interaction?",
    options: {
      a: "About 0.25 litres",
      b: "About 1 litre",
      c: "Around 9.4 litres",
    },
  },
  {
    id: 12,
    prompt:
      "Which energy source can significantly reduce the carbon footprint of AI infrastructure?",
    options: {
      a: "Coal",
      b: "Natural gas",
      c: "Renewable energy",
    },
  },
  {
    id: 13,
    prompt:
      "Which user behaviour can help minimise the environmental impact of generative AI?",
    options: {
      a: "Writing longer prompts",
      b: "Always thanking the AI",
      c: "Using clear and concise prompts",
    },
  },
  {
    id: 14,
    prompt:
      "What effect does repeatedly submitting similar prompts have on environmental impact?",
    options: {
      a: "It reduces the total energy needed",
      b: "It increases unnecessary computation",
      c: "It has no measurable effect",
    },
  },
  {
    id: 15,
    prompt:
      "Why might using generative AI for very simple tasks be considered inefficient?",
    options: {
      a: "There is no downside to doing this",
      b: "It can involve greater hidden environmental costs",
      c: "AI always produces slower answers",
    },
  },
];

export default function PostSurvey() {
  const participantId = getParticipantId();
  const [startedAtISO] = useState(() => new Date().toISOString());
  const [answers, setAnswers] = useState<(Choice | null)[]>(() =>
    Array(POST_QUESTIONS.length).fill(null),
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
      surveyType: "post",
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
        message: "Post-learning survey submitted (or queued) successfully.",
      });

      window.location.href = "/end";
    } else {
      setSubmitted({
        ok: false,
        message: `Could not submit right now. You can still proceed if your flow allows it. (${res.error})`,
      });
    }
  };

  useEffect(() => {
    localStorage.setItem("studyStage", "post");
  }, []);

  return (
    <div className="min-h-screen bg-neutral-200 text-slate-900">
      <div
        className={`mx-auto max-w-3xl px-4 py-10 ${showScorePopup && !scorePopupDismissed ? "blur-sm" : ""}`}
      >
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Post-Learning Survey</h1>
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
          {POST_QUESTIONS.map((q, idx) => (
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
