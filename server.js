import express from "express";
import cors from "cors";
import crypto from "crypto";
import { sessionStore } from "./sessionStore.js";
import { packetSchema } from "./packetSchema.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
// INTAKE ROUTE (existing logic)
// ===============================
app.post("/intake", (req, res) => {
  try {
    const { session_id, user_message } = req.body;

    if (!session_id || !user_message) {
      return res.status(400).json({ error: "Missing session_id or user_message." });
    }

    const session = sessionStore.getSession(session_id);
    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    const packet = packetSchema.parse({
      session_id,
      user_message,
      human_summary: session.human_summary || "Summary not provided."
    });

    session.human_summary = packet.human_summary;

    return res.json({
      reply: `Received: ${user_message}`,
      structured_output: packet
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
// UNIVERSAL CHAT ENDPOINT
// ===============================
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "No message received." });
    }

    // Create or reuse session
    let sessionId = req.headers["x-session-id"];
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStore.createSession(sessionId);
    }

    const session = sessionStore.getSession(sessionId);

    // Build packet using schema
    const packet = packetSchema.parse({
      session_id: sessionId,
      user_message: userMessage,
      human_summary: session.human_summary || "Summary not provided."
    });

    // Update session summary
    session.human_summary = packet.human_summary;

    // Simple assistant reply
    const reply = `You said: ${userMessage}. I’ve updated your session.`;

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
