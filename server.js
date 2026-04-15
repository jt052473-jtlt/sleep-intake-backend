import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { extractFieldsFromAnswer } from "./groqClient.js";
import {
  getQuestionListForMode
} from "./interviewFlow.js";
import { initialPacketData, buildHumanSummary } from "./packetSchema.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory session store (for demo). In production, use Redis/DB.
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

// Start: choose mode
app.post("/start", (req, res) => {
  try {
    const { mode_choice } = req.body || {};

    let mode = "quick";
    if (mode_choice) {
      const m = String(mode_choice).toLowerCase();
      if (m.includes("full")) mode = "full";
      else mode = "quick";
    }

    const session = createNewSession(mode);
    const firstQuestion = getCurrentQuestion(session);

    return res.json({
      session_id: session.session_id,
      mode: session.mode,
      message:
        "Welcome to the sleep intake assistant. We’ll walk through your packet together.",
      next_question: firstQuestion
        ? {
            id: firstQuestion.id,
            prompt: firstQuestion.prompt
          }
        : null
    });
  } catch (e) {
    console.error("/start error:", e);
    return res.status(500).json({ error: "Failed to start session." });
  }
});

// Intake: answer current question
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

    // Stop command handling
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

    // If this is an info-only question, just move on
    if (!currentQuestion.key) {
      session.current_index += 1;
    } else {
      // Call Groq to update fields
      const groqResult = await extractFieldsFromAnswer({
        mode: session.mode,
        current_question: currentQuestion.prompt,
        answer_text,
        collected_data: session.data
      });

      const updated = groqResult?.updated_data || session.data;
      session.data = { ...session.data, ...updated };
      session.current_index += 1;
    }

    const nextQuestion = getCurrentQuestion(session);

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

// Stop explicitly
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

app.get("/", (req, res) => {
  res.send("Sleep intake backend is running.");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
