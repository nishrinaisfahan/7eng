const audioCache = new Map<string, string>();
let currentAudio: HTMLAudioElement | null = null;

export function stopSpeaking(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function speakWithBrowserSpeech(text: string, slow: boolean): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = slow ? 0.72 : 0.96;
    utterance.pitch = 1.04;

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Natural") ||
            v.name.includes("Samantha") ||
            v.name.includes("Google US English"))
      ) || voices.find((v) => v.lang.startsWith("en"));

    if (preferred) {
      utterance.voice = preferred;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

function playBase64Wav(base64: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(`data:audio/wav;base64,${base64}`);
    currentAudio = audio;
    audio.onended = () => {
      if (currentAudio === audio) {
        currentAudio = null;
      }
      resolve();
    };
    audio.onerror = () => {
      if (currentAudio === audio) {
        currentAudio = null;
      }
      reject(new Error("Audio playback error"));
    };
    audio.play().catch((err) => reject(err));
  });
}

export async function speakEnglish(
  text: string,
  options?: { slow?: boolean; preferStudioVoice?: boolean }
): Promise<"studio" | "browser"> {
  const cleanText = text.trim();
  if (!cleanText) return "browser";

  const slow = Boolean(options?.slow);
  const preferStudio = options?.preferStudioVoice ?? true;
  stopSpeaking();

  if (preferStudio) {
    const cacheKey = `${slow ? "slow" : "normal"}:${cleanText}`;
    const cached = audioCache.get(cacheKey);
    if (cached) {
      try {
        await playBase64Wav(cached);
        return "studio";
      } catch {
        // Fallback to browser synthesis
      }
    }

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText, slow }),
      });
      if (response.ok) {
        const data = (await response.json()) as { audioBase64?: string };
        if (data.audioBase64) {
          audioCache.set(cacheKey, data.audioBase64);
          await playBase64Wav(data.audioBase64);
          return "studio";
        }
      }
    } catch {
      // Fallback gracefully to browser SpeechSynthesis
    }
  }

  await speakWithBrowserSpeech(cleanText, slow);
  return "browser";
}
