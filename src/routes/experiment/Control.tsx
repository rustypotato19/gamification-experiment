import { useContext, useEffect, useState } from "react";
import TestContext from "./context/TestContext";

type Props = {
  participantId: string;
};

export default function Control({ participantId }: Props) {
  const ctx = useContext(TestContext);

  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [dbBusy, setDbBusy] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    ctx?.testMilestonesType.setSection1StartTime(Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const onWithdraw = async () => {
    setDbError(null);

    const pid = participantId;

    if (!pid) {
      window.localStorage.clear();
      window.location.href = "/consent";
      return;
    }

    setDbBusy(true);

    const res = await postJson<{ ok: boolean }>(`/api/withdraw`, {
      participantId: pid,
    });

    window.localStorage.clear();

    setDbBusy(false);

    if (!res.ok) {
      setDbError(
        `Withdrawn locally, but the server could not be reached. (${res.error})`,
      );
    }

    window.location.href = "/withdrawn";
  };

  return (
    <div className="h-full max-w-screen w-full flex flex-col p-6 items-center overflow-y-auto">
      <header className="mb-2 text-center relative">
        <h1 className="text-2xl font-bold">Learning Modules</h1>
        <p className="text-sm text-slate-600">Participant: {participantId}</p>

        <button
          onClick={() => setShowWithdrawPopup(true)}
          className="bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-500 hover:cursor-pointer mt-2"
        >
          Withdraw
        </button>
      </header>

      <main className="max-w-full flex flex-col gap-12 bg-white rounded-2xl drop-shadow-xl border border-black/20 p-8">
        <h1 className="text-sm italic">
          Please read through the following information, and continue onto the
          next section when ready.
        </h1>

        {/* SECTION 1 */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">1. What is AI?</h2>

          <div className="flex flex-col items-start gap-4">
            <p>
              The term <b>Artificial Intelligence (AI)</b> is often used to
              describe modern systems like ChatGPT or Gemini. These systems are
              more accurately known as <b>Large Language Models (LLMs)</b>.
            </p>

            <p>
              LLMs analyse extremely large collections of text and learn
              patterns between words. Using these patterns, they predict what
              word is most likely to come next when generating a response.
            </p>

            <p>
              Because of this, LLMs do not truly understand language in the same
              way humans do. Instead, they perform mathematical calculations to
              produce statistically likely outputs.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4">
            <p>
              Training these systems requires extremely large computing
              infrastructure. The process involves running simulations for long
              periods of time using specialised hardware.
            </p>

            <img
              src="/images/server-rack.jpg"
              className="sm:max-w-sm rounded-sm"
            />

            <p>
              Large facilities called <b>data centres</b> contain thousands of
              processors and graphics cards used to train and run AI systems.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4">
            <p>
              Running these facilities requires large amounts of electricity and
              water. Water is frequently used to cool servers that generate
              large amounts of heat during computation.
            </p>

            <img src="/images/data-center-co2.png" className="sm:max-w-sm" />

            <p>
              Since much of the world's electricity is still produced using
              fossil fuels such as coal and oil, this energy consumption can
              lead to the production of <b>carbon dioxide (CO₂)</b>.
            </p>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">2. Resource Consumption</h2>

          <p>
            AI models require resources during two stages: <b>training</b> and
            <b> usage</b>. Training requires a large amount of resources in a
            short period of time, while everyday usage accumulates resource
            consumption over time.
          </p>

          <p>
            A commonly referenced model is <b>GPT-3</b>, which required
            significant computing power during training.
          </p>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">Electricity</h3>
            <p>
              Training GPT-3 reportedly required around <b>1,300 MWh</b> of
              electricity. This is comparable to the annual electricity usage of
              around 120 households.
            </p>

            <p>
              Individual AI queries use far less electricity <b>(~1 Wh)</b>, but
              billions of queries are made each day worldwide. When combined
              over time, the energy consumption becomes substantial.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">Water</h3>
            <p>
              Training GPT-3 is estimated to have required approximately
              <b> 700,000 litres of water</b>, primarily used for cooling data
              centre hardware.
            </p>

            <p>
              Although a single query uses very little water <b>(~0.3ml)</b>,
              billions of requests across many systems can accumulate into large
              totals.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">Carbon Emissions</h3>
            <p>
              Estimates suggest GPT-3 produced roughly <b>500 tonnes of CO₂</b>{" "}
              during training.
            </p>
            <p>
              Although a single query produced very little CO₂ <b>(~0.1g)</b>,
              billions of requests across many systems eventually add up into
              large totals.
            </p>

            <p>
              These emissions are influenced by the energy sources used to power
              data centres. Systems powered by fossil fuels will produce more
              emissions than those powered by renewable energy.
            </p>
          </div>

          <p>
            It is important to note that these figures are estimates. Companies
            developing AI systems do not always publish full environmental data.
          </p>
        </section>

        {/* SECTION 3 */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">
            3. Reducing Environmental Impact
          </h2>

          <p>
            Some environmental impacts of AI systems can be reduced through
            technological and behavioural changes.
          </p>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">Renewable Energy</h3>

            <img src="/images/renewable-energy.jpg" className="sm:max-w-sm" />

            <p>
              Powering data centres using renewable sources such as wind, solar,
              or hydroelectric energy could significantly reduce emissions
              associated with AI systems.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">Model Design</h3>

            <p>
              Many modern AI systems are designed as general-purpose tools that
              perform many different tasks.
            </p>

            <p>
              AI systems/LLMs that are general purpose are incredibly intensive
              to train.
            </p>

            <p>
              Specialised models designed for specific tasks can require fewer
              resources to train and operate.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">User Behaviour</h3>

            <p>
              Individual users can also influence resource consumption through
              their usage habits.
            </p>

            <ul className="list-disc ml-6">
              <li>Avoid unnecessary prompts</li>
              <li>Combine questions when possible</li>
              <li>Use traditional search engines before resorting to AI</li>
            </ul>

            <p>
              Being mindful about how AI systems are used can help reduce
              unnecessary computational demand.
            </p>
          </div>

          <p>
            Both companies and users share responsibility for reducing the
            environmental impact of modern AI technologies.
          </p>
        </section>

        {/* Continue */}
        <div className="flex justify-center pt-6">
          <button
            onClick={() => {
              ctx?.testMilestonesType.setSection1EndTime(Date.now());
              window.location.href = "post";
            }}
            className="bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-slate-500 transition font-semibold hover:cursor-pointer"
          >
            Continue to Test
          </button>
        </div>
      </main>

      {/* Withdraw Modal */}
      {showWithdrawPopup && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl border shadow-2xl p-8 max-w-md flex flex-col gap-4">
            <h1 className="font-bold text-xl text-center">
              Confirm Withdrawal from Study
            </h1>

            {dbError ? (
              <>
                <p>Error: {dbError}</p>
                <p>
                  Please contact <strong>konrad.mitura@yorksj.ac.uk</strong>
                </p>
                <p>Participant ID: {participantId}</p>
              </>
            ) : (
              <>
                <p>
                  If you withdraw from this study, you will not be able to
                  participate again.
                </p>
                <p>
                  Some anonymous data may still be retained for research
                  purposes.
                </p>

                <p className="font-semibold text-center mt-2">
                  Do you still wish to withdraw?
                </p>
              </>
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowWithdrawPopup(false)}
                disabled={dbBusy}
                className="bg-red-700 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-500 disabled:bg-neutral-500 hover:cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={onWithdraw}
                disabled={dbBusy}
                className="bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-500 disabled:bg-neutral-500 hover:cursor-pointer"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
