import { motion } from "framer-motion";
import { useContext, useEffect } from "react";
import TestContext from "./context/TestContext";

export default function FinishingScreen() {
  const ctx = useContext(TestContext);

  useEffect(() => {
    ctx?.setShowSectionProgressPercent(false);
  }, [ctx]);

  const handleContinue = () => {
    window.location.href = "/post";
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-neutral-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl ring-1 ring-slate-200 flex flex-col items-center text-center"
      >
        {/* Heading */}
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          🎉 Learning Complete!
        </motion.h1>

        {/* Message */}
        <motion.p
          className="text-slate-600 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          You have successfully completed the learning experience. Thank you for
          your effort!
        </motion.p>

        <motion.p
          className="text-slate-600 text-sm sm:text-base mb-6 sm:mb-8 leading-snug"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          You will now be taken to the post-survey to complete the follow-up
          assessment.
        </motion.p>

        {/* Continue Button */}
        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: 1.05, backgroundColor: "#374151" }}
          whileTap={{ scale: 0.95 }}
          className="rounded-2xl bg-slate-900 text-white px-6 py-3 text-lg font-semibold shadow-md ring-1 ring-slate-900 transition-all duration-200"
        >
          Continue to Post Survey
        </motion.button>
      </motion.div>
    </div>
  );
}
