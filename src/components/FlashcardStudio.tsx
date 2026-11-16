import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Headphones,
  RotateCw,
  Volume2,
  XCircle,
} from "lucide-react";
import { FLASHCARDS, UNITS, type FlashcardItem } from "../data/curriculum";
import type { StudentProgress } from "../hooks/useProgress";
import { speakEnglish } from "../utils/audio";
import { CuteIllustration } from "./CuteIllustration";

type FlashcardStudioProps = {
  progress: StudentProgress;
  initialUnitId?: string;
  onToggleMastered: (cardId: string, cardWord: string, mastered: boolean) => void;
};

export const FlashcardStudio: React.FC<FlashcardStudioProps> = ({
  progress,
  initialUnitId = "all",
  onToggleMastered,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<string>(initialUnitId);
  const [mode, setMode] = useState<"study" | "listening">("study");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [slowAudio, setSlowAudio] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // Audio Listening Match state
  const [listenRound, setListenRound] = useState(0);
  const [listenPick, setListenPick] = useState<string | null>(null);
  const [listenScore, setListenScore] = useState(0);

  const filteredCards = useMemo(() => {
    if (selectedUnit === "all") return FLASHCARDS;
    return FLASHCARDS.filter((c) => c.unitId === selectedUnit);
  }, [selectedUnit]);

  const safeIndex = cardIndex < filteredCards.length ? cardIndex : 0;
  const activeCard = filteredCards[safeIndex];
  const isMastered = activeCard
    ? progress.masteredFlashcards.includes(activeCard.id)
    : false;

  const handleSelectUnit = (unitId: string) => {
    setSelectedUnit(unitId);
    setCardIndex(0);
    setFlipped(false);
    setListenRound(0);
    setListenPick(null);
  };

  const handleSpeak = async (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSpeaking(true);
    await speakEnglish(text, { slow: slowAudio });
    setSpeaking(false);
  };

  const handleNext = () => {
    setFlipped(false);
    setCardIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  // Listening challenge round setup
  const listeningChallenge = useMemo(() => {
    if (filteredCards.length === 0) return null;
    const target = filteredCards[listenRound % filteredCards.length];
    const others = FLASHCARDS.filter((c) => c.id !== target.id);
    const distractors: FlashcardItem[] = [];
    for (let i = 0; i < 3 && i < others.length; i++) {
      const idx = (listenRound * 5 + i * 7) % others.length;
      const candidate = others[idx];
      if (!distractors.some((d) => d.id === candidate.id)) {
        distractors.push(candidate);
      }
    }
    const choices = [target, ...distractors].sort((a, b) =>
      a.word.localeCompare(b.word)
    );
    return { target, choices };
  }, [filteredCards, listenRound]);

  const handleChooseListening = (choiceId: string) => {
    if (!listeningChallenge || listenPick) return;
    setListenPick(choiceId);
    if (choiceId === listeningChallenge.target.id) {
      setListenScore((prev) => prev + 1);
      onToggleMastered(
        listeningChallenge.target.id,
        listeningChallenge.target.word,
        true
      );
    }
  };

  const handleNextListeningRound = () => {
    setListenPick(null);
    setListenRound((prev) => prev + 1);
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#5E677D]">
            Picture Vocabulary & Pronunciation · {progress.masteredFlashcards.length} /{" "}
            {FLASHCARDS.length} Mastered
          </p>
          <h1 className="font-display text-3xl font-bold text-[#242938] mt-1">
            Flashcards & Audio Learning
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1 p-1 bg-[#F4EFE6] rounded-xl">
            <button
              type="button"
              onClick={() => setMode("study")}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                mode === "study"
                  ? "bg-white text-[#242938] shadow-xs"
                  : "text-[#525B70] hover:text-[#242938]"
              }`}
            >
              Flip & Study
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("listening");
                setListenPick(null);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                mode === "listening"
                  ? "bg-white text-[#242938] shadow-xs"
                  : "text-[#525B70] hover:text-[#242938]"
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Audio Match Game</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unit Filter Tabs & Audio Speed */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F4EFE6] rounded-xl">
          <button
            type="button"
            onClick={() => handleSelectUnit("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              selectedUnit === "all"
                ? "bg-white text-[#242938] shadow-xs"
                : "text-[#525B70] hover:text-[#242938]"
            }`}
          >
            All Units ({FLASHCARDS.length})
          </button>
          {UNITS.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => handleSelectUnit(u.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                selectedUnit === u.id
                  ? "bg-white text-[#242938] shadow-xs"
                  : "text-[#525B70] hover:text-[#242938]"
              }`}
            >
              {u.number}
            </button>
          ))}
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-[#4A5368] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={slowAudio}
            onChange={(e) => setSlowAudio(e.target.checked)}
            className="w-4 h-4 accent-[#3A72D2] rounded cursor-pointer"
          />
          <span>Slow pronunciation (0.75x)</span>
        </label>
      </div>

      {/* Mode 1: Interactive 3D Flip Cards */}
      {mode === "study" && activeCard && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="perspective-1000">
              <div
                onClick={() => setFlipped((prev) => !prev)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFlipped((prev) => !prev);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Flashcard for ${activeCard.word}. Press Enter to flip.`}
                className={`relative w-full min-h-[360px] transition-transform duration-500 transform-style-3d cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E25C49] rounded-3xl ${
                  flipped ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Face */}
                <div
                  className={`absolute inset-0 backface-hidden ${activeCard.pastelSurface} border border-[#E6DCD0] rounded-3xl p-7 sm:p-9 flex flex-col items-center justify-between text-center`}
                >
                  <div className="w-full flex items-center justify-between text-xs font-medium text-[#5E677D]">
                    <span className="tabular-nums">
                      Card {safeIndex + 1} of {filteredCards.length} ·{" "}
                      {activeCard.partOfSpeech}
                    </span>
                    <span>{isMastered ? "Mastered" : "Tap card to flip"}</span>
                  </div>

                  <div className="my-4 flex flex-col items-center gap-4">
                    <CuteIllustration
                      kind={activeCard.illustration}
                      className="w-28 h-28"
                    />
                    <div>
                      <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#242938]">
                        {activeCard.word}
                      </h2>
                      <p className="font-mono text-sm text-[#5E677D] mt-1">
                        {activeCard.phonetic}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => handleSpeak(activeCard.word, e)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF6F0] border border-[#E2D7CA] text-sm font-semibold text-[#242938] transition-colors cursor-pointer"
                    >
                      <Volume2
                        className={`w-4 h-4 ${speaking ? "text-[#E25C49]" : "text-[#3A72D2]"}`}
                      />
                      <span>{speaking ? "Speaking..." : "Hear Word"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#242938] text-white text-sm font-semibold hover:bg-[#383F54] transition-colors cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span>See Meaning</span>
                    </button>
                  </div>
                </div>

                {/* Back Face */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border border-[#E6DCD0] rounded-3xl p-7 sm:p-9 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-medium text-[#5E677D]">
                    <span>{activeCard.word} · Meaning & Example</span>
                    <span>Tap to flip back</span>
                  </div>

                  <div className="space-y-4 my-4">
                    <div>
                      <p className="text-xs font-semibold text-[#5E677D]">
                        Meaning
                      </p>
                      <p className="font-display text-xl sm:text-2xl font-bold text-[#242938] mt-1">
                        {activeCard.meaning}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F6F9FF] border border-[#DCE7FA] flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-[#3A72D2]">
                          Example Sentence
                        </p>
                        <p className="text-base text-[#242938] mt-1 leading-relaxed">
                          “{activeCard.example}”
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleSpeak(activeCard.example, e)}
                        aria-label="Hear example sentence"
                        className="shrink-0 w-10 h-10 rounded-xl bg-white border border-[#D4E2F8] flex items-center justify-center text-[#3A72D2] hover:bg-[#EEF4FF] cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm text-[#4A5368]">
                      <strong>Study Tip:</strong> {activeCard.tip}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#FAF8F4] border border-[#E6DCD0] text-sm font-semibold text-[#242938] cursor-pointer"
                    >
                      Back to Picture
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleMastered(activeCard.id, activeCard.word, !isMastered);
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                        isMastered
                          ? "bg-[#EEFAF3] border border-[#6ED09C] text-[#185C3C]"
                          : "bg-[#22946A] hover:bg-[#1B7A57] text-white"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {isMastered ? "Mastered" : "Mark Mastered (+10 XP)"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF6F0] border border-[#E6DCD0] text-sm font-semibold text-[#242938] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onToggleMastered(activeCard.id, activeCard.word, !isMastered)
                }
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                  isMastered
                    ? "bg-[#EEFAF3] border-[#6ED09C] text-[#185C3C]"
                    : "bg-white border-[#E6DCD0] text-[#242938] hover:bg-[#FAF6F0]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isMastered ? "Mastered" : "I Know This (+10 XP)"}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E25C49] hover:bg-[#CC4B38] text-white text-sm font-semibold cursor-pointer"
              >
                <span>Next Card</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Deck Selector List */}
          <div className="lg:col-span-5 bg-white border border-[#EDE6DA] rounded-3xl p-5 sm:p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-[#242938]">
              Cards in This Deck ({filteredCards.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredCards.map((card, idx) => {
                const active = idx === safeIndex;
                const done = progress.masteredFlashcards.includes(card.id);
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      setCardIndex(idx);
                      setFlipped(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                      active
                        ? "bg-[#FFF2EC] border-[#EEB5A4] text-[#242938] font-semibold"
                        : "bg-[#FAF8F4] border-[#EFE9DF] text-[#4A5368] hover:bg-[#F3EFE8]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CuteIllustration
                        kind={card.illustration}
                        className="w-9 h-9 shrink-0"
                      />
                      <div className="truncate">
                        <p className="text-sm truncate text-[#242938]">{card.word}</p>
                        <p className="text-xs text-[#6B7489] truncate">
                          {card.partOfSpeech}
                        </p>
                      </div>
                    </div>
                    {done && (
                      <CheckCircle2 className="w-4 h-4 text-[#1B8A5A] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Audio Match Listening Game */}
      {mode === "listening" && listeningChallenge && (
        <div className="bg-white border border-[#EDE6DA] rounded-3xl p-6 sm:p-8 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-[#5E677D]">
                Audio Challenge · Round {listenRound + 1} · Correct: {listenScore}
              </p>
              <h2 className="font-display text-2xl font-bold text-[#242938] mt-1">
                Listen and Pick the Matching Picture Card
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                handleSpeak(
                  `${listeningChallenge.target.word}. ${listeningChallenge.target.example}`
                )
              }
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#3A72D2] hover:bg-[#2F5FB3] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{speaking ? "Playing Audio..." : "Play Word & Sentence"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {listeningChallenge.choices.map((choice) => {
              const isTarget = choice.id === listeningChallenge.target.id;
              const isPicked = listenPick === choice.id;

              let style =
                `${choice.pastelSurface} border-[#EAE2D6] hover:border-[#B9C9E8]`;
              if (listenPick) {
                if (isTarget) {
                  style = "bg-[#EEFAF3] border-[#6ED09C]";
                } else if (isPicked && !isTarget) {
                  style = "bg-[#FFF1F0] border-[#F49B94]";
                }
              }

              return (
                <button
                  key={choice.id}
                  type="button"
                  disabled={Boolean(listenPick)}
                  onClick={() => handleChooseListening(choice.id)}
                  className={`p-5 rounded-2xl border-2 text-left transition-colors cursor-pointer flex items-center gap-4 ${style}`}
                >
                  <CuteIllustration
                    kind={choice.illustration}
                    className="w-16 h-16 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-bold text-[#242938]">
                      {choice.word}
                    </p>
                    <p className="text-xs text-[#5E677D] mt-0.5 line-clamp-2">
                      {choice.meaning}
                    </p>
                  </div>
                  {listenPick && isTarget && (
                    <CheckCircle2 className="w-5 h-5 text-[#1B8A5A] shrink-0" />
                  )}
                  {listenPick && isPicked && !isTarget && (
                    <XCircle className="w-5 h-5 text-[#D1433A] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {listenPick && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#EDE6DA]">
              <p className="text-sm text-[#242938]">
                {listenPick === listeningChallenge.target.id
                  ? `Spot on! "${listeningChallenge.target.word}" means: ${listeningChallenge.target.meaning}`
                  : `Good try! The spoken word was "${listeningChallenge.target.word}".`}
              </p>
              <button
                type="button"
                onClick={handleNextListeningRound}
                className="px-5 py-2.5 rounded-xl bg-[#242938] hover:bg-[#383F54] text-white text-sm font-semibold cursor-pointer"
              >
                Next Listening Round →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
