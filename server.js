import express from "express";
import cors from "cors";
import { sessionStore } from "./sessionStore.js";
import { packetSchema } from "./packetSchema.js";

const app = express();
app.use(cors());
app.use(express.json());

// Start a new session
app.post("/start", (req, res) => {
  const sessionId = sessionStore.createSession();
  res.json({
    session_id: sessionId,
    message: "Session started. Begin answering questions."
  });
});

// Receive answers from frontend
app.post("/intake", (req, res) => {
  const { session_id, answer_text } = req.body;

  if (!session_id || !answer_text) {
    return res.status(400).json({ error: "Missing session_id or answer_text" });
  }

  const session = sessionStore.getSession(session_id);
  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  session.answers.push(answer_text);

  res.json({ message: "Answer received." });
});

// Stop session and receive full packet
app.post("/stop", (req, res) => {
  const packet = req.body;

  const validation = packetSchema.safeParse(packet);
  if (!validation.success) {
    return res.status(400).json({
      error: "Invalid packet format",
      details: validation.error.errors
    });
  }

  sessionStore.saveFinalPacket(packet.session_id, packet);

  res.json({
    message: "Session completed. Packet stored successfully.",
    human_summary: packet.human_summary || "Summary not provided."
  });
});

// Health check
app.get("/", (req, res) => {
  res.send("Sleep Intake Backend Running");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
