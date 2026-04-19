import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function extractFieldsFromAnswer({
  mode,
  current_question,
  answer_text,
  collected_data
}) {
  const systemPrompt = `
You are an AI assistant helping fill out a sleep center intake packet.

You MUST return ONLY valid JSON with this structure:
{
  "updated_data": { ...merged collected_data... },
  "notes": "short note about what changed"
}

### FIELD MAPPING RULES (VERY IMPORTANT)

Match answers to fields based on the question:

1. If the question asks for the patient's **full name**:
   → updated_data.patient_full_name

2. If the question asks for **date of birth / DOB**:
   → updated_data.patient_date_of_birth

3. If the question asks for **phone number and/or email**:
   → updated_data.patient_contact_phone
   → updated_data.patient_contact_email

4. If the question asks for **address**:
   → updated_data.patient_address

5. If the question asks for **primary sleep complaint**:
   → updated_data.primary_sleep_complaint

6. If the question asks about **sleep habits**:
   → updated_data.sleep_habits_summary

7. If the question asks about **lifestyle factors** (caffeine, alcohol, smoking, work schedule):
   → updated_data.lifestyle_factors_summary

8. If the question asks about **medical history**:
   → updated_data.medical_history_summary

9. If the question asks about **medications**:
   → updated_data.medications_list

10. If the question asks for **Epworth Sleepiness Scale**:
   → updated_data.epworth_total_score

### RULES FOR UPDATING DATA
- Only update fields clearly supported by the answer.
- Never delete existing values unless the answer corrects them.
- Always merge with collected_data.
- If the answer contains multiple items (e.g., phone + email), fill both fields.
- If the answer does not match any field, return collected_data unchanged.

Return ONLY JSON. No explanations.
`;

  const userPrompt = `
mode: ${mode}
current_question: ${current_question}
answer_text: ${answer_text}

collected_data (JSON):
${JSON.stringify(collected_data || {}, null, 2)}
`;

  const completion = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.1,
    max_tokens: 512
  });

  const content = completion.choices[0]?.message?.content || "{}";

  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch (e) {
    console.error("Failed to parse Groq JSON:", e, content);
    return {
      updated_data: collected_data || {},
      notes: "Groq response could not be parsed; returning previous data."
    };
  }
}
