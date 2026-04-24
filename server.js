import express from "express";
import cors from "cors";
import crypto from "crypto";
import { sessionStore } from "./sessionStore.js";
import { packetSchema } from "./packetSchema.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Utility: create or get session
function ensureSession(sessionIdFromClient) {
  let sessionId = sessionIdFromClient;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStore.createSession(sessionId);
  } else {
    const existing = sessionStore.getSession(sessionId);
    if (!existing) {
      sessionStore.createSession(sessionId);
    }
  }

  return sessionId;
}

// Utility: build packet + update session
function buildAndUpdatePacket(sessionId, userMessage, extraFields = {}) {
  const session = sessionStore.getSession(sessionId) || { human_summary: "", packet: {} };

  const packetInput = {
    session_id: sessionId,
    user_message: userMessage,
    human_summary: session.human_summary || "Summary not provided.",
    ...session.packet,
    ...extraFields
  };

  const packet = packetSchema.parse(packetInput);

  sessionStore.updateSession(sessionId, packet);

  return packet;
}

// Utility: simple intake-aware reply generator
function generateReply(packet) {
  // Ask for name
  if (!packet.patient_full_name) {
    return "Thanks for sharing. To get started, can you tell me your full name?";
  }

  // Ask for sleep hours
  if (!packet.sleep_hours) {
    return `Nice to meet you, ${packet.patient_full_name}. On average, how many hours do you sleep per night?`;
  }

  // Ask for sleep quality
  if (!packet.sleep_quality) {
    return "How would you rate your overall sleep quality? For example: poor, fair, good, or excellent.";
  }

  // Ask about snoring
  if (!packet.snoring_frequency) {
    return "Do you snore, and if so, how often would you say it happens?";
  }

  // Ask about apnea symptoms
  if (!packet.apnea_symptoms) {
    return "Have you or anyone else noticed pauses in your breathing, gasping, or choking during sleep?";
  }

  // Ask about medical conditions
  if (!packet.medical_conditions) {
    return "Do you have any medical conditions that might affect your sleep, such as high blood pressure, heart disease, or mood disorders?";
  }

  // Ask about medications
  if (!packet.medications) {
    return "Are you currently taking any medications, including over-the-counter or sleep aids?";
  }

  // Ask about caffeine
  if (!packet.caffeine_intake) {
    return "How much caffeine do you typically consume in a day? For example: coffee, tea, soda, or energy drinks.";
  }

  // Ask about alcohol
  if (!packet.alcohol_use) {
    return "How often do you drink alcohol, and about how much when you do?";
  }

  // Ask about smoking
  if (!packet.smoking_status) {
    return "Do you currently smoke or use nicotine products?";
  }

  // If we have most key fields, give a summary-style response
  return "Thank you. I’ve captured a solid picture of your sleep and health history. You can share anything else you feel is important, or say you’re done.";
}

// ===============================
// START SESSION
// ===============================
app.post("/start", (req, res) => {
  try {
    const sessionId = crypto.randomUUID();
    sessionStore.createSession(sessionId);

    return res.json({
      session_id: sessionId,
      message: "Session started successfully."
    });
  } catch (err) {
    console.error("START ERROR:", err);
    return res.status(500).json({ error: "Failed to start session." });
  }
});

// ===============================
// INTAKE ROUTE (structured step usage)
// ===============================
app.post("/intake", (req, res) => {
  try {
    const { session_id, user_message, ...extraFields } = req.body;

    if (!session_id || !user_message) {
      return res.status(400).json({ error: "Missing session_id or user_message." });
    }

    const ensuredSessionId = ensureSession(session_id);
    const packet = buildAndUpdatePacket(ensuredSessionId, user_message, extraFields);
    const reply = generateReply(packet);

    return res.json({
      reply,
      structured_output: packet,
      session_id: ensuredSessionId
    });
  } catch (err) {
    console.error("INTAKE ERROR:", err);
    return res.status(500).json({ error: "Failed to process intake." });
  }
});

// ===============================
// STOP SESSION
// ===============================
app.post("/stop", (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: "Missing session_id." });
    }

    const session = sessionStore.getSession(session_id);
    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    sessionStore.saveFinalPacket(session_id, session.packet);
    sessionStore.deleteSession(session_id);

    return res.json({
      message: "Session ended successfully."
    });
  } catch (err) {
    console.error("STOP ERROR:", err);
    return res.status(500).json({ error: "Failed to stop session." });
  }
});

// ===============================
// UNIVERSAL CHAT ENDPOINT (advanced)
// ===============================
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const clientSessionId = req.body.session_id || req.headers["x-session-id"];

    if (!userMessage) {
      return res.status(400).json({ reply: "No message received." });
    }

    const sessionId = ensureSession(clientSessionId);
    const packet = buildAndUpdatePacket(sessionId, userMessage);
    const reply = generateReply(packet);

    return res.json({
      reply,
      structured_output: packet,
      session_id: sessionId
    });
  } catch (err) {
    console.error("CHAT ROUTE ERROR:", err);
    return res.status(500).json({ reply: "Server error in /chat route." });
  }
});

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.send("Sleep Intake Backend Running");
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
