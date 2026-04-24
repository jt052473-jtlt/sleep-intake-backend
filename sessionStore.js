// A clean, safe, modern session store for chat + intake

export const sessionStore = {
  sessions: {},

  // Create a new session with a stable structure
  createSession(id) {
    const sessionId = id || Math.random().toString(36).substring(2, 10);

    this.sessions[sessionId] = {
      messages: [],          // stores chat messages
      human_summary: "",     // running summary
      packet: {},            // stores structured intake fields
      finalPacket: null
    };

    return sessionId;
  },

  // Retrieve a session safely
  getSession(id) {
    return this.sessions[id] || null;
  },

  // Update session with new user message + packet fields
  updateSession(id, data = {}) {
    if (!this.sessions[id]) {
      this.createSession(id);
    }

    const session = this.sessions[id];

    // Store chat message if provided
    if (data.user_message) {
      session.messages.push({
        role: "user",
        content: data.user_message,
        timestamp: Date.now()
      });
    }

    // Update human summary if provided
    if (data.human_summary) {
      session.human_summary = data.human_summary;
    }

    // Merge packet fields
    session.packet = {
      ...session.packet,
      ...data
    };
  },

  // Save final packet at end of interview
  saveFinalPacket(id, packet) {
    if (!this.sessions[id]) return;
    this.sessions[id].finalPacket = packet;
  },

  // Optional: delete session when done
  deleteSession(id) {
    delete this.sessions[id];
  }
};
