export default function Withdrawn() {
  // Mark the participant as withdrawn
  if (typeof window !== "undefined") {
    localStorage.setItem("withdrawn", "true");
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl p-8 bg-white rounded-2xl shadow-lg ring-1 ring-slate-200">
        <h1 className="text-3xl font-bold mb-4 text-slate-900">
          You have withdrawn from the study
        </h1>
        <p className="text-lg text-slate-700 mb-2">
          Our records indicate that you have withdrawn from the study. You may
          close this page.
        </p>
        <p className="text-lg text-slate-700">
          If you have already submitted any anonymous survey responses, they may
          still be retained in aggregated form.
        </p>
      </div>
    </div>
  );
}
