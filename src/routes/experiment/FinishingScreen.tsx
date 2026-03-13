import { motion } from "framer-motion";

export default function FinishingScreen() {
  const handleContinue = () => {
    window.location.href = "/post";
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-xl w-full bg-white rounded-2xl p-8 shadow-lg ring-1 ring-slate-200 text-center"
      >
        <motion.h1
          className="text-3xl font-bold text-slate-900 mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          🎉 Learning Complete!
        </motion.h1>

        <motion.p
          className="text-slate-600 text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          You have completed the learning experience. Thank you for your effort!
        </motion.p>

        <motion.p
          className="text-slate-600 text-md mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          You will now be taken to the post-survey to complete the follow-up
          test.
        </motion.p>

        <button
          onClick={handleContinue}
          className="rounded-2xl bg-slate-900 text-white px-6 py-3 text-lg font-semibold shadow-sm ring-1 ring-slate-900 transition-all duration-200 hover:cursor-pointer hover:bg-slate-700 hover:scale-105 active:scale-95"
        >
          Continue to Post Survey
        </button>
      </motion.div>
    </div>
  );
}
