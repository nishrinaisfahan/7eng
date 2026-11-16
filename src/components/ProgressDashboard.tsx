import React, { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { FLASHCARDS, SENTENCE_CHALLENGES, UNITS } from "../data/curriculum";
import type { StudentProgress } from "../hooks/useProgress";

type ProgressDashboardProps = {
  progress: StudentProgress;
  onUpdateName: (name: string) => void;
  onToggleLargeText: () => void;
  onResetProgress: () => void;
  onOpenUnit: (unitId: string) => void;
};

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  onUpdateName,
  onToggleLargeText,
  onResetProgress,
  onOpenUnit,
}) => {
  const [nameInput, setNameInput] = useState(progress.studentName);
  const [confirmReset, setConfirmReset] = useState(false);

  const recommendedUnit =
    UNITS.find(
      (u) =>
        !progress.completedLessons.includes(u.id) ||
        !progress.completedExercises.includes(u.id) ||
        !progress.quizScores[u.id]
    ) || UNITS[0];

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateName(nameInput);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#4A5368]">
            Consistent Improvement Tracker · Grade 7 English
          </p>
          <h1 className="font-display text-3xl font-bold text-[#242938] mt-1">
            {progress.studentName}&apos;s Study Progress
          </h1>
        </div>

        <form onSubmit={handleSaveName} className="flex items-center gap-2">
          <label htmlFor="student-name-input" className="sr-only">
            Student name
          </label>
          <input
            id="student-name-input"
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Your name"
            className="h-11 px-3.5 rounded-xl bg-white border border-[#D8CCBE] text-sm text-[#242938]"
          />
          <button
            type="submit"
            className="h-11 px-4 rounded-xl bg-[#242938] hover:bg-[#383F54] text-white text-xs font-semibold cursor-pointer"
          >
            Save Name
          </button>
        </form>
      </div>

      {/* Summary Strip */}
      <section aria-label="Progress highlights" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFF5EE] border border-[#F3DFD3] rounded-2xl p-5">
          <p className="text-xs font-medium text-[#7D3A2D]">Total Study XP</p>
          <p className="mt-1.5 font-display text-3xl font-bold text-[#242938] tabular-nums">
            {progress.xp}
          </p>
          <p className="mt-1 text-xs text-[#5E3A32] tabular-nums">
            {progress.streakDays} day active streak
          </p>
        </div>

        <div className="bg-[#F3F8FF] border border-[#DCE7FA] rounded-2xl p-5">
          <p className="text-xs font-medium text-[#234C94]">Flashcards Mastered</p>
          <p className="mt-1.5 font-display text-3xl font-bold text-[#242938] tabular-nums">
            {progress.masteredFlashcards.length} / {FLASHCARDS.length}
          </p>
          <p className="mt-1 text-xs text-[#385385]">Picture & audio cards</p>
        </div>

        <div className="bg-[#EEFAF3] border border-[#CDEEDB] rounded-2xl p-5">
          <p className="text-xs font-medium text-[#154F35]">Sentences Solved</p>
          <p className="mt-1.5 font-display text-3xl font-bold text-[#242938] tabular-nums">
            {progress.completedSentenceIds.length} / {SENTENCE_CHALLENGES.length}
          </p>
          <p className="mt-1 text-xs text-[#1F6344] tabular-nums">
            {progress.sentencesBuilt} total builds
          </p>
        </div>

        <div className="bg-[#F9F4FF] border border-[#E7D8FA] rounded-2xl p-5">
          <p className="text-xs font-medium text-[#582B8C]">Conversation Turns</p>
          <p className="mt-1.5 font-display text-3xl font-bold text-[#242938] tabular-nums">
            {progress.chatTurns}
          </p>
          <p className="mt-1 text-xs text-[#5E3D85]">Real-time English replies</p>
        </div>
      </section>

      {/* Recommended Next Step */}
      <section className="bg-white border border-[#EDE6DA] rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#234C94]">
            Recommended Next Study Step
          </p>
          <h2 className="font-display text-xl font-bold text-[#242938] mt-1">
            {recommendedUnit.number}: {recommendedUnit.title}
          </h2>
          <p className="text-sm text-[#3D4559] mt-1">
            Keep your steady streak going by completing this unit&apos;s dialogue, exercise, and quiz.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenUnit(recommendedUnit.id)}
          className="px-5 py-3 min-h-[44px] rounded-xl bg-[#C84331] hover:bg-[#AD3525] text-white text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer"
        >
          Open {recommendedUnit.number} →
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Per-Unit Mastery Table */}
        <section className="lg:col-span-7 bg-white border border-[#EDE6DA] rounded-3xl p-6 space-y-5">
          <h2 className="font-display text-xl font-bold text-[#242938]">
            Unit-by-Unit Mastery
          </h2>

          <div className="space-y-4">
            {UNITS.map((unit) => {
              const lessonDone = progress.completedLessons.includes(unit.id);
              const exerciseDone = progress.completedExercises.includes(unit.id);
              const quiz = progress.quizScores[unit.id];
              const unitCards = FLASHCARDS.filter((c) => c.unitId === unit.id);
              const masteredInUnit = unitCards.filter((c) =>
                progress.masteredFlashcards.includes(c.id)
              ).length;

              const scorePct = Math.round(
                (((lessonDone ? 1 : 0) +
                  (exerciseDone ? 1 : 0) +
                  (quiz ? quiz.bestScore / quiz.total : 0)) /
                  3) *
                  100
              );

              return (
                <div
                  key={unit.id}
                  className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#EFE9DF] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p id={`unit-mastery-${unit.id}`} className="font-display text-base font-bold text-[#242938]">
                        {unit.number} · {unit.title}
                      </p>
                      <p className="text-xs text-[#4A5368] mt-0.5 tabular-nums">
                        Cards: {masteredInUnit}/{unitCards.length} · Lesson:{" "}
                        {lessonDone ? "Done" : "Pending"} · Exercise:{" "}
                        {exerciseDone ? "Done" : "Pending"} · Best Quiz:{" "}
                        {quiz ? `${quiz.bestScore}/${quiz.total}` : "Not tried"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenUnit(unit.id)}
                      className="text-xs font-semibold text-[#234C94] hover:underline min-h-[40px] px-2 cursor-pointer"
                    >
                      Study →
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      role="progressbar"
                      aria-labelledby={`unit-mastery-${unit.id}`}
                      aria-valuenow={scorePct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className="flex-1 h-2 rounded-full bg-white border border-[#D8CCBE] overflow-hidden"
                    >
                      <div
                        className="h-full bg-[#167854] rounded-full transition-all duration-300"
                        style={{ width: `${scorePct}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#242938] tabular-nums w-10 text-right">
                      {scorePct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Study Log, Reading Comfort & Reset */}
        <section className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-[#EDE6DA] rounded-3xl p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-[#242938]">
              Reading Comfort
            </h2>
            <p className="text-xs text-[#4A5368]">
              Increase text size across all lessons, flashcards, quizzes, and chat.
            </p>
            <button
              type="button"
              role="switch"
              aria-checked={progress.largeText}
              onClick={onToggleLargeText}
              className={`px-4 py-2.5 min-h-[44px] rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                progress.largeText
                  ? "bg-[#295CB8] text-white border-[#295CB8]"
                  : "bg-[#FAF8F4] text-[#242938] border-[#D8CCBE] hover:bg-[#F3EFE8]"
              }`}
            >
              Larger Text Mode: {progress.largeText ? "On" : "Off"}
            </button>
          </div>

          <div className="bg-white border border-[#EDE6DA] rounded-3xl p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-[#242938]">
              Recent Study Log
            </h2>
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {progress.recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[#FAF8F4] text-sm"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 text-[#167854] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-[#242938]">{item.label}</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#167854] tabular-nums shrink-0">
                    +{item.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#EDE6DA] rounded-3xl p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-[#242938]">
              Start Fresh
            </h2>
            <p className="text-xs text-[#4A5368]">
              Want to reset your study points and quiz scores for a new student?
            </p>
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#FAF8F4] hover:bg-[#FFF1F0] border border-[#D8CCBE] text-xs font-semibold text-[#8F231C] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Progress</span>
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onResetProgress();
                    setConfirmReset(false);
                  }}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-[#C84331] hover:bg-[#AD3525] text-white text-xs font-semibold cursor-pointer"
                >
                  Yes, Reset All Progress
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-[#FAF8F4] border border-[#D8CCBE] text-xs font-semibold text-[#242938] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
