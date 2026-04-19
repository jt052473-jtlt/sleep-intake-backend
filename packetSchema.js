export const initialPacketData = {
  // Demographics
  patient_full_name: null,
  patient_date_of_birth: null,
  patient_address: null,

  // These match Groq output
  patient_contact_phone: null,
  patient_contact_email: null,

  emergency_contact: null,
  referring_physician: null,
  primary_physician: null,

  // Consents
  hipaa_consent_acknowledgment: null,

  // Sleep history
  primary_sleep_complaint: null,
  sleep_problem_onset: null,
  previous_sleep_studies_or_treatments: null,
  additional_sleep_comments: null,

  // Sleep habits
  sleep_habits_summary: null,
  usual_bedtime_workdays: null,
  usual_bedtime_days_off: null,
  sleep_latency_and_awakenings: null,
  work_shift_type: null,

  // Lifestyle
  lifestyle_factors_summary: null,
  caffeine_and_alcohol_use: null,
  tobacco_use_details: null,
  home_oxygen_and_cpap_use: null,
  nasal_breathing_and_claustrophobia: null,
  neck_size_inches: null,

  // Medical history
  medical_history_summary: null,
  cardiac_respiratory_endocrine_history: null,
  neurologic_mental_ent_history: null,
  other_medical_conditions: null,
  family_history_summary: null,
  surgical_history: null,

  // Medications
  medications_list: null,

  // Symptoms / ROS
  sleep_symptoms_summary: null,
  general_review_of_systems_summary: null,

  // Epworth
  epworth_details: null,
  epworth_total_score: null
};

export function buildHumanSummary(data) {
  const d = data || {};
  return `
Sleep Intake Summary

Patient:
- Name: ${d.patient_full_name || "N/A"}
- Date of Birth: ${d.patient_date_of_birth || "N/A"}
- Address: ${d.patient_address || "N/A"}
- Phone(s): ${d.patient_contact_phone || "N/A"}
- Email: ${d.patient_contact_email || "N/A"}
- Emergency Contact: ${d.emergency_contact || "N/A"}

Physicians:
- Referring Physician: ${d.referring_physician || "N/A"}
- Primary Physician: ${d.primary_physician || "N/A"}

Sleep History:
- Primary Sleep Complaint: ${d.primary_sleep_complaint || "N/A"}
- Onset of Problem: ${d.sleep_problem_onset || "N/A"}
- Previous Sleep Studies/Treatments: ${d.previous_sleep_studies_or_treatments || "N/A"}
- Additional Comments: ${d.additional_sleep_comments || "N/A"}

Sleep Habits:
- Sleep Habits Summary: ${d.sleep_habits_summary || "N/A"}
- Workday Schedule: ${d.usual_bedtime_workdays || "N/A"}
- Days Off Schedule: ${d.usual_bedtime_days_off || "N/A"}
- Sleep Latency/Awakenings: ${d.sleep_latency_and_awakenings || "N/A"}
- Work Shift Type: ${d.work_shift_type || "N/A"}

Lifestyle:
- Lifestyle Summary: ${d.lifestyle_factors_summary || "N/A"}
- Caffeine/Alcohol Use: ${d.caffeine_and_alcohol_use || "N/A"}
- Tobacco Use: ${d.tobacco_use_details || "N/A"}
- Home Oxygen/CPAP Use: ${d.home_oxygen_and_cpap_use || "N/A"}
- Nasal Breathing/Claustrophobia: ${d.nasal_breathing_and_claustrophobia || "N/A"}
- Neck Size (inches): ${d.neck_size_inches || "N/A"}

Medical History:
- Overall Medical History Summary: ${d.medical_history_summary || "N/A"}
- Cardiac/Respiratory/Endocrine: ${d.cardiac_respiratory_endocrine_history || "N/A"}
- Neurologic/Mental/ENT: ${d.neurologic_mental_ent_history || "N/A"}
- Other Medical Conditions: ${d.other_medical_conditions || "N/A"}
- Family History: ${d.family_history_summary || "N/A"}
- Surgical History: ${d.surgical_history || "N/A"}

Medications:
- Medications List: ${d.medications_list || "N/A"}

Symptoms / Review of Systems:
- Sleep Symptoms: ${d.sleep_symptoms_summary || "N/A"}
- General Review of Systems: ${d.general_review_of_systems_summary || "N/A"}

Epworth:
- Epworth Details: ${d.epworth_details || "N/A"}
- Epworth Total Score: ${d.epworth_total_score || "N/A"}

HIPAA / Consents:
- HIPAA Consent Acknowledgment: ${d.hipaa_consent_acknowledgment || "N/A"}
`.trim();
}
