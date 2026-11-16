import React, { useState } from "react";
import { ArrowRight, BookOpen, MessageCircle, Volume2 } from "lucide-react";
import { FLASHCARDS, UNITS, type UnitData } from "../data/curriculum";
import { HERO_CLASSROOM_IMAGE, UNIT_IMAGES } from "../data/unitAssets";
import type { StudentProgress } from "../hooks/useProgress";
import { speakEnglish } from "../utils/audio";

type HomeOverviewProps = {
  progress: StudentProgress;
  onOpenUnit: (unitId: string) => void;
  onOpenFlashcards: () => void;
  onOpenChat: () => void;
};

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  progress,
  onOpenUnit,
  onOpenFlashcards,
  onOpenChat,
}) => {
  const [heroError, setHeroError] = useState(false);
  const [unitImgErrors, setUnitImgErrors] = useState<Record<string, boolean>>({});
  const [speakingGreeting, setSpeakingGreeting] = useState(false);

  const quizValues = Object.values(progress.quizScores);
  const avgQuizPct =
    quizValues.length > 0
      ? Math.round(
          (quizValues.reduce((acc, q) => acc + q.bestScore / q.total, 0) /
            quizValues.length) *
            100
        )
      : 0;

  const getUnitCompletion = (unit: UnitData) => {
    let steps = 0;
    if (progress.completedLessons.includes(unit.id)) steps += 1;
    if (progress.completedExercises.includes(unit.id)) steps += 1;
    if (progress.quizScores[unit.id]?.bestScore >= 3) steps += 1;
    return Math.round((steps / 3) * 100);
  };

  const handlePlayWelcome = async () => {
    setSpeakingGreeting(true);
    await speakEnglish(
      "Welcome to SunnyEnglish! Let's practice introducing ourselves, talking about hobbies, pronouns, and favourite recipes together."
    );
    setSpeakingGreeting(false);
  };

  return (
    <div className="space-y-10">
      {/* Hero Split Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-[#FFF5EE] border border-[#F3DFD3] rounded-3xl p-6 sm:p-9 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <p className="text-sm font-medium text-[#A34B39]">
              Grade 7 English Studio · Interactive Lessons & Audio
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-[#242938] leading-tight">
              Learn everyday English with pictures, games, and friendly chat.
            </h1>
            <p className="text-base text-[#4A5368] leading-relaxed max-w-xl">
              Practice introducing yourself, describing family and friends, building pronoun
              sentences, and sharing favourite recipes—step by step at your own pace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenUnit("unit-1")}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E25C49] hover:bg-[#CC4B38] text-white font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E25C49]"
            >
              <span>Start Unit 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenChat}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-[#FAF5EF] text-[#242938] border border-[#E6DCD0] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E25C49]"
            >
              <MessageCircle className="w-4 h-4 text-[#3A72D2]" />
              <span>Practice Conversation</span>
            </button>

            <button
              type="button"
              onClick={handlePlayWelcome}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FFFFFF]/80 hover:bg-white text-[#4A5368] border border-[#EBDAD0] font-medium text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E25C49]"
            >
              <Volume2 className={`w-4 h-4 ${speakingGreeting ? "text-[#E25C49]" : ""}`} />
              <span>{speakingGreeting ? "Playing..." : "Hear Welcome"}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-[#EAE2D6] bg-[#F4F8FF] min-h-[260px]">
          {!heroError ? (
            <img
              src={HERO_CLASSROOM_IMAGE}
              alt="Cheerful Grade 7 students studying English together with flashcards and storybooks"
              referrerPolicy="no-referrer"
              onError={() => setHeroError(true)}
              className="w-full h-full lg:h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#FFF3EA] via-[#F2F7FF] to-[#EFFBF4]">
              <BookOpen className="w-12 h-12 text-[#E25C49] mb-3" />
              <p className="font-display text-lg font-semibold text-[#242938]">
                Grade 7 English Classroom
              </p>
              <p className="text-sm text-[#525B70]">
                Interactive flashcards, quizzes, and speaking practice
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Full-Width 4-Column Metric Strip */}
      <section
        aria-label="Study summary"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-white border border-[#EDE6DA] rounded-2xl p-5">
          <p className="text-xs font-medium text-[#5E677D]">Words Mastered</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-[#242938] tabular-nums">
            {progress.masteredFlashcards.length} / {FLASHCARDS.length}
          </p>
          <p className="mt-1 text-xs text-[#6B7489]">Picture & audio cards</p>
        </div>

        <div className="bg-white border border-[#EDE6DA] rounded-2xl p-5">
          <p className="text-xs font-medium text-[#5E677D]">Lessons Completed</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-[#242938] tabular-nums">
            {progress.completedLessons.length} / {UNITS.length}
          </p>
          <p className="mt-1 text-xs text-[#6B7489]">Grade 7 study units</p>
        </div>

        <div className="bg-white border border-[#EDE6DA] rounded-2xl p-5">
          <p className="text-xs font-medium text-[#5E677D]">Quiz Accuracy</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-[#242938] tabular-nums">
            {quizValues.length > 0 ? `${avgQuizPct}%` : "0%"}
          </p>
          <p className="mt-1 text-xs text-[#6B7489]">
            {quizValues.length} of {UNITS.length} quizzes tried
          </p>
        </div>

        <div className="bg-white border border-[#EDE6DA] rounded-2xl p-5">
          <p className="text-xs font-medium text-[#5E677D]">Study Points & Streak</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-[#242938] tabular-nums">
            {progress.xp} XP
          </p>
          <p className="mt-1 text-xs text-[#6B7489] tabular-nums">
            {progress.streakDays} day active streak
          </p>
        </div>
      </section>

      {/* Curriculum Units Section */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#242938]">
              Grade 7 English Units
            </h2>
            <p className="text-sm text-[#525B70] mt-1">
              Choose a topic to read dialogues, hear pronunciation, play interactive exercises, and take a quiz.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenFlashcards}
            className="text-sm font-semibold text-[#3A72D2] hover:text-[#2959A8] whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            Browse All 32 Flashcards →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {UNITS.map((unit) => {
            const pct = getUnitCompletion(unit);
            const imgSrc = UNIT_IMAGES[unit.id];
            const hasImgErr = unitImgErrors[unit.id];
            const cardCount = FLASHCARDS.filter((c) => c.unitId === unit.id).length;

            return (
              <article
                key={unit.id}
                className={`${unit.pastelCardBg} border border-[#EAE2D6] rounded-3xl overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5`}
              >
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden bg-white/60 border-b border-[#EAE2D6]">
                    {!hasImgErr && imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={unit.title}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setUnitImgErrors((prev) => ({ ...prev, [unit.id]: true }))
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-6 text-center">
                        <span className={`font-display text-lg font-bold ${unit.accentText}`}>
                          {unit.number}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-2.5">
                    <div className="text-xs font-medium text-[#5E677D]">
                      <span>{unit.number}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{cardCount} Flashcards</span>
                      <span aria-hidden="true"> · </span>
                      <span>5 Quiz Questions</span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-[#242938]">
                      {unit.title}
                    </h3>

                    <p className="text-sm text-[#4A5368] leading-relaxed">
                      {unit.subtitle}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#5E677D] mb-1.5">
                      <span>Unit Progress</span>
                      <span className="font-mono tabular-nums font-semibold text-[#242938]">
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/80 border border-[#EAE2D6] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#3A72D2] transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenUnit(unit.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#242938] ${unit.accentButton}`}
                  >
                    <span>Open {unit.number}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
