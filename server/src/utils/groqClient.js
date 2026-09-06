const axios = require('axios');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Groq has repeatedly retired or re-tiered models with little notice
// (llama-3.1-8b-instant and llama-3.3-70b-versatile both became
// Enterprise-only / deprecated in mid-2026). Rather than hard-failing when
// the primary model disappears, we try a short list in order and fall back
// automatically. Check https://console.groq.com/docs/models if all of these
// ever stop working, and update this list.
const MODEL_CANDIDATES = ['openai/gpt-oss-20b', 'openai/gpt-oss-120b', 'qwen/qwen3-32b'];

function getApiKey() {
  if (!process.env.GROQ_API_KEY) {
    const err = new Error('AI features are not configured. Set GROQ_API_KEY in .env');
    err.statusCode = 500;
    throw err;
  }
  return process.env.GROQ_API_KEY;
}

async function callGroq(model, messages, { jsonMode = false, maxTokens = 900 } = {}) {
  const { data } = await axios.post(
    GROQ_URL,
    {
      model,
      messages,
      temperature: 0.6,
      max_tokens: maxTokens,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
    },
    {
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }
  );
  return data.choices?.[0]?.message?.content;
}

/**
 * Runs a chat completion across the model fallback list, moving to the next
 * candidate only when a model is unavailable (not for other error types like
 * bad key, rate limit, or network failure — those should surface as-is).
 */
async function runWithFallback(messages, opts) {
  let lastError;
  for (const model of MODEL_CANDIDATES) {
    try {
      const raw = await callGroq(model, messages, opts);
      if (raw) return raw;
    } catch (err) {
      const code = err.response?.data?.error?.code;
      lastError = err;
      if (code !== 'model_not_found' && err.response?.status !== 404) {
        throw err;
      }
    }
  }
  throw lastError || new Error('Groq returned an empty response from all candidate models');
}

/**
 * Generates a plain-language explanation and 3 multiple-choice practice
 * questions for a lesson, using only its title/module/course context (no
 * video transcript needed — this is meant to work as a study aid alongside
 * or instead of the video).
 */
async function generateLessonContent({ courseTitle, moduleTitle, lessonTitle, level }) {
  const systemPrompt = `You are a friendly coding/tutoring instructor writing study material for an online course platform called STCA.
Respond with ONLY valid JSON, no markdown fences, matching exactly this shape:
{
  "explanation": "a clear, encouraging, 150-250 word explanation of the lesson topic, written for a ${level || 'beginner'} student",
  "exercises": [
    {
      "question": "a practice question testing understanding of the lesson",
      "options": ["option A", "option B", "option C", "option D"],
      "correctIndex": 0,
      "explanation": "one sentence on why that answer is correct"
    }
  ]
}
Include exactly 3 items in "exercises". Keep options concise. correctIndex is 0-based.`;

  const userPrompt = `Course: ${courseTitle}\nModule: ${moduleTitle}\nLesson: ${lessonTitle}`;

  const raw = await runWithFallback(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    { jsonMode: true, maxTokens: 900 }
  );

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error('Could not parse AI response as JSON');
  }

  if (!parsed.explanation || !Array.isArray(parsed.exercises)) {
    throw new Error('AI response was missing expected fields');
  }

  return parsed;
}

const CHAT_SYSTEM_PROMPT = `You are the friendly AI assistant on the website of Sol Tutoring And Coding Academy (STCA), a coding and academic tutoring business based in Addis Ababa, Ethiopia, founded by Solomon Ashagre.

What STCA offers:
- Coding courses: Python, Web Development (HTML/CSS/JS), Scratch Programming, Digital Literacy
- Academic tutoring: Mathematics (grades 5-12), Exam Preparation
- Both online and offline (in-person, Addis Ababa) formats
- 1-on-1 personalized tutoring available
- Enrollment happens on this website: browse Courses, click Enroll Now, pay via Chapa (Telebirr, CBE Birr, HelloCash, or card), then the course appears on the student's dashboard immediately

How to reach a human:
- Telegram: @Sol_Ethio_Coder (fastest)
- Email: solash5156@gmail.com
- Phone: +251 901 436 358

Rules:
- Keep answers short and warm — 2 to 4 sentences typically.
- Never invent specific prices, schedules, tutor names, or guarantees you don't actually have information about — instead direct the visitor to Telegram or email for exact details.
- If asked something unrelated to STCA/coding/tutoring, answer briefly if harmless, otherwise politely redirect to what STCA can help with.
- You are not able to enroll someone or process payment yourself — direct them to the Courses page or their account.`;

/**
 * Stateless chat reply for the homepage visitor chatbot. The frontend sends
 * the full conversation history each call; nothing is stored server-side.
 */
async function chatReply(history) {
  const messages = [{ role: 'system', content: CHAT_SYSTEM_PROMPT }, ...history];
  const raw = await runWithFallback(messages, { jsonMode: false, maxTokens: 300 });
  if (!raw) throw new Error('Groq returned an empty response');
  return raw;
}

module.exports = { generateLessonContent, chatReply };
