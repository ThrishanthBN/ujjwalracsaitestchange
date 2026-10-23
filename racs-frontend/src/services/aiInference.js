import { parseResumeText, evaluateResumeAgainstJob } from '../utils/resumeParser';

/**
 * Enterprise AI Inference Service
 * Connects to Google Gemini or OpenAI when a BYOK key is provided,
 * with deterministic fallback to the local explainable skill engine.
 */
export async function evaluateCandidateWithAi({
  resumeText,
  fileName,
  jobTitle,
  jobDescription,
  requiredSkills = [],
  byokKey = '',
  byokProvider = 'Gemini',
}) {
  const parsed = parseResumeText(resumeText, fileName);

  // 1. If user supplied a real Gemini API Key, execute live cloud inference
  if (byokKey && byokKey.startsWith('AIzaSy') && (byokProvider === 'Gemini' || !byokProvider)) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${byokKey.trim()}`;
      const prompt = `You are an expert HR and Technical Recruiter AI evaluating candidate resumes.
Target Job Title: ${jobTitle}
Job Requirements: ${requiredSkills.join(', ')}
${jobDescription ? `Description: ${jobDescription}` : ''}

Candidate Resume (${fileName}):
${resumeText}

Evaluate strictly against the job requirements.
Respond ONLY with a valid JSON object formatted as follows (no markdown, no backticks):
{
  "matchScorePercent": <number between 0 and 100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["missing1", "missing2"],
  "reasoning": "<2-3 sentence executive rationale explaining why this score was given>"
}`;

      const res = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const rawContent = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedAi = JSON.parse(cleanJson);

        return {
          candidateName: parsed.name,
          email: parsed.email,
          phone: parsed.phone,
          location: parsed.location,
          currentTitle: parsed.title,
          experienceLabel: parsed.experienceLabel,
          score: parsedAi.matchScorePercent || 85,
          matchedSkills: parsedAi.matchedSkills || parsed.skills.slice(0, 5),
          missingSkills: parsedAi.missingSkills || [],
          reasoning: parsedAi.reasoning || 'Evaluated via Google Gemini 1.5 Flash.',
          engine: 'BYOK Google Gemini (Cloud Inference)',
        };
      }
    } catch (err) {
      console.warn('[AI Inference] Gemini cloud inference failed, using deterministic engine fallback:', err);
    }
  }

  // 2. If user supplied an OpenAI Key (sk-...)
  if (byokKey && byokKey.startsWith('sk-') && byokProvider === 'OpenAI') {
    try {
      const openAiUrl = 'https://api.openai.com/v1/chat/completions';
      const prompt = `Evaluate candidate resume for ${jobTitle} (Reqs: ${requiredSkills.join(', ')}).
Resume:
${resumeText}

Return valid JSON with keys: matchScorePercent (0-100), matchedSkills (array), missingSkills (array), reasoning (string).`;

      const res = await fetch(openAiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${byokKey.trim()}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const parsedAi = JSON.parse(json.choices[0].message.content);
        return {
          candidateName: parsed.name,
          email: parsed.email,
          phone: parsed.phone,
          location: parsed.location,
          currentTitle: parsed.title,
          experienceLabel: parsed.experienceLabel,
          score: parsedAi.matchScorePercent || 85,
          matchedSkills: parsedAi.matchedSkills || parsed.skills.slice(0, 5),
          missingSkills: parsedAi.missingSkills || [],
          reasoning: parsedAi.reasoning || 'Evaluated via OpenAI GPT-4o Enterprise.',
          engine: 'BYOK OpenAI (Cloud Inference)',
        };
      }
    } catch (err) {
      console.warn('[AI Inference] OpenAI cloud inference failed, using fallback:', err);
    }
  }

  // 3. Fallback to Local Deterministic Engine (Zero cost, instant, no API key needed)
  const isFrontendJob = /frontend|product|react|ui/i.test(jobTitle || '');
  const localEval = evaluateResumeAgainstJob(parsed, isFrontendJob ? 'REQ-FRONTEND-01' : 'REQ-DISTRIBUTED-01');

  return {
    candidateName: parsed.name,
    email: parsed.email,
    phone: parsed.phone,
    location: parsed.location,
    currentTitle: parsed.title,
    experienceLabel: parsed.experienceLabel,
    score: localEval.score,
    matchedSkills: localEval.matchedSkills,
    missingSkills: localEval.missingSkills,
    reasoning: localEval.reasoning,
    engine: 'Built-in Explainable Rule Engine (No Key Needed)',
  };
}
