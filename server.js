import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { extractFieldsFromAnswer } from "./groqClient.js";
import { getQuestionListForMode } from "./interviewFlow.js";
import { initialPacketData, buildHumanSummary } from "./packetSchema.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory session store
const sessions = new Map();

function createNewSession(mode = "quick") {
  const id = Math.random().toString(36).substring(2, 10);
  const questions = getQuestionListForMode(mode);

  sessions.set(id, {
    session_id: id,
    mode,
    current_index: 0,
    data: { ...initialPacketData },
    questions
  });

  return sessions.get(id);
}

function getCurrentQuestion(session) {
  if (!session) return null;
  const { current_index, questions } = session;
  if (current_index < 0 || current_index >= questions.length) return null;
  return questions[current_index];
}

function isStopCommand(text = "") {
  const t = (text || "").toLowerCase();
  return (
    t.includes("stop") ||
    t.includes("end demo") ||
    t.includes("finish") ||
    t.includes("that's enough")
  );
}

// -------------------------
// START SESSION
// -------------------------
app.post("/start", (req, res) => {
  try {
    const { mode_choice } = req.body || {};

    let mode = "quick";
    if (mode_choice) {
      const m = String(mode_choice).toLowerCase();
      if (m.includes("full")) mode = "full";
    }

    const session = createNewSession(mode);
    const firstQuestion = getCurrentQuestion(session);

    return res.json({
      session_id: session.session_id,
      mode: session.mode,
      message:
        "Welcome to the sleep intake assistant. We’ll walk through your packet together.",
      next_question: firstQuestion
        ? { id: firstQuestion.id, prompt: firstQuestion.prompt }
        : null
    });
  } catch (e) {
    console.error("/start error:", e);
    return res.status(500).json({ error: "Failed to start session." });
  }
});

// -------------------------
// INTAKE (MAIN LOGIC)
// -------------------------
app.post("/intake", async (req, res) => {
  try {
    const { session_id, answer_text } = req.body || {};

    if (!session_id) {
      return res.status(400).json({ error: "session_id is required." });
    }

    const session = sessions.get(session_id);
    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    // Stop command
    if (isStopCommand(answer_text)) {
      const human_summary = buildHumanSummary(session.data);
      return res.json({
        session_id,
        mode: session.mode,
        status: "stopped",
        message: "Got it, we’ll stop here and summarize what we have so far.",
        data_json: session.data,
        human_summary
      });
    }

    const currentQuestion = getCurrentQuestion(session);

    // End of interview
    if (!currentQuestion) {
      const human_summary = buildHumanSummary(session.data);
      return res.json({
        session_id,
        mode: session.mode,
        status: "complete",
        message:
          "We’ve reached the end of this interview. Here’s a summary of what we collected.",
        data_json: session.data,
        human_summary
      });
    }

    // Info-only question
    if (!currentQuestion.key) {
      session.current_index += 1;
    } else {
      // Safe Groq call
      let updated = session.data;

      try {
        const groqResult = await extractFieldsFromAnswer({
          mode: session.mode,
          current_question: currentQuestion.prompt,
          answer_text,
          collected_data: session.data
        });

        if (groqResult && groqResult.updated_data) {
          updated = { ...session.data, ...groqResult.updated_data };
        }
      } catch (err) {
        console.error("Groq extraction error:", err);
      }

      session.data = updated;
      session.current_index += 1;
    }

    const nextQuestion = getCurrentQuestion(session);

    // End of interview
    if (!nextQuestion) {
      const human_summary = buildHumanSummary(session.data);
      return res.json({
        session_id,
        mode: session.mode,
        status: "complete",
        message:
          "We’ve reached the end of this interview. Here’s a summary of what we collected.",
        data_json: session.data,
        human_summary
      });
    }

    // Continue interview
    return res.json({
      session_id,
      mode: session.mode,
      status: "in_progress",
      next_question: {
        id: nextQuestion.id,
        prompt: nextQuestion.prompt
      },
      partial_data_json: session.data
    });
  } catch (e) {
    console.error("/intake error:", e);
    return res.status(500).json({ error: "Failed to process intake answer." });
  }
});

// -------------------------
// STOP SESSION
// -------------------------
app.post("/stop", (req, res) => {
  try {
    const { session_id } = req.body || {};

    if (!session_id) {
      return res.status(400).json({ error: "session_id is required." });
    }

    const session = sessions.get(session_id);
    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    const human_summary = buildHumanSummary(session.data);

    return res.json({
      session_id,
      mode: session.mode,
      status: "stopped",
      message: "We’ve stopped the interview and summarized what we have so far.",
      data_json: session.data,
      human_summary
    });
  } catch (e) {
    console.error("/stop error:", e);
    return res.status(500).json({ error: "Failed to stop session." });
  }
});

// -------------------------
// ROOT
// -------------------------
app.get("/", (req, res) => {
  res.send("Sleep intake backend is running.");
});

// -------------------------
// START SERVER
// -------------------------
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
