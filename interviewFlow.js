// interviewFlow.js
// Handles question flow, answer saving, and DOB normalization

import { quickModeQuestions, fullModeQuestions } from "./interviewQuestions.js";

// Normalize ANY date format into MM/DD/YYYY if possible
function normalizeDOB(input) {
  try {
    const date = new Date(input);
    if (isNaN(date.getTime())) {
      return input; // keep original if parsing fails
    }

    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${mm}/${dd}/${yyyy}`;
  } catch {
    return input;
  }
}

// Save answers using backend schema keys
export function saveAnswer(key, value, packetData) {
  if (!key) return;

  if (key === "patient_date_of_birth") {
    value = normalizeDOB(value);
  }

  packetData[key] = value;
}

// Get the correct question list based on mode
export function getQuestionsForMode(mode) {
  return mode === "full" ? fullModeQuestions : quickModeQuestions;
}

// Main flow controller
export class InterviewFlow {
  constructor(mode = "quick") {
    this.mode = mode;
    this.questions = getQuestionsForMode(mode);
    this.currentIndex = 0;

    // Initialize packet data with mode included
    this.packetData = { mode };
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex] || null;
  }

  answerCurrentQuestion(value) {
    const question = this.getCurrentQuestion();
    if (question && question.key) {
      saveAnswer(question.key, value, this.packetData);
    }
    this.currentIndex++;
  }

  isFinished() {
    return this.currentIndex >= this.questions.length;
  }

  getPacket() {
    return this.packetData;
  }
}
