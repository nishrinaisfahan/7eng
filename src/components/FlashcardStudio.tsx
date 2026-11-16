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
  const [announcement, setAnnouncement] = useState("");

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
    setAnnouncement("");
  };

  const handleSpeak = async (text: string) => {
    setSpeaking(true);
    await speakEnglish(text, { slow: slowAudio });
    setSpeaking(false);
  };

  const handleFlip = (nextState?: boolean) => {
    setFlipped((prev) => {
      const target = typeof nextState === "boolean" ? nextState : !prev;
      if (activeCard) {
        setAnnouncement(
          target
            ? `Showing meaning for ${activeCard.word}: ${activeCard.meaning}`
            : `Showing picture for ${activeCard.word}`
        );
      }
      return target;
    });
  };

  const handleNext = () => {
    const nextIdx = (safeIndex + 1) % filteredCards.length;
    setFlipped(false);
    setCardIndex(nextIdx);
    const nextCard = filteredCards[nextIdx];
    if (nextCard) {
      setAnnouncement(`Card ${nextIdx + 1} of ${filteredCards.length}: ${nextCard.word}`);
    }
  };

  const handlePrev = () => {
    const prevIdx = (safeIndex - 1 + filteredCards.length) % filteredCards.length;
    setFlipped(false);
    setCardIndex(prevIdx);
    const prevCard = filteredCards[prevIdx];
    if (prevCard) {
      setAnnouncement(`Card ${prevIdx + 1} of ${filteredCards.length}: ${prevCard.word}`);
    }
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
      setAnnouncement(`Correct! ${listeningChallenge.target.word} matches the audio.`);
    } else {
      setAnnouncement(
        `Not quite. The spoken word was ${listeningChallenge.target.word}.`
      );
    }
  };

  const handleNextListeningRound = () => {
    setListenPick(null);
    setListenRound((prev) => prev + 1);
  };

  return (
    <div className="space-y-7">
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#4A5368]">
            Picture Vocabulary & Pronunciation · {progress.masteredFlashcards.length} /{" "}
            {FLASHCARDS.length} Mastered
          </p>
          <h1 className="font-display text-3xl font-bold text-[#242938] mt-1">
            Flashcards & Audio Learning
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            role="tablist"
            aria-label="Flashcard study modes"
            className="inline-flex items-center gap-1 p-1 bg-[#F4EFE6] rounded-xl"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "study"}
              onClick={() => setMode("study")}
              className={`px-4 py-2 min-h-[40px] rounded-lg text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                mode === "study"
                  ? "bg-white text-[#242938] shadow-xs"
                  : "text-[#4A5368] hover:text-[#242938]"
              }`}
            >
              Flip & Study
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "listening"}
              onClick={() => {
                setMode("listening");
                setListenPick(null);
              }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-lg text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                mode === "listening"
                  ? "bg-white text-[#242938] shadow-xs"
                  : "text-[#4A5368] hover:text-[#242938]"
              }`}
            >
              <Headphones className="w-4 h-4" aria-hidden="true" />
              <span>Audio Match Game</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unit Filter Tabs & Audio Speed */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="group"
          aria-label="Filter flashcards by unit"
          className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F4EFE6] rounded-xl"
        >
          <button
            type="button"
            aria-pressed={selectedUnit === "all"}
            onClick={() => handleSelectUnit("all")}
            className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              selectedUnit === "all"
                ? "bg-white text-[#242938] shadow-xs"
                : "text-[#4A5368] hover:text-[#242938]"
            }`}
          >
            All Units ({FLASHCARDS.length})
          </button>
          {UNITS.map((u) => (
            <button
              key={u.id}
              type="button"
              aria-pressed={selectedUnit === u.id}
              onClick={() => handleSelectUnit(u.id)}
              className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                selectedUnit === u.id
                  ? "bg-white text-[#242938] shadow-xs"
                  : "text-[#4A5368] hover:text-[#242938]"
              }`}
            >
              {u.number}
            </button>
          ))}
        </div>

        <label className="inline-flex items-center gap-2.5 min-h-[40px] text-sm text-[#3D4559] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={slowAudio}
            onChange={(e) => setSlowAudio(e.target.checked)}
            className="w-5 h-5 accent-[#295CB8] rounded cursor-pointer"
          />
          <span>Slow pronunciation (0.75x)</span>
        </label>
      </div>

      {/* Mode 1: Accessible 3D Flip Cards (Zero nested interactive elements!) */}
      {mode === "study" && activeCard && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <section
              aria-label={`Flashcard ${safeIndex + 1} of ${filteredCards.length}: ${activeCard.word}`}
              className="perspective-1000"
            >
              <div
                className={`relative w-full min-h-[380px] transition-transform duration-500 transform-style-3d rounded-3xl ${
                  flipped ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Face */}
                <div
                  aria-hidden={flipped}
                  className={`absolute inset-0 backface-hidden ${activeCard.pastelSurface} border border-[#E6DCD0] rounded-3xl p-7 sm:p-9 flex flex-col items-center justify-between text-center ${
                    flipped ? "pointer-events-none" : ""
                  }`}
                >
                  <div className="w-full flex items-center justify-between text-xs font-medium text-[#4A5368]">
                    <span className="tabular-nums">
                      Card {safeIndex + 1} of {filteredCards.length} ·{" "}
                      {activeCard.partOfSpeech}
                    </span>
                    <span>{isMastered ? "Mastered" : "Front: Picture & Word"}</span>
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
                      <p className="font-mono text-sm text-[#4A5368] mt-1">
                        {activeCard.phonetic}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      tabIndex={flipped ? -1 : 0}
                      onClick={() => handleSpeak(activeCard.word)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white hover:bg-[#FAF6F0] border border-[#D8CCBE] text-sm font-semibold text-[#242938] transition-colors cursor-pointer"
                    >
                      <Volume2
                        className={`w-4 h-4 ${speaking ? "text-[#C84331]" : "text-[#295CB8]"}`}
                        aria-hidden="true"
                      />
                      <span>{speaking ? "Speaking..." : "Hear Word"}</span>
                    </button>

                    <button
                      type="button"
                      tabIndex={flipped ? -1 : 0}
                      onClick={() => handleFlip(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#242938] text-white text-sm font-semibold hover:bg-[#383F54] transition-colors cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4" aria-hidden="true" />
                      <span>See Meaning</span>
                    </button>
                  </div>
                </div>

                {/* Back Face */}
                <div
                  aria-hidden={!flipped}
                  className={`absolute inset-0 backface-hidden rotate-y-180 bg-white border border-[#E6DCD0] rounded-3xl p-7 sm:p-9 flex flex-col justify-between ${
                    !flipped ? "pointer-events-none" : ""
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-medium text-[#4A5368]">
                    <span>{activeCard.word} · Meaning & Example</span>
                    <span>Back Side</span>
                  </div>

                  <div className="space-y-4 my-4">
                    <div>
                      <p className="text-xs font-semibold text-[#4A5368]">
                        Meaning
                      </p>
                      <p className="font-display text-xl sm:text-2xl font-bold text-[#242938] mt-1">
                        {activeCard.meaning}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F6F9FF] border border-[#D4E2F8] flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-[#234C94]">
                          Example Sentence
                        </p>
                        <p className="text-base text-[#242938] mt-1 leading-relaxed">
                          “{activeCard.example}”
                        </p>
                      </div>
                      <button
                        type="button"
                        tabIndex={!flipped ? -1 : 0}
                        onClick={() => handleSpeak(activeCard.example)}
                        aria-label={`Hear example sentence: ${activeCard.example}`}
                        className="shrink-0 w-11 h-11 rounded-xl bg-white border border-[#C9DAF6] flex items-center justify-center text-[#295CB8] hover:bg-[#EEF4FF] cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    <p className="text-sm text-[#3D4559]">
                      <strong>Study Tip:</strong> {activeCard.tip}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      tabIndex={!flipped ? -1 : 0}
                      onClick={() => handleFlip(false)}
                      className="px-4 py-2.5 min-h-[44px] rounded-xl bg-[#FAF8F4] border border-[#D8CCBE] text-sm font-semibold text-[#242938] cursor-pointer"
                    >
                      Back to Picture
                    </button>

                    <button
                      type="button"
                      tabIndex={!flipped ? -1 : 0}
                      aria-pressed={isMastered}
                      onClick={() => {
                        onToggleMastered(activeCard.id, activeCard.word, !isMastered);
                        setAnnouncement(
                          !isMastered
                            ? `Marked ${activeCard.word} as mastered.`
                            : `Removed ${activeCard.word} from mastered.`
                        );
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                        isMastered
                          ? "bg-[#EEFAF3] border border-[#52B782] text-[#145338]"
                          : "bg-[#167854] hover:bg-[#116143] text-white"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {isMastered ? "Mastered" : "Mark Mastered (+10 XP)"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Card Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white hover:bg-[#FAF6F0] border border-[#D8CCBE] text-sm font-semibold text-[#242938] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                aria-pressed={isMastered}
                onClick={() => {
                  onToggleMastered(activeCard.id, activeCard.word, !isMastered);
                  setAnnouncement(
                    !isMastered
                      ? `Marked ${activeCard.word} as mastered.`
                      : `Removed ${activeCard.word} from mastered.`
                  );
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                  isMastered
                    ? "bg-[#EEFAF3] border-[#52B782] text-[#145338]"
                    : "bg-white border-[#D8CCBE] text-[#242938] hover:bg-[#FAF6F0]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>{isMastered ? "Mastered" : "I Know This (+10 XP)"}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#C84331] hover:bg-[#AD3525] text-white text-sm font-semibold cursor-pointer"
              >
                <span>Next Card</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Deck Selector List */}
          <div className="lg:col-span-5 bg-white border border-[#EDE6DA] rounded-3xl p-5 sm:p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-[#242938]">
              Cards in This Deck ({filteredCards.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredCards.map((card, idx) => {
                const active = idx === safeIndex;
                const done = progress.masteredFlashcards.includes(card.id);
                return (
                  <button
                    key={card.id}
                    type="button"
                    aria-current={active ? "true" : undefined}
                    onClick={() => {
                      setCardIndex(idx);
                      setFlipped(false);
                      setAnnouncement(`Selected card ${idx + 1}: ${card.word}`);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 min-h-[52px] rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                      active
                        ? "bg-[#FFF2EC] border-[#DF9F8B] text-[#242938] font-semibold"
                        : "bg-[#FAF8F4] border-[#EFE9DF] text-[#3D4559] hover:bg-[#F3EFE8]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CuteIllustration
                        kind={card.illustration}
                        className="w-9 h-9 shrink-0"
                      />
                      <div className="truncate">
                        <p className="text-sm truncate text-[#242938]">{card.word}</p>
                        <p className="text-xs text-[#4A5368] truncate">
                          {card.partOfSpeech}
                        </p>
                      </div>
                    </div>
                    {done && (
                      <CheckCircle2
                        className="w-4 h-4 text-[#167854] shrink-0"
                        aria-label="Mastered"
                      />
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
        <section
          aria-label="Audio listening match game"
          className="bg-white border border-[#EDE6DA] rounded-3xl p-6 sm:p-8 max-w-4xl space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-[#4A5368]">
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
              className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-[#295CB8] hover:bg-[#204A96] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" aria-hidden="true" />
              <span>{speaking ? "Playing Audio..." : "Play Word & Sentence"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {listeningChallenge.choices.map((choice) => {
              const isTarget = choice.id === listeningChallenge.target.id;
              const isPicked = listenPick === choice.id;

              let style =
                `${choice.pastelSurface} border-[#DFD5C7] hover:border-[#7FA2DF]`;
              if (listenPick) {
                if (isTarget) {
                  style = "bg-[#EEFAF3] border-[#52B782]";
                } else if (isPicked && !isTarget) {
                  style = "bg-[#FFF1F0] border-[#E07C73]";
                }
              }

              return (
                <button
                  key={choice.id}
                  type="button"
                  disabled={Boolean(listenPick)}
                  onClick={() => handleChooseListening(choice.id)}
                  className={`p-5 min-h-[96px] rounded-2xl border-2 text-left transition-colors cursor-pointer flex items-center gap-4 ${style}`}
                >
                  <CuteIllustration
                    kind={choice.illustration}
                    className="w-16 h-16 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-bold text-[#242938]">
                      {choice.word}
                    </p>
                    <p className="text-xs text-[#4A5368] mt-0.5 line-clamp-2">
                      {choice.meaning}
                    </p>
                  </div>
                  {listenPick && isTarget && (
                    <CheckCircle2
                      className="w-5 h-5 text-[#167854] shrink-0"
                      aria-label="Correct match"
                    />
                  )}
                  {listenPick && isPicked && !isTarget && (
                    <XCircle
                      className="w-5 h-5 text-[#C84331] shrink-0"
                      aria-label="Incorrect match"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {listenPick && (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#EDE6DA]"
            >
              <p className="text-sm text-[#242938]">
                {listenPick === listeningChallenge.target.id
                  ? `Spot on! "${listeningChallenge.target.word}" means: ${listeningChallenge.target.meaning}`
                  : `Good try! The spoken word was "${listeningChallenge.target.word}".`}
              </p>
              <button
                type="button"
                onClick={handleNextListeningRound}
                className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[#242938] hover:bg-[#383F54] text-white text-sm font-semibold cursor-pointer"
              >
                Next Listening Round →
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
