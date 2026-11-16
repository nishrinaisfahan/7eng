import React, { useMemo, useState } from "react";
import {
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Volume2,
  XCircle,
} from "lucide-react";
import {
  SENTENCE_CHALLENGES,
  type SentenceChallenge,
} from "../data/curriculum";
import type { StudentProgress } from "../hooks/useProgress";
import { speakEnglish } from "../utils/audio";

type SentenceLabProps = {
  progress: StudentProgress;
  onRecordSentenceBuilt: (sentenceId: string, sentenceText: string) => void;
};

type CategoryFilter = "all" | SentenceChallenge["category"];

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All Topics" },
  { id: "intro", label: "Intro & Routines" },
  { id: "hobbies", label: "Hobbies" },
  { id: "traits", label: "Traits" },
  { id: "pronouns", label: "Pronouns" },
  { id: "food", label: "Food & Recipes" },
];

export const SentenceLab: React.FC<SentenceLabProps> = ({
  progress,
  onRecordSentenceBuilt,
}) => {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [index, setIndex] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);

  const list = useMemo(() => {
    if (category === "all") return SENTENCE_CHALLENGES;
    return SENTENCE_CHALLENGES.filter((s) => s.category === category);
  }, [category]);

  const safeIndex = index < list.length ? index : 0;
  const challenge = list[safeIndex];

  const tokenPool = useMemo(() => {
    if (!challenge) return [];
    const all = [...challenge.targetTokens, ...challenge.distractorTokens];
    return [...all].sort((a, b) => {
      const scoreA = (a.charCodeAt(0) * 7 + challenge.id.charCodeAt(1)) % 29;
      const scoreB = (b.charCodeAt(0) * 7 + challenge.id.charCodeAt(1)) % 29;
      return scoreA - scoreB;
    });
  }, [challenge]);

  if (!challenge) return null;

  const isExactMatch =
    selectedTokens.length === challenge.targetTokens.length &&
    challenge.targetTokens.every((tok, idx) => selectedTokens[idx] === tok);

  const handleSelectCategory = (cat: CategoryFilter) => {
    setCategory(cat);
    setIndex(0);
    setSelectedTokens([]);
    setChecked(false);
    setShowHint(false);
  };

  const handleAddToken = (tok: string) => {
    if (checked) return;
    if (selectedTokens.includes(tok)) return;
    setSelectedTokens((prev) => [...prev, tok]);
  };

  const handleRemoveToken = (tok: string) => {
    if (checked) return;
    setSelectedTokens((prev) => prev.filter((item) => item !== tok));
  };

  const handleCheck = () => {
    setChecked(true);
    if (isExactMatch) {
      setStreak((prev) => prev + 1);
      onRecordSentenceBuilt(challenge.id, challenge.targetTokens.join(" "));
    } else {
      setStreak(0);
    }
  };

  const handleReset = () => {
    setSelectedTokens([]);
    setChecked(false);
  };

  const handleNext = () => {
    setSelectedTokens([]);
    setChecked(false);
    setShowHint(false);
    setIndex((prev) => (prev + 1) % list.length);
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#4A5368]">
            Gamified Grammar Builder · {progress.completedSentenceIds.length} /{" "}
            {SENTENCE_CHALLENGES.length} Sentences Solved · Current Streak:{" "}
            <span className="tabular-nums font-semibold text-[#242938]">{streak}</span>
          </p>
          <h1 className="font-display text-3xl font-bold text-[#242938] mt-1">
            Pronouns & Sentence Structure Lab
          </h1>
        </div>
      </div>

      {/* Category Filter */}
      <div
        role="group"
        aria-label="Filter sentence challenges by topic"
        className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F4EFE6] rounded-xl w-fit"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            aria-pressed={category === cat.id}
            onClick={() => handleSelectCategory(cat.id)}
            className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              category === cat.id
                ? "bg-white text-[#242938] shadow-xs"
                : "text-[#4A5368] hover:text-[#242938]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Gamified Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <section
          aria-label="Sentence builder stage"
          className="lg:col-span-8 bg-white border border-[#EDE6DA] rounded-3xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#4A5368]">
                Challenge {safeIndex + 1} of {list.length} · {challenge.categoryLabel}
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#242938]">
                {challenge.clue}
              </h2>
            </div>

            <button
              type="button"
              aria-expanded={showHint}
              aria-controls="sentence-grammar-hint"
              onClick={() => setShowHint((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-[#FFF8E5] hover:bg-[#FEF0C3] text-[#7A4F0B] text-xs font-semibold cursor-pointer border border-[#F0D995]"
            >
              <Lightbulb className="w-4 h-4" aria-hidden="true" />
              <span>{showHint ? "Hide Hint" : "Grammar Hint"}</span>
            </button>
          </div>

          {showHint && (
            <div
              id="sentence-grammar-hint"
              className="p-4 rounded-2xl bg-[#FFFDF2] border border-[#E8D28C] text-sm text-[#6B4509]"
            >
              <strong>Hint:</strong> {challenge.grammarNote}
            </div>
          )}

          {/* Sentence Slot Guide */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#4A5368]">
              Sentence Blueprint (Tap tiles below to fill in order, or tap a placed tile to remove it)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
              {challenge.slots.map((slotLabel, idx) => {
                const placed = selectedTokens[idx];
                const isSlotCorrect =
                  checked && placed === challenge.targetTokens[idx];
                const isSlotWrong =
                  checked && placed !== challenge.targetTokens[idx];

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!placed || checked}
                    aria-label={
                      placed
                        ? `Slot ${idx + 1} ${slotLabel}: ${placed}. Activate to remove.`
                        : `Slot ${idx + 1} ${slotLabel}: empty`
                    }
                    onClick={() => placed && handleRemoveToken(placed)}
                    className={`p-3 rounded-2xl border text-left min-h-[76px] flex flex-col justify-between transition-colors ${
                      isSlotCorrect
                        ? "bg-[#EEFAF3] border-[#52B782] text-[#145338]"
                        : isSlotWrong
                        ? "bg-[#FFF1F0] border-[#E07C73] text-[#8F231C]"
                        : placed
                        ? "bg-[#EEF4FF] border-[#6E9CE8] text-[#1A3973] cursor-pointer"
                        : "bg-[#FAF8F4] border-dashed border-[#CBBFAD] text-[#525B70]"
                    }`}
                  >
                    <span className="text-[11px] font-medium">
                      {idx + 1}. {slotLabel}
                    </span>
                    <span className="font-semibold text-sm mt-1">
                      {placed || "..."}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Word Tile Pool */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#4A5368]">
              Word Tiles (Watch out: there are extra distractor tiles!)
            </p>
            <div className="flex flex-wrap gap-2.5 p-4 rounded-2xl bg-[#FAF8F4] border border-[#EFE9DF]">
              {tokenPool.map((tok) => {
                const used = selectedTokens.includes(tok);
                return (
                  <button
                    key={tok}
                    type="button"
                    disabled={used || checked}
                    aria-label={`Add word tile ${tok}`}
                    onClick={() => handleAddToken(tok)}
                    className={`px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold border transition-colors ${
                      used
                        ? "bg-[#ECE7DF] text-[#5E677D] border-transparent cursor-default"
                        : "bg-white hover:bg-[#FFF5EE] text-[#242938] border-[#D8CCBE] cursor-pointer shadow-2xs"
                    }`}
                  >
                    {tok}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Banner */}
          {checked && (
            <div
              role="status"
              aria-live="polite"
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isExactMatch
                  ? "bg-[#EEFAF3] border-[#9CD7B8] text-[#145338]"
                  : "bg-[#FFF1F0] border-[#E07C73] text-[#8F231C]"
              }`}
            >
              <div className="flex items-start gap-3 text-sm">
                {isExactMatch ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                ) : (
                  <XCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <div>
                  <p className="font-semibold">
                    {isExactMatch
                      ? "Excellent sentence structure! (+15 XP)"
                      : `Target sentence: "${challenge.targetTokens.join(" ")}"`}
                  </p>
                  <p className="mt-1">{challenge.grammarNote}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => speakEnglish(challenge.targetTokens.join(" "))}
                className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-xl bg-white border border-[#C9DAF6] text-[#234C94] text-xs font-semibold shrink-0 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" aria-hidden="true" />
                <span>Hear Sentence</span>
              </button>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {!checked ? (
              <button
                type="button"
                onClick={handleCheck}
                disabled={selectedTokens.length < challenge.targetTokens.length}
                className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[#167854] hover:bg-[#116143] disabled:opacity-45 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Check Sentence
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[#C84331] hover:bg-[#AD3525] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Next Challenge →
              </button>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white hover:bg-[#FAF6F0] border border-[#D8CCBE] text-sm font-semibold text-[#242938] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Clear Tiles</span>
            </button>
          </div>
        </section>

        {/* Quick Pronoun Reference Guide */}
        <aside
          aria-label="Pronoun reference chart"
          className="lg:col-span-4 bg-[#F3F8FF] border border-[#D4E2F8] rounded-3xl p-6 space-y-4"
        >
          <h2 className="font-display text-lg font-bold text-[#242938]">
            Quick Pronoun Chart
          </h2>
          <p className="text-xs text-[#3D4559] leading-relaxed">
            Use this cheat sheet whenever you build sentences with pronouns!
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <caption className="sr-only">
                Subject, Object, and Possessive pronouns chart
              </caption>
              <thead>
                <tr className="border-b border-[#C6DAF6] text-[#3D4559]">
                  <th scope="col" className="py-2 pr-2 font-semibold">Subject</th>
                  <th scope="col" className="py-2 pr-2 font-semibold">Object</th>
                  <th scope="col" className="py-2 font-semibold">Possessive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE8FA] text-[#242938] font-medium">
                <tr>
                  <td className="py-2 pr-2">I</td>
                  <td className="py-2 pr-2">me</td>
                  <td className="py-2">my</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2">you</td>
                  <td className="py-2 pr-2">you</td>
                  <td className="py-2">your</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2">he</td>
                  <td className="py-2 pr-2">him</td>
                  <td className="py-2">his</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2">she</td>
                  <td className="py-2 pr-2">her</td>
                  <td className="py-2">her</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2">it</td>
                  <td className="py-2 pr-2">it</td>
                  <td className="py-2">its</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2">we</td>
                  <td className="py-2 pr-2">us</td>
                  <td className="py-2">our</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2">they</td>
                  <td className="py-2 pr-2">them</td>
                  <td className="py-2">their</td>
                </tr>
              </tbody>
            </table>
          </div>
        </aside>
      </div>
    </div>
  );
};
