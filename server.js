import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// simple in‑memory session store
const sessions = {};

app.post("/api/chat", async (req, res) => {
  try {
    const { session_id, user_message } = req.body;

    if (!session_id || !user_message) {
      return res.status(400).json({ error: "Missing session_id or user_message" });
    }

    // init session if needed
    if (!sessions[session_id]) {
      sessions[session_id] = [];
    }

    // store user message
    sessions[session_id].push({ role: "user", content: user_message });

    // basic reply for now (can swap to AI later)
    const reply = `You said: "${user_message}". I am processing your sleep intake.`;

    // store assistant reply
    sessions[session_id].push({ role: "assistant", content: reply });

    return res.json({
      reply,
      session: sessions[session_id]
    });
  } catch (err) {
    console.error("Backend error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
