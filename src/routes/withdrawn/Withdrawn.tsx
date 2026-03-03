export default function Withdrawn() {

    localStorage.setItem("withdrawn", "true")

    return (
        <div className="min-h-screen bg-neutral-200 text-slate-900 flex items-center justify-center">
            <div className="max-w-2xl p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">You have withdrawn from the study</h1>
                <p className="text-lg mb-4">
                    Our records indicate that you have withdrawn from the study. You may close this page. If you have already submitted any anonymous survey responses, they may still be retained in aggregated form.
                </p>
            </div>
        </div>
    );
};