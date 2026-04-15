export const quickModeQuestions = [
  {
    id: "mode_intro",
    key: null,
    prompt:
      "Alright, we’ll keep this quick. I’ll just grab the main details for your sleep visit.",
    type: "info"
  },
  {
    id: "patient_full_name",
    key: "patient_full_name",
    prompt: "First up, what’s your full name so I can get your chart started?",
    type: "text"
  },
  {
    id: "patient_date_of_birth",
    key: "patient_date_of_birth",
    prompt: "What’s your date of birth?",
    type: "text"
  },
  {
    id: "patient_contact_information",
    key: "patient_contact_information",
    prompt:
      "What’s the best phone number and email to reach you about your sleep study?",
    type: "text"
  },
  {
    id: "primary_sleep_complaint",
    key: "primary_sleep_complaint",
    prompt:
      "Tell me in your own words what sleep problem brought you here today.",
    type: "text"
  },
  {
    id: "sleep_habits_summary",
    key: "sleep_habits_summary",
    prompt:
      "Walk me through your usual sleep schedule—bedtime, wake time, and how long it takes you to fall asleep.",
    type: "text"
  },
  {
    id: "lifestyle_factors_summary",
    key: "lifestyle_factors_summary",
    prompt:
      "How about caffeine, alcohol, and tobacco—what do you typically use in a day?",
    type: "text"
  },
  {
    id: "medical_history_summary",
    key: "medical_history_summary",
    prompt:
      "Give me a quick overview of your medical history—things like heart issues, blood pressure, diabetes, lung problems, or anything else important.",
    type: "text"
  },
  {
    id: "medications_list",
    key: "medications_list",
    prompt:
      "What medications are you taking right now, and what are they for?",
    type: "text"
  },
  {
    id: "epworth_total_score",
    key: "epworth_total_score",
    prompt:
      "Thinking about your daytime sleepiness, what would you say your Epworth score is, or just describe how sleepy you feel during the day?",
    type: "text"
  }
];

