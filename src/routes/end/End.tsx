import { motion } from "framer-motion";
import { useEffect } from "react";

export default function End() {
  useEffect(() => {
    localStorage.setItem("studyStage", "end");
  }, []);
  const handleContinue = () => {
    window.location.href = "/ux";
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center px-4">
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
          🎉 Study Complete!
        </motion.h1>

        <motion.p
          className="text-slate-600 text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Thank you very much for your participation.
        </motion.p>

        <motion.p
          className="text-slate-600 text-md mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          I would appreciate if you could take a few extra minutes to complete a
          user experience survey. Participation for this is{" "}
          <b>completely optional</b> but would mean a great deal to me.
        </motion.p>
        <motion.p
          className="text-slate-600 text-md mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          To participate, click the button below. Otherwise, you may close this
          page.
        </motion.p>
        <motion.p
          className="text-slate-600 text-md mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Thank you again for you participation in the study.
        </motion.p>

        <button
          onClick={handleContinue}
          className="rounded-2xl bg-slate-900 text-white px-6 py-3 text-lg font-semibold shadow-sm ring-1 ring-slate-900 transition-all duration-200 hover:cursor-pointer hover:bg-slate-700 hover:scale-105 active:scale-95"
        >
          Continue to User Experience Survey
        </button>
      </motion.div>
    </div>
  );
}
