import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();
app.use(express.json({ limit: "2mb" }));

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

type ChatTurn = {
  role: "user" | "assistant";
  text: string;
};

type ChatRequestBody = {
  topicId?: string;
  topicTitle?: string;
  topicGoal?: string;
  history?: ChatTurn[];
  message?: string;
};

app.post("/api/chat", async (req, res) => {
  const ai = getAiClient();
  if (!ai) {
    res.status(503).json({
      error: "Gemini API key is not configured yet in Settings > Secrets.",
    });
    return;
  }

  const body = (req.body ?? {}) as ChatRequestBody;
  const userMessage = typeof body.message === "string" ? body.message.trim() : "";
  if (!userMessage) {
    res.status(400).json({ error: "Please write a message first." });
    return;
  }

  const topicTitle = body.topicTitle || "Everyday English";
  const topicGoal =
    body.topicGoal ||
    "Practice introducing yourself, talking about daily routines, hobbies, family, people, and favorite meals.";
  const history = Array.isArray(body.history) ? body.history.slice(-10) : [];

  const transcript = history
    .map((item) => `${item.role === "user" ? "Student" : "Pip"}: ${item.text}`)
    .join("\n");

  const systemInstruction = [
    "You are Pip, a warm, cheerful, and encouraging English study buddy for Grade 7 students (ages 12 to 13).",
    `Current conversation topic: ${topicTitle}. Learning focus: ${topicGoal}.`,
    "Keep your English clear, natural, and beginner-to-intermediate friendly (CEFR A1-A2).",
    "Keep replies concise (2 to 3 short sentences) and always end with one friendly follow-up question to keep the student chatting.",
    "If the student makes a small grammar, pronoun, or word-order mistake, still celebrate their effort first, then share one kind, short suggestion in gentleTip and a natural model sentence in tipExample.",
    "If the student's English is already clear and accurate, set gentleTip to an empty string and praise one good phrase or detail.",
    "Also provide 3 short, natural suggestedReplies (under 10 words each) that the student can click or adapt to answer your follow-up question.",
  ].join(" ");

  const prompt = transcript
    ? `Previous conversation:\n${transcript}\n\nStudent's new message: ${userMessage}`
    : `Student's first message: ${userMessage}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-4-hydrogen",
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: "Pip's warm conversational reply ending with one simple question.",
            },
            gentleTip: {
              type: Type.STRING,
              description:
                "Optional short friendly grammar or vocabulary tip for Grade 7, or empty string if none needed.",
            },
            tipExample: {
              type: Type.STRING,
              description:
                "Optional example sentence demonstrating the tip, or empty string if gentleTip is empty.",
            },
            suggestedReplies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 short sample answers the Grade 7 student could say next.",
            },
          },
          required: ["reply", "gentleTip", "tipExample", "suggestedReplies"],
        },
      },
    });

    const rawText = (response.text ?? "{}").trim();
    const parsed = JSON.parse(rawText) as {
      reply?: string;
      gentleTip?: string;
      tipExample?: string;
      suggestedReplies?: string[];
    };

    res.json({
      reply:
        parsed.reply ||
        "That sounds wonderful! Can you tell me a little more about it?",
      gentleTip: parsed.gentleTip || "",
      tipExample: parsed.tipExample || "",
      suggestedReplies: Array.isArray(parsed.suggestedReplies)
        ? parsed.suggestedReplies.slice(0, 3)
        : ["Yes, I really like it!", "Let me tell you more.", "What about you?"],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate reply.";
    res.status(500).json({ error: message });
  }
});

app.post("/api/tts", async (req, res) => {
  const ai = getAiClient();
  if (!ai) {
    res.status(503).json({
      error: "Gemini API key is not configured.",
    });
    return;
  }

  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  const slow = Boolean(req.body?.slow);

  if (!text || text.length > 500) {
    res.status(400).json({ error: "Provide text between 1 and 500 characters." });
    return;
  }

  try {
    const style = slow
      ? "Warm, friendly English teacher speaking slowly and clearly for a middle school student"
      : "Warm, cheerful, clear English teacher speaking at a natural pace for a middle school student";

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash-lite-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text,
              speechMetadata: { style },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      res.status(502).json({ error: "No audio returned by TTS model." });
      return;
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: "audio/wav",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Audio generation failed.";
    res.status(500).json({ error: message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("/{*path}", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SunnyEnglish server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
