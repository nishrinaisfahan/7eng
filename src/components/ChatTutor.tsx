import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Send, Volume2 } from "lucide-react";
import { CHAT_TOPICS, type ChatTopic } from "../data/curriculum";
import { speakEnglish } from "../utils/audio";

type MessageItem = {
  id: string;
  role: "user" | "assistant";
  text: string;
  gentleTip?: string;
  tipExample?: string;
};

type ChatTutorProps = {
  onRecordChatTurn: (topicTitle: string) => void;
};

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

export const ChatTutor: React.FC<ChatTutorProps> = ({ onRecordChatTurn }) => {
  const [activeTopic, setActiveTopic] = useState<ChatTopic>(CHAT_TOPICS[0]);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "opener-0",
      role: "assistant",
      text: CHAT_TOPICS[0].opener,
    },
  ]);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>(
    CHAT_TOPICS[0].starterReplies
  );
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [listeningMic, setListeningMic] = useState(false);

  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const supportsSpeechInput =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSelectTopic = (topic: ChatTopic) => {
    setActiveTopic(topic);
    setMessages([
      {
        id: `opener-${topic.id}-${Date.now()}`,
        role: "assistant",
        text: topic.opener,
      },
    ]);
    setSuggestedReplies(topic.starterReplies);
    setErrorMsg("");
  };

  const sendMessage = async (textToSend: string) => {
    const clean = textToSend.trim();
    if (!clean || sending) return;

    setErrorMsg("");
    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      text: clean,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: activeTopic.id,
          topicTitle: activeTopic.title,
          topicGoal: activeTopic.goal,
          history: nextMessages.map((m) => ({ role: m.role, text: m.text })),
          message: clean,
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        gentleTip?: string;
        tipExample?: string;
        suggestedReplies?: string[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error || "Unable to reach conversation tutor.");
      }

      const replyText =
        data.reply ||
        "Great job sharing! Tell me one more detail about that.";
      const botMsg: MessageItem = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        text: replyText,
        gentleTip: data.gentleTip || "",
        tipExample: data.tipExample || "",
      };

      setMessages((prev) => [...prev, botMsg]);
      if (Array.isArray(data.suggestedReplies) && data.suggestedReplies.length > 0) {
        setSuggestedReplies(data.suggestedReplies);
      }
      onRecordChatTurn(activeTopic.title);

      if (autoSpeak) {
        await speakEnglish(replyText);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong sending your message.";
      setErrorMsg(msg);
    } finally {
      setSending(false);
    }
  };

  const handleToggleMic = () => {
    if (!supportsSpeechInput) return;

    if (listeningMic && recognitionRef.current) {
      recognitionRef.current.stop();
      setListeningMic(false);
      return;
    }

    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const RecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!RecognitionCtor) return;

    const recognition = new RecognitionCtor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onerror = () => setListeningMic(false);
    recognition.onend = () => setListeningMic(false);

    recognitionRef.current = recognition;
    setListeningMic(true);
    recognition.start();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#4A5368]">
            Real-Time English Conversation Practice with Pip
          </p>
          <h1 className="font-display text-3xl font-bold text-[#242938] mt-1">
            Friendly Chat Tutor
          </h1>
        </div>

        <label className="inline-flex items-center gap-2.5 min-h-[40px] text-sm text-[#3D4559] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoSpeak}
            onChange={(e) => setAutoSpeak(e.target.checked)}
            className="w-5 h-5 accent-[#295CB8] rounded cursor-pointer"
          />
          <span>Auto-read Pip&apos;s replies aloud</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Topic Selector & Word Bank */}
        <aside aria-label="Conversation topics and vocabulary" className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-[#EDE6DA] rounded-3xl p-5 space-y-3">
            <h2 className="font-display text-base font-bold text-[#242938]">
              Choose a Conversation Topic
            </h2>
            <div className="space-y-2">
              {CHAT_TOPICS.map((topic) => {
                const selected = topic.id === activeTopic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => handleSelectTopic(topic)}
                    className={`w-full text-left p-3.5 min-h-[60px] rounded-2xl border transition-colors cursor-pointer ${
                      selected
                        ? `${topic.pastelSurface} border-[#CBB09F] text-[#242938]`
                        : "bg-[#FAF8F4] border-[#EFE9DF] text-[#3D4559] hover:bg-[#F3EFE8]"
                    }`}
                  >
                    <p className="font-display text-sm font-bold text-[#242938]">
                      {topic.title}
                    </p>
                    <p className="text-xs text-[#4A5368] mt-1 leading-relaxed">
                      {topic.goal}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#FAF8F4] border border-[#EDE6DA] rounded-3xl p-5 space-y-3">
            <h3 className="font-display text-sm font-bold text-[#242938]">
              Helpful Words to Try (Tap to Hear)
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeTopic.helpfulWords.map((word) => (
                <button
                  key={word}
                  type="button"
                  aria-label={`Hear phrase: ${word.replace("...", "")}`}
                  onClick={() => speakEnglish(word.replace("...", ""))}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl bg-white hover:bg-[#EEF4FF] border border-[#D8CCBE] text-xs font-medium text-[#242938] cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#295CB8]" aria-hidden="true" />
                  <span>{word}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Live Chat Stage */}
        <section
          aria-label="Conversation window with Pip"
          className="lg:col-span-8 bg-white border border-[#EDE6DA] rounded-3xl flex flex-col h-[580px] overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-[#EDE6DA] bg-[#FFF9F4] flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-base font-bold text-[#242938]">
                Pip · Grade 7 Study Buddy
              </p>
              <p className="text-xs text-[#4A5368]">
                Topic: {activeTopic.title}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSelectTopic(activeTopic)}
              className="text-xs font-semibold text-[#3D4559] hover:text-[#242938] min-h-[40px] px-2 cursor-pointer"
            >
              Restart Chat
            </button>
          </div>

          {/* Messages */}
          <div
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
            className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4"
          >
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? "bg-[#295CB8] text-white"
                        : "bg-[#F6F3EC] text-[#242938] border border-[#EAE2D6]"
                    }`}
                  >
                    <p>
                      <span className="sr-only">
                        {isUser ? "You said: " : "Pip said: "}
                      </span>
                      {msg.text}
                    </p>

                    {!isUser && (
                      <div className="mt-2 pt-2 border-t border-[#E6DDD0] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => speakEnglish(msg.text)}
                          aria-label={`Listen to Pip's message: ${msg.text}`}
                          className="inline-flex items-center gap-1.5 min-h-[36px] text-xs font-semibold text-[#234C94] hover:underline cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Listen</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {!isUser && msg.gentleTip && (
                    <div className="mt-2 max-w-[85%] rounded-2xl px-4 py-3 bg-[#FFF8E6] border border-[#EBD28C] text-xs text-[#614008] space-y-1">
                      <p>
                        <strong>Friendly Tip:</strong> {msg.gentleTip}
                      </p>
                      {msg.tipExample && (
                        <p className="font-medium text-[#242938]">
                          Try: “{msg.tipExample}”
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {sending && (
              <div className="flex items-start">
                <div className="rounded-2xl px-4 py-3 bg-[#F6F3EC] border border-[#EAE2D6] text-sm text-[#4A5368]">
                  Pip is thinking of a reply...
                </div>
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="p-3.5 rounded-2xl bg-[#FFF1F0] border border-[#E07C73] text-xs text-[#8F231C]"
              >
                {errorMsg}
              </div>
            )}

            <div ref={scrollEndRef} />
          </div>

          {/* Suggested Starter Replies */}
          {suggestedReplies.length > 0 && !sending && (
            <div className="px-5 py-2.5 border-t border-[#F0EAE0] bg-[#FFFDF9] flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-[#4A5368]">
                Ideas to say:
              </span>
              {suggestedReplies.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(suggestion)}
                  className="px-3 py-2 min-h-[40px] rounded-xl bg-[#EEF4FF] hover:bg-[#E0ECFF] text-[#1D3E78] text-xs font-medium transition-colors cursor-pointer text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-4 border-t border-[#EDE6DA] bg-white flex items-center gap-2.5"
          >
            {supportsSpeechInput && (
              <button
                type="button"
                aria-pressed={listeningMic}
                onClick={handleToggleMic}
                aria-label={listeningMic ? "Stop voice input" : "Speak your answer"}
                className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  listeningMic
                    ? "bg-[#FFE9E6] border-[#C84331] text-[#A82E1E]"
                    : "bg-[#FAF8F4] border-[#D8CCBE] text-[#3D4559] hover:bg-[#F1ECE3]"
                }`}
              >
                {listeningMic ? (
                  <MicOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Mic className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            )}

            <label htmlFor="chat-message-input" className="sr-only">
              Write your English sentence
            </label>
            <input
              id="chat-message-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write your English sentence here..."
              className="flex-1 h-11 px-4 rounded-xl bg-[#FAF8F4] border border-[#D8CCBE] text-sm text-[#242938] placeholder:text-[#565F73]"
            />

            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#C84331] hover:bg-[#AD3525] disabled:opacity-45 text-white text-sm font-semibold transition-colors cursor-pointer shrink-0"
            >
              <span>Send</span>
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};