export const fullModeQuestions = [
  {
    id: "mode_intro",
    key: null,
    prompt:
      "We’ll go a bit deeper and walk through the full sleep packet together.",
    type: "info"
  },
  {
    id: "hipaa_consent_acknowledgment",
    key: "hipaa_consent_acknowledgment",
    prompt:
      "Have you reviewed and agreed to the HIPAA consents and authorizations for your sleep study?",
    type: "yes_no"
  },
  {
    id: "patient_full_name",
    key: "patient_full_name",
    prompt: "What’s your full name as it appears on your records?",
    type: "text"
  },
  {
    id: "patient_date_of_birth",
    key: "patient_date_of_birth",
    prompt: "What is your date of birth?",
    type: "text"
  },
  {
    id: "patient_address",
    key: "patient_address",
    prompt: "What is your full home address, including city, state, and ZIP?",
    type: "text"
  },
  {
    id: "patient_phone_numbers",
    key: "patient_phone_numbers",
    prompt:
      "What are your main phone numbers—home, cell, and work if you use them?",
    type: "text"
  },
  {
    id: "patient_email",
    key: "patient_email",
    prompt: "What email address do you prefer for communication?",
    type: "text"
  },
  {
    id: "emergency_contact",
    key: "emergency_contact",
    prompt:
      "Who should we list as your emergency contact, and what’s their phone number?",
    type: "text"
  },
  {
    id: "referring_physician",
    key: "referring_physician",
    prompt:
      "Who referred you for this sleep evaluation, and do you know their phone number?",
    type: "text"
  },
  {
    id: "primary_physician",
    key: "primary_physician",
    prompt:
      "Who is your primary care physician, and what’s their contact information if you know it?",
    type: "text"
  },
  {
    id: "primary_sleep_complaint",
    key: "primary_sleep_complaint",
    prompt:
      "Describe your main sleep problem—what’s been going on that made you seek help?",
    type: "text"
  },
  {
    id: "sleep_problem_onset",
    key: "sleep_problem_onset",
    prompt: "When did this sleep problem first start for you?",
    type: "text"
  },
  {
    id: "previous_sleep_studies_or_treatments",
    key: "previous_sleep_studies_or_treatments",
    prompt:
      "Have you had any previous sleep studies or treatments, like CPAP or medications?",
    type: "text"
  },
  {
    id: "additional_sleep_comments",
    key: "additional_sleep_comments",
    prompt:
      "Is there anything else about your sleep that you think is important to mention?",
    type: "text"
  },
  {
    id: "usual_bedtime_workdays",
    key: "usual_bedtime_workdays",
    prompt:
      "On work days, what time do you usually go to bed and what time do you usually wake up?",
    type: "text"
  },
  {
    id: "usual_bedtime_days_off",
    key: "usual_bedtime_days_off",
    prompt:
      "On days off, what time do you usually go to bed and wake up?",
    type: "text"
  },
  {
    id: "sleep_latency_and_awakenings",
    key: "sleep_latency_and_awakenings",
    prompt:
      "About how long does it take you to fall asleep, how many times do you wake up at night, and how long are you awake when that happens?",
    type: "text"
  },
  {
    id: "work_shift_type",
    key: "work_shift_type",
    prompt:
      "What kind of work schedule do you have—day shift, evening shift, night shift, or rotating?",
    type: "text"
  },
  {
    id: "caffeine_and_alcohol_use",
    key: "caffeine_and_alcohol_use",
    prompt:
      "How much coffee, tea, soda, and alcohol do you typically have in a day?",
    type: "text"
  },
  {
    id: "tobacco_use_details",
    key: "tobacco_use_details",
    prompt:
      "Do you use any tobacco products? If so, what type, how much per day, and for how many years?",
    type: "text"
  },
  {
    id: "home_oxygen_and_cpap_use",
    key: "home_oxygen_and_cpap_use",
    prompt:
      "Do you use home oxygen or CPAP/BiPAP at home, and if so, do you know the settings?",
    type: "text"
  },
  {
    id: "nasal_breathing_and_claustrophobia",
    key: "nasal_breathing_and_claustrophobia",
    prompt:
      "Are you able to breathe normally through your nose, and do you have any issues with claustrophobia?",
    type: "text"
  },
  {
    id: "neck_size_inches",
    key: "neck_size_inches",
    prompt: "Do you know your neck size in inches?",
    type: "text"
  },
  {
    id: "cardiac_respiratory_endocrine_history",
    key: "cardiac_respiratory_endocrine_history",
    prompt:
      "Have you ever been told you have heart disease, high blood pressure, stroke, diabetes, thyroid problems, lung disease, COPD, or asthma?",
    type: "text"
  },
  {
    id: "neurologic_mental_ent_history",
    key: "neurologic_mental_ent_history",
    prompt:
      "Any neurologic conditions, mental health conditions, sinus or ENT issues, or acid reflux?",
    type: "text"
  },
  {
    id: "other_medical_conditions",
    key: "other_medical_conditions",
    prompt:
      "Are there any other medical conditions you think we should know about?",
    type: "text"
  },
  {
    id: "family_history_summary",
    key: "family_history_summary",
    prompt:
      "Can you tell me about your parents’ and siblings’ health—any major conditions or sleep issues in the family?",
    type: "text"
  },
  {
    id: "surgical_history",
    key: "surgical_history",
    prompt:
      "Have you had any surgeries in the past? If so, what were they and when?",
    type: "text"
  },
  {
    id: "medications_list",
    key: "medications_list",
    prompt:
      "Please list your current medications, including the dose, how often you take them, and what they’re for.",
    type: "text"
  },
  {
    id: "sleep_symptoms_summary",
    key: "sleep_symptoms_summary",
    prompt:
      "Do you have symptoms like snoring, pauses in breathing, gasping, restless legs, vivid dreams, sleep paralysis, morning headaches, or daytime sleepiness?",
    type: "text"
  },
  {
    id: "general_review_of_systems_summary",
    key: "general_review_of_systems_summary",
    prompt:
      "Any other symptoms like fever, weight changes, anxiety or depression, chest pain, palpitations, cough, heartburn, frequent nighttime urination, joint pain, skin changes, memory issues, heat or cold intolerance, or bleeding or clotting problems?",
    type: "text"
  },
  {
    id: "epworth_details",
    key: "epworth_details",
    prompt:
      "Thinking about situations like reading, watching TV, riding in a car, or sitting quietly after lunch, how likely are you to doze off in those situations?",
    type: "text"
  },
  {
    id: "epworth_total_score",
    key: "epworth_total_score",
    prompt:
      "If you’ve ever been given an Epworth Sleepiness Scale, do you know your total score, or can you estimate how sleepy you feel overall during the day?",
    type: "text"
  }
];

export function getQuestionListForMode(mode) {
  if (mode === "full") return fullModeQuestions;
  return quickModeQuestions;
}
