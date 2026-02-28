type Props = {
  participantId: string;
};

export default function Control({ participantId }: Props) {
  return (
    <div className="h-full flex flex-col p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Learning Modules</h1>
        <p className="text-sm text-slate-600">
          Participant: {participantId}
        </p>
      </header>

      <main className="flex-1 bg-white rounded-2xl shadow p-6 flex items-center justify-center">
        <p className="text-slate-700 text-center">
          Control condition content goes here.
        </p>
      </main>
    </div>
  );
}