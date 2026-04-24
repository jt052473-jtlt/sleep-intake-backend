import { z } from "zod";

// Core packet schema for sleep intake + chat
export const packetSchema = z
  .object({
    // Required
    session_id: z.string(),

    // Chat message (what the user just said)
    user_message: z.string().optional(),

    // Patient info
    patient_full_name: z.string().optional(),
    patient_date_of_birth: z.string().optional(),
    patient_contact_phone: z.string().optional(),
    patient_contact_email: z.string().optional(),

    // Sleep details
    sleep_hours: z.string().optional(),
    sleep_quality: z.string().optional(),
    snoring_frequency: z.string().optional(),
    apnea_symptoms: z.string().optional(),

    // Medical history
    medical_conditions: z.string().optional(),
    medications: z.string().optional(),
    allergies: z.string().optional(),

    // Lifestyle
    caffeine_intake: z.string().optional(),
    alcohol_use: z.string().optional(),
    smoking_status: z.string().optional(),

    // Summary
    human_summary: z.string().optional()
  })
  // Allow extra fields without throwing (future‑proof)
  .passthrough();
