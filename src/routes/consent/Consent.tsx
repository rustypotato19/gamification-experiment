import { useEffect, useMemo, useState } from "react";

type ConsentState = {
  readInfoSheet: boolean;
  voluntaryWithdraw: boolean;
  age18Plus: boolean;
  understoodAndAgree: boolean;
};

function generateParticipantId(): string {
  const prefix = Math.random().toString(36).slice(2, 6).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

function formatLocalDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function postJson<T>(
  url: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: `HTTP ${res.status} ${text}`.trim() };
    }

    const data = (await res.json().catch(() => null)) as T | null;
    return { ok: true, data: data ?? ({} as T) };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unknown network error",
    };
  }
}

export default function InfoConsentPage() {
  const experimentEndsISO = "2026-03-31T23:59:59";

  const atExperiment =
    window.localStorage.getItem("studyStage") === "experiment";

  const [consent, setConsent] = useState<ConsentState>({
    readInfoSheet: false,
    voluntaryWithdraw: false,
    age18Plus: false,
    understoodAndAgree: false,
  });
  const [touched, setTouched] = useState(false);

  const [participantId, setParticipantId] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    const existing = window.localStorage.getItem("participantId");
    if (existing) return existing;

    const id = generateParticipantId();
    window.localStorage.setItem("participantId", id);
    return id;
  });

  // DB action state
  const [dbBusy, setDbBusy] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Keep localStorage in sync when the ID is regenerated.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!participantId) return;
    window.localStorage.setItem("participantId", participantId);
  }, [participantId]);

  const allRequiredChecked = useMemo(() => {
    return (
      consent.readInfoSheet &&
      consent.voluntaryWithdraw &&
      consent.age18Plus &&
      consent.understoodAndAgree
    );
  }, [consent]);

  const setConsentField = (field: keyof ConsentState) => (checked: boolean) => {
    setConsent((c) => ({ ...c, [field]: checked }));
  };

  const [copyClicked, setCopyClicked] = useState(false);

  const getParticipantIdFromStorage = () => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("participantId");
  };

  const getParticipantConsentFromStorage = () => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("consentGiven") === "true";
  };

  const gettedParticipantId = getParticipantIdFromStorage();
  const gettedConsent = getParticipantConsentFromStorage();

  const errorText =
    touched && !allRequiredChecked
      ? "Please confirm all required statements to continue."
      : "";

  const onContinue = async () => {
    setTouched(true);
    setDbError(null);
    if (!allRequiredChecked) return;
    if (!participantId) {
      setDbError("Missing participant ID. Please refresh the page.");
      return;
    }

    setDbBusy(true);

    // 1) Attempt DB write first (preferred)
    const consentTimestamp = new Date().toISOString();
    const res = await postJson<{ ok: boolean }>(`/api/consent`, {
      participantId,
      readInfoSheet: consent.readInfoSheet,
      voluntaryWithdraw: consent.voluntaryWithdraw,
      age18Plus: consent.age18Plus,
      understoodAndAgree: consent.understoodAndAgree,
      consentTimestamp,
    });

    // 2) Always set localStorage so your UX flow remains smooth
    window.localStorage.setItem("consentGiven", "true");
    window.localStorage.setItem("consentTimestamp", consentTimestamp);

    setDbBusy(false);

    if (!res.ok) {
      // Keep the participant in the study flow even if DB fails,
      // but show a warning (you can choose to block instead if you prefer).
      alert(
        `Consent saved locally, but the server could not be reached. (${res.error})`,
      );
      // Still proceed:
      // window.location.href = "/pre";
      return;
    }

    // alert("Successfully saved consent. Thank you for participating!");

    window.location.href = "/pre";
  };

  const onWithdraw = async () => {
    setDbError(null);

    const pid = gettedParticipantId || participantId;
    if (!pid) {
      // Still clear local state
      window.localStorage.removeItem("consentGiven");
      window.localStorage.removeItem("consentTimestamp");
      window.location.href = "/consent";
      alert(
        "You have withdrawn from the study. You may close this page. If you have already submitted any anonymous survey responses, they may still be retained in aggregated form.",
      );
      return;
    }

    setDbBusy(true);

    // Try to mark withdrawn in DB
    const res = await postJson<{ ok: boolean }>(`/api/withdraw`, {
      participantId: pid,
    });

    // Clear entire local state regardless
    window.localStorage.clear();

    setDbBusy(false);

    if (!res.ok) {
      setDbError(
        `Withdrawn locally, but the server could not be reached. (${res.error})`,
      );
    }

    window.location.href = "/withdrawn";
    alert(
      "You have withdrawn from the study. You may close this page. If you have already submitted any anonymous survey responses, they may still be retained in aggregated form.",
    );
  };

  return (
    <div className="min-h-screen bg-neutral-200 text-slate-900 flex items-center justify-center">
      {gettedParticipantId && gettedConsent && !atExperiment ? (
        <main className="min-h-screen bg-slate-50 text-slate-900 w-full max-w-1/2 text-center">
          <div className="mx-auto max-w-3xl px-4 py-10"></div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold">
              You have registered obtained consent and are registered in the study.
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Your participant ID is:{" "}
              <span className="font-mono font-semibold">
                {gettedParticipantId}
              </span>
              .
            </p>

            {dbError ? (
              <p className="mt-4 text-sm font-medium text-amber-700">
                {dbError}
              </p>
            ) : null}

            <p className="mt-4 text-sm text-slate-600">
              If you have this page open in error or wish to withdraw, please
              click the button below.
            </p>
            <button
              type="button"
              className={`mt-4 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-800 ring-1 ring-slate-200 transition-all duration-200 ${
                dbBusy
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-slate-50 hover:cursor-pointer active:bg-slate-200"
              }`}
              onClick={onWithdraw}
              disabled={dbBusy}
            >
              {dbBusy ? "Processing…" : "Withdraw from Study"}
            </button>

            <p className="mt-4 text-sm text-slate-600">
              If you have not already completed the pre-experiment survey,
              please return to it to continue participation.
            </p>
            <button
              type="button"
              className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white ring-1 ring-slate-900 hover:bg-slate-700 hover:cursor-pointer transition-all duration-200"
              onClick={() => (window.location.href = "/pre")}
            >
              Go to Pre-Experiment Survey
            </button>
          </div>
        </main>
      ) : atExperiment ? (
        <main className="min-h-screen bg-slate-50 text-slate-900 w-full max-w-1/2 text-center">
          <div className="mx-auto max-w-3xl px-4 py-10"></div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold">
              You have already registered consent and are at the experiment stage.
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Your participant ID is:{" "}
              <span className="font-mono font-semibold">
                {gettedParticipantId}
              </span>
              .
            </p>

            {dbError ? (
              <p className="mt-4 text-sm font-medium text-amber-700">
                {dbError}
              </p>
            ) : null}

            <p className="mt-4 text-sm text-slate-600">
              If you have this page open in error or wish to withdraw, please
              click the button below.
            </p>
            <button
              type="button"
              className={`mt-4 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-800 ring-1 ring-slate-200 transition-all duration-200 ${
                dbBusy
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-slate-50 hover:cursor-pointer active:bg-slate-200"
              }`}
              onClick={onWithdraw}
              disabled={dbBusy}
            >
              {dbBusy ? "Processing…" : "Withdraw from Study"}
            </button>

            <p className="mt-4 text-sm text-slate-600">
              Otherwise, click the button below to continue to the experiment.
            </p>
            <button
              type="button"
              className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white ring-1 ring-slate-900 hover:bg-slate-700 hover:cursor-pointer transition-all duration-200"
              onClick={() => (window.location.href = "/experiment")}
            >
              Go to Experiment
            </button>
          </div>
        </main>
      ) : (
        <div className="mx-auto max-w-3xl px-4 py-10">
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
              <span className="text-xs font-semibold tracking-wide text-slate-600">
                Study
              </span>
              <span className="text-xs text-slate-500">
                Gamifying environmental awareness
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight">
              Participant Information Sheet & Consent
            </h1>
            <p className="mt-2 text-slate-600">
              Please read the information below carefully before agreeing to
              participate.
            </p>
          </header>

          <main className="space-y-6">
            {/* Participant ID */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold">Your participant ID</h2>
              <p className="mt-2 text-sm text-slate-600">
                You will need this ID to continue participation in the study. It
                is pseudo-random and does not identify you.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="rounded-xl bg-slate-900 px-4 py-3 font-mono text-sm text-white">
                  {participantId || "Generating…"}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`rounded-xl ${
                      copyClicked ? "bg-green-500" : "bg-slate-100"
                    } px-4 py-3 text-sm font-medium text-slate-800 ring-1 ring-slate-200 ${
                      copyClicked ? "" : "hover:bg-slate-200"
                    } hover:cursor-pointer transition-all duration-200`}
                    onClick={() => {
                      if (!participantId) return;
                      navigator.clipboard?.writeText(participantId);
                      setCopyClicked(true);
                      setTimeout(() => setCopyClicked(false), 2000);
                    }}
                  >
                    {copyClicked ? "Copied!" : "Copy ID"}
                  </button>
                  <button
                    type="button"
                    className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 hover:cursor-pointer active:bg-slate-200 transition-all duration-200"
                    onClick={() => {
                      const id = generateParticipantId();
                      setParticipantId(id);
                      window.localStorage.setItem("participantId", id);

                      // If they regenerate, clear any previous consent flags locally:
                      window.localStorage.removeItem("consentGiven");
                      window.localStorage.removeItem("consentTimestamp");
                      setDbError(null);
                    }}
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            </section>

            {/* Information Sheet */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold">Information Sheet</h2>

              <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-700">
                <p>
                  As a part of my studies in Computer Science, I am carrying out
                  a study involving the effectiveness of
                  <span className="font-semibold"> gamification</span>.
                </p>

                <p>
                  Gamification refers to the purposeful use of game elements in
                  non-game scenarios - elements such as rewards, competition,
                  leaderboards/ranking, or being scored. The purpose is to
                  create a larger incentive to complete a particular task.
                </p>

                <p>
                  This study focuses on spreading awareness about the negative
                  environmental effects of generative artificial intelligence
                  (GenAI). GenAI includes tools such as ChatGPT, Gemini, or
                  Copilot. These tools are resource intensive and can increase
                  energy usage, which can impact the environment.
                </p>

                <hr className="my-2 border-slate-200" />

                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-medium">Eligibility:</span> You must
                    be{" "}
                    <span className="font-medium">
                      18 years of age or older
                    </span>
                    .
                  </li>
                  <li>
                    <span className="font-medium">
                      Voluntary participation:
                    </span>{" "}
                    You are free to withdraw from the study at any point.
                  </li>
                  <li>
                    <span className="font-medium">Experiment end time:</span>{" "}
                    The experiment will conclude on{" "}
                    <span className="font-medium">31/03/2026 at 23:59</span>.
                    <span className="block text-xs text-slate-500">
                      (Displayed in your local format:{" "}
                      {formatLocalDateTime(experimentEndsISO)})
                    </span>
                  </li>
                  <li>
                    <span className="font-medium">Anonymity:</span> No data that
                    could identify you will be stored at any point during the
                    study.
                  </li>
                  <li>
                    <span className="font-medium">Participant ID:</span> You
                    will receive a pseudo-random participant ID which is
                    required to continue.
                  </li>
                  <li>
                    <span className="font-medium">
                      Data storage during the study:
                    </span>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>A personal, private, password-protected server</li>
                      <li>A personal, private, password-protected laptop</li>
                      <li>
                        A personal, private, university OneDrive cloud storage
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span className="font-medium">Data retention:</span> Any
                    data stored on personal storage will be deleted within 3
                    months of the dissertation submission deadline in May 2026.
                  </li>
                  <li>
                    <span className="font-medium">Results publication:</span>{" "}
                    Anonymous results will be uploaded to the YSJ RaYDaR
                    repository indefinitely upon the study's completion.
                  </li>
                </ul>

                <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Study structure
                  </h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Pre-experiment survey (~5 minutes)</li>
                    <li>Experiment (~20 minutes)</li>
                    <li>Post-experiment survey (~5 minutes)</li>
                  </ul>
                  <p className="mt-3 text-slate-700">
                    You will also be invited to complete an{" "}
                    <span className="font-medium">optional</span> questionnaire
                    about the learning experience (≤ 5 minutes).
                  </p>
                </div>

                <p>
                  If you have questions about any part of the study, please
                  contact:
                  <br />
                  <span className="font-medium">Konrad Mitura</span>
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <a
                    className="font-medium text-slate-900 underline decoration-slate-300 hover:decoration-slate-600"
                    href="mailto:konradmitura8@gmail.com"
                  >
                    konradmitura8@gmail.com
                  </a>
                  <span className="text-slate-400">|</span>
                  <a
                    className="font-medium text-slate-900 underline decoration-slate-300 hover:decoration-slate-600"
                    href="mailto:konrad.mitura@yorksj.ac.uk"
                  >
                    konrad.mitura@yorksj.ac.uk
                  </a>
                </div>

                <p className="text-slate-700">
                  I am very grateful for your participation.
                </p>
              </div>
            </section>

            {/* Consent Form */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold">
                Participant Consent Form
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Gamifying environmental awareness: An evaluation of the
                effectiveness of gamification in spreading awareness and
                increasing willingness to learn about the negative environmental
                effects of generative AI.
              </p>
              <br />
              <p className="text-sm text-slate-700">
                All statements are required to be checked before proceeding.
              </p>

              <div className="mt-4 space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl p-3 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 cursor-pointer"
                    checked={consent.readInfoSheet}
                    onChange={(e) =>
                      setConsentField("readInfoSheet")(e.target.checked)
                    }
                    disabled={dbBusy}
                  />
                  <span className="text-sm text-slate-700">
                    <span className="font-medium">1{")"}</span> I have read and
                    understood the information sheet relating to this project.
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl p-3 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    className="mt-1 h-4.5 w-4.5 cursor-pointer"
                    checked={consent.voluntaryWithdraw}
                    onChange={(e) =>
                      setConsentField("voluntaryWithdraw")(e.target.checked)
                    }
                    disabled={dbBusy}
                  />
                  <span className="text-sm text-slate-700">
                    <span className="font-medium">2{")"}</span> I understand
                    that my participation is entirely voluntary and that I have
                    the right to withdraw from the project.
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl p-3 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 cursor-pointer"
                    checked={consent.age18Plus}
                    onChange={(e) =>
                      setConsentField("age18Plus")(e.target.checked)
                    }
                    disabled={dbBusy}
                  />
                  <span className="text-sm text-slate-700">
                    <span className="font-medium">3{")"}</span> I confirm that I
                    am 18 years of age or older.
                  </span>
                </label>

                <div className="mt-2 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-4.5 w-4.5 cursor-pointer"
                      checked={consent.understoodAndAgree}
                      onChange={(e) =>
                        setConsentField("understoodAndAgree")(e.target.checked)
                      }
                      disabled={dbBusy}
                    />
                    <span className="text-sm text-slate-700">
                      <span className="font-semibold">By checking here</span>,
                      you confirm that you have read through and understand the
                      above conditions and are agreeing to continue.
                      <span className="block text-xs text-slate-500">
                        (Required)
                      </span>
                    </span>
                  </label>
                </div>

                {errorText ? (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errorText}
                  </p>
                ) : null}

                {dbError ? (
                  <p className="mt-2 text-sm font-medium text-amber-700">
                    {dbError}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className={`rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm ring-1 transition ${
                    allRequiredChecked && !dbBusy
                      ? "bg-slate-900 text-white ring-slate-900 hover:bg-slate-700 hover:cursor-pointer"
                      : "bg-slate-200 text-slate-500 ring-slate-200 cursor-not-allowed"
                  }`}
                  onClick={onContinue}
                  disabled={!allRequiredChecked || dbBusy}
                >
                  {dbBusy ? "Saving…" : "Continue to Pre-Experiment Survey"}
                </button>

                <button
                  type="button"
                  className={`rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 transition-all duration-200 ${
                    dbBusy
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-slate-200 hover:cursor-pointer active:bg-slate-200"
                  }`}
                  onClick={onWithdraw}
                  disabled={dbBusy}
                >
                  Withdraw
                </button>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Note: This page stores your participant ID and consent status
                locally in your browser to support the study flow. If you are
                using a shared device, consider using a private window.
              </p>
            </section>

            <footer className="pt-2 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} — York St John University (Study
              participant page)
            </footer>
          </main>
        </div>
      )}
    </div>
  );
}
