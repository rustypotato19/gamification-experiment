import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Routes, Route, BrowserRouter, Navigate } from "react-router";
import Consent from "./routes/consent/Consent";
import PreSurvey from "./routes/pre-survey/Pre-Survey";
import PostSurvey from "./routes/post-survey/Post-Survey";
import Experiment from "./routes/experiment/Experiment";
import Withdrawn from "./routes/withdrawn/Withdrawn";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/consent" element={<Consent />} />
        <Route path="/pre" element={<PreSurvey />} />
        <Route path="/experiment" element={<Experiment />} />
        <Route path="/post" element={<PostSurvey />} />
        <Route path="/withdrawn" element={<Withdrawn />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/consent" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
