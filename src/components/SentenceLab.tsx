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
    // Deterministic friendly shuffle based on challenge id
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
          <p className="text-sm font-medium text-[#5E677D]">
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
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F4EFE6] rounded-xl w-fit">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelectCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              category === cat.id
                ? "bg-white text-[#242938] shadow-xs"
                : "text-[#525B70] hover:text-[#242938]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Gamified Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white border border-[#EDE6DA] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#5E677D]">
                Challenge {safeIndex + 1} of {list.length} · {challenge.categoryLabel}
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#242938]">
                {challenge.clue}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowHint((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF8E5] hover:bg-[#FEF0C3] text-[#8E5D0C] text-xs font-semibold cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              <span>{showHint ? "Hide Hint" : "Grammar Hint"}</span>
            </button>
          </div>

          {showHint && (
            <div className="p-4 rounded-2xl bg-[#FFFDF2] border border-[#F5E3A8] text-sm text-[#78500C]">
              <strong>Hint:</strong> {challenge.grammarNote}
            </div>
          )}

          {/* Sentence Slot Guide */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#5E677D]">
              Sentence Blueprint (Tap tiles below to fill in order)
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
                    onClick={() => placed && handleRemoveToken(placed)}
                    className={`p-3 rounded-2xl border text-left min-h-[76px] flex flex-col justify-between transition-colors ${
                      isSlotCorrect
                        ? "bg-[#EEFAF3] border-[#6ED09C] text-[#185C3C]"
                        : isSlotWrong
                        ? "bg-[#FFF1F0] border-[#F49B94] text-[#9E2B25]"
                        : placed
                        ? "bg-[#EEF4FF] border-[#8FB3F2] text-[#1E3F7D] cursor-pointer"
                        : "bg-[#FAF8F4] border-dashed border-[#D8CEC0] text-[#7A8294]"
                    }`}
                  >
                    <span className="text-[11px] font-medium opacity-80">
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
            <p className="text-xs font-semibold text-[#5E677D]">
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
                    onClick={() => handleAddToken(tok)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                      used
                        ? "bg-[#ECE7DF] text-[#98A0B0] border-transparent cursor-default"
                        : "bg-white hover:bg-[#FFF5EE] text-[#242938] border-[#DFD5C7] cursor-pointer shadow-2xs"
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
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isExactMatch
                  ? "bg-[#EEFAF3] border-[#BDE5CF] text-[#185C3C]"
                  : "bg-[#FFF1F0] border-[#F4B4AE] text-[#8F2822]"
              }`}
            >
              <div className="flex items-start gap-3 text-sm">
                {isExactMatch ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
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
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#D4E2F8] text-[#2959A8] text-xs font-semibold shrink-0 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
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
                className="px-5 py-2.5 rounded-xl bg-[#22946A] hover:bg-[#1B7A57] disabled:opacity-45 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Check Sentence
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-[#E25C49] hover:bg-[#CC4B38] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Next Challenge →
              </button>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF6F0] border border-[#E6DCD0] text-sm font-semibold text-[#242938] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear Tiles</span>
            </button>
          </div>
        </div>

        {/* Quick Pronoun Reference Guide */}
        <aside className="lg:col-span-4 bg-[#F3F8FF] border border-[#DCE7FA] rounded-3xl p-6 space-y-4">
          <h3 className="font-display text-lg font-bold text-[#242938]">
            Quick Pronoun Chart
          </h3>
          <p className="text-xs text-[#4A5368] leading-relaxed">
            Use this cheat sheet whenever you build sentences with pronouns!
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D0DDF5] text-[#4A5368]">
                  <th className="py-2 pr-2 font-semibold">Subject</th>
                  <th className="py-2 pr-2 font-semibold">Object</th>
                  <th className="py-2 font-semibold">Possessive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3ECFA] text-[#242938] font-medium">
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
