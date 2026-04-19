export const sessionStore = {
  sessions: {},

  createSession() {
    const id = Math.random().toString(36).substring(2, 10);
    this.sessions[id] = {
      answers: [],
      finalPacket: null
    };
    return id;
  },

  getSession(id) {
    return this.sessions[id] || null;
  },

  saveFinalPacket(id, packet) {
    if (!this.sessions[id]) return;
    this.sessions[id].finalPacket = packet;
  }
};
