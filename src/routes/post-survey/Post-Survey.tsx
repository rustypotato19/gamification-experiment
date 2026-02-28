import { useMemo, useState } from "react";

type Choice = "a" | "b" | "c";
type Question = {
  id: number;
  prompt: string;
  options: { a: string; b: string; c: string };
};

const ANSWER_KEY: Choice[] = [
  "b","b","a","b","c","b","b","c","c","b","c","c","b","b","b"
];

function getParticipantId(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("participantId") ?? "";
}

function computeScore(answers: (Choice | null)[]): { correct: number; total: number } {
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
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Submission failed: ${res.status} ${text}`);
    }
    return { ok: true as const };
  } catch (err) {
    console.error(err);
    return { ok: false as const, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

const POST_QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "On average, approximately how much CO2 does a single ChatGPT query generate?",
    options: { a: "8 milligrams", b: "3 grams", c: "1 kilogram" },
  },
  {
    id: 2,
    prompt: "A 30-minute conversation with ChatGPT is equivalent to what?",
    options: { a: "Driving a car for 10 minutes", b: "Taking a warm shower", c: "Brewing cup of coffee" },
  },
  {
    id: 3,
    prompt: "A 30-minute conversation with ChatGPT requires approximately how much water?",
    options: { a: "0.25 L (~1 glass)", b: "1 L (~4 glasses)", c: "10 L (~40 glasses)" },
  },
  {
    id: 4,
    prompt: "What is the primary reason that generative AI systems consume large amounts of electricity?",
    options: { a: "User screen brightness", b: "Data centre computation and cooling", c: "Internet speed" },
  },
  {
    id: 5,
    prompt: "Which stage in the lifecycle of generative AI has the greatest environmental impact?",
    options: { a: "Daily user queries", b: "Software updates", c: "Model training" },
  },
  {
    id: 6,
    prompt: "Training a large language model such as ChatGPT can emit as much CO₂ as:",
    options: { a: "Charging a phone for a year", b: "Several cars over their entire lifetime", c: "Running a laptop for a week" },
  },
  {
    id: 7,
    prompt: "Why is water usage a concern when discussing AI systems?",
    options: { a: "AI models consume drinking water directly", b: "Water is used to cool data centres", c: "Water improves model accuracy" },
  },
  {
    id: 8,
    prompt: "Which of the following has the greatest impact on the carbon footprint of generative AI?",
    options: { a: "Font size of text output", b: "Number of emojis used", c: "Model complexity" },
  },
  {
    id: 9,
    prompt: "How can you help reduce the environmental impact of generative AI?",
    options: { a: "Asking longer questions", b: "Repeating similar prompts", c: "Being concise and intentional with prompts" },
  },
  {
    id: 10,
    prompt: "What environmental trade-off exists when using generative AI instead of traditional tools?",
    options: { a: "AI always uses less energy", b: "Convenience vs. hidden environmental costs", c: "AI has no environmental impact" },
  },
  {
    id: 11,
    prompt: "Which energy source makes generative AI less carbon-intensive?",
    options: { a: "Coal", b: "Natural gas", c: "Renewable energy (solar, wind, hydro)" },
  },
  {
    id: 12,
    prompt: "What happens to AI’s environmental footprint when models grow larger?",
    options: { a: "It decreases", b: "It stays the same", c: "It increases significantly" },
  },
  {
    id: 13,
    prompt: "Why is AI’s environmental impact often underestimated by users?",
    options: { a: "AI runs locally on phones", b: "The impact is indirect and invisible", c: "AI uses no physical resources" },
  },
  {
    id: 14,
    prompt: "How does mindless and redundant prompting affect the environmental impact of generative AI?",
    options: { a: "It reduces energy use", b: "It increases unnecessary computation", c: "It has no effect" },
  },
  {
    id: 15,
    prompt: "What is the primary resource used for running generative AI?",
    options: { a: "Paper", b: "Electricity", c: "Rare earth metals" },
  },
];

export default function PostSurvey() {
  const participantId = getParticipantId();
  const [startedAtISO] = useState(() => new Date().toISOString());
  const [answers, setAnswers] = useState<(Choice | null)[]>(() => Array(POST_QUESTIONS.length).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ ok: boolean; message: string } | null>(null);
  const [touched, setTouched] = useState(false);

  const allAnswered = useMemo(() => answers.every((a) => a !== null), [answers]);
  const score = useMemo(() => computeScore(answers), [answers]);

  const setAnswer = (idx: number, value: Choice) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  const onSubmit = async () => {
    setTouched(true);
    if (!participantId) {
      setSubmitted({ ok: false, message: "Missing participant ID. Please return to the consent page." });
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
      setSubmitted({ ok: true, message: "Post-learning survey submitted (or queued) successfully." });
      // TODO: navigate to optional experience questionnaire or a thank-you page
      // window.location.href = "/experience-questionnaire";
    } else {
      setSubmitted({
        ok: false,
        message: `Could not submit right now. You can still finish if your flow allows it. (${res.error})`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-200 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Post-Learning Survey</h1>
          <p className="mt-2 text-slate-600">
            Answer all questions. This should take around 5 minutes.
          </p>
          <div className="mt-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-600">
              Participant ID: <span className="font-mono text-slate-900">{participantId || "Not found"}</span>
            </p>
          </div>
        </header>

        <main className="space-y-5">
          {POST_QUESTIONS.map((q, idx) => (
            <section key={q.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-semibold text-slate-800">
                {q.id}. {q.prompt}
              </h2>

              <div className="mt-4 space-y-2">
                {(["a", "b", "c"] as Choice[]).map((choice) => (
                  <label key={choice} className="flex cursor-pointer items-start gap-3 rounded-xl p-3 hover:bg-slate-50">
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      className="mt-1 h-4 w-4"
                      checked={answers[idx] === choice}
                      onChange={() => setAnswer(idx, choice)}
                    />
                    <span className="text-sm text-slate-700">
                      <span className="font-semibold">{choice})</span> {q.options[choice]}
                    </span>
                  </label>
                ))}
              </div>

              {touched && answers[idx] === null ? (
                <p className="mt-3 text-sm font-medium text-red-600">Please select an answer.</p>
              ) : null}
            </section>
          ))}

          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                Progress: <span className="font-semibold text-slate-900">{answers.filter(Boolean).length}</span> / {answers.length}
                <span className="ml-3 text-slate-400">•</span>
                <span className="ml-3">
                  Score (for research use):{" "}
                  <span className="font-semibold text-slate-900">{score.correct}</span> / {score.total}
                </span>
              </div>

              <button
                type="button"
                className={`rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm ring-1 transition ${
                  allAnswered && !submitting
                    ? "bg-slate-900 text-white ring-slate-900 hover:opacity-95"
                    : "bg-slate-200 text-slate-500 ring-slate-200 cursor-not-allowed"
                }`}
                onClick={onSubmit}
                disabled={!allAnswered || submitting}
              >
                {submitting ? "Submitting…" : "Submit & Finish"}
              </button>
            </div>

            {submitted ? (
              <p className={`mt-4 text-sm font-medium ${submitted.ok ? "text-green-700" : "text-amber-700"}`}>
                {submitted.message}
              </p>
            ) : null}

            <p className="mt-3 text-xs text-slate-500">
              Submission is routed to a placeholder endpoint (<span className="font-mono">/api/surveys</span>). Wire this to SQL later.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
