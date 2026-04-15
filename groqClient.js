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
You are helping fill out a sleep center intake packet.
Return ONLY valid JSON. No comments, no extra text.

You will be given:
- mode: "quick" or "full"
- current_question: the question being asked
- answer_text: the patient's answer
- collected_data: JSON of fields already collected

You must:
1. Update collected_data with any new information from answer_text.
2. Only touch fields that are clearly supported by the answer.
3. Never delete existing values unless the answer clearly corrects them.
4. Return JSON with this shape:

{
  "updated_data": { ...merged collected_data... },
  "notes": "short note about what you changed"
}

Use descriptive snake_case keys like:
- patient_full_name
- patient_date_of_birth
- patient_address
- primary_sleep_complaint
- sleep_habits_summary
- lifestyle_factors_summary
- medical_history_summary
- medications_list
- epworth_total_score
`;

  const userPrompt = `
mode: ${mode}
current_question: ${current_question}
answer_text: ${answer_text}
collected_data (JSON): ${JSON.stringify(collected_data || {}, null, 2)}
`;

  const completion = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.2,
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
