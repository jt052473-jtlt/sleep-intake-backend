// packetSchema.js
// Canonical schema for the Sleep Intake packet

const packetSchema = {
  // Meta / mode
  mode: { type: "string", required: true }, // "quick" or "full"

  // HIPAA / consents
  hipaa_consent_acknowledgment: { type: "string", required: false },

  // Patient demographics
  patient_full_name: { type: "string", required: true },
  patient_date_of_birth: { type: "string", required: true }, // accepts any format; normalized in logic layer
  patient_address: { type: "string", required: false },
  patient_phone_numbers: { type: "string", required: false }, // home / cell / work
  patient_email: { type: "string", required: false },
  emergency_contact: { type: "string", required: false },

  // Physicians
  referring_physician: { type: "string", required: false },
  primary_physician: { type: "string", required: false },

  // Sleep history
  primary_sleep_complaint: { type: "string", required: true },
  sleep_problem_onset: { type: "string", required: false },
  previous_sleep_studies_or_treatments: { type: "string", required: false },
  additional_sleep_comments: { type: "string", required: false },

  // Sleep habits
  sleep_habits_summary: { type: "string", required: false }, // quick mode summary
  usual_bedtime_workdays: { type: "string", required: false },
  usual_bedtime_days_off: { type: "string", required: false },
  sleep_latency_and_awakenings: { type: "string", required: false },
  work_shift_type: { type: "string", required: false },

  // Lifestyle
  lifestyle_factors_summary: { type: "string", required: false }, // quick mode summary
  caffeine_and_alcohol_use: { type: "string", required: false },
  tobacco_use_details: { type: "string", required: false },
  home_oxygen_and_cpap_use: { type: "string", required: false },
  nasal_breathing_and_claustrophobia: { type: "string", required: false },
  neck_size_inches: { type: "string", required: false },

  // Medical history
  medical_history_summary: { type: "string", required: false }, // quick mode summary
  cardiac_respiratory_endocrine_history: { type: "string", required: false },
  neurologic_mental_ent_history: { type: "string", required: false },
  other_medical_conditions: { type: "string", required: false },
  family_history_summary: { type: "string", required: false },
  surgical_history: { type: "string", required: false },

  // Medications
  medications_list: { type: "string", required: false },

  // Symptoms / ROS
  sleep_symptoms_summary: { type: "string", required: false },
  general_review_of_systems_summary: { type: "string", required: false },

  // Epworth
  epworth_details: { type: "string", required: false },
  epworth_total_score: { type: "string", required: false }
};

// Optional: helper to validate a packet object against this schema
function validatePacket(packet) {
  const errors = [];

  for (const [field, rules] of Object.entries(packetSchema)) {
    const value = packet[field];

    if (rules.required && (value === undefined || value === null || value === "")) {
      errors.push(`Missing required field: ${field}`);
      continue;
    }

    if (value !== undefined && value !== null && typeof value !== rules.type) {
      errors.push(`Invalid type for field ${field}: expected ${rules.type}, got ${typeof value}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  packetSchema,
  validatePacket
};
