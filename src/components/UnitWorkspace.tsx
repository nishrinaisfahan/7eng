import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Volume2,
  XCircle,
} from "lucide-react";
import { FLASHCARDS, type UnitData } from "../data/curriculum";
import { UNIT_IMAGES } from "../data/unitAssets";
import type { StudentProgress } from "../hooks/useProgress";
import { speakEnglish } from "../utils/audio";
import { CuteIllustration } from "./CuteIllustration";

type UnitWorkspaceProps = {
  unit: UnitData;
  progress: StudentProgress;
  initialSection?: "lesson" | "exercise" | "quiz";
  onBack: () => void;
  onCompleteLesson: (unitId: string, unitTitle: string) => void;
  onCompleteExercise: (unitId: string, exerciseTitle: string) => void;
  onRecordQuizScore: (
    unitId: string,
    unitTitle: string,
    score: number,
    total: number
  ) => void;
  onOpenFlashcardsForUnit: (unitId: string) => void;
};

export const UnitWorkspace: React.FC<UnitWorkspaceProps> = ({
  unit,
  progress,
  initialSection = "lesson",
  onBack,
  onCompleteLesson,
  onCompleteExercise,
  onRecordQuizScore,
  onOpenFlashcardsForUnit,
}) => {
  const [section, setSection] = useState<"lesson" | "exercise" | "quiz">(initialSection);
  const [slowAudio, setSlowAudio] = useState(false);
  const [playingLineIdx, setPlayingLineIdx] = useState<number | null>(null);

  // Sequence exercise state
  const shuffledSteps = useMemo(() => {
    if (!unit.sequenceSteps) return [];
    const copy = [...unit.sequenceSteps];
    return [copy[2], copy[0], copy[4], copy[1], copy[3]].filter(Boolean);
  }, [unit]);

  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [sequenceChecked, setSequenceChecked] = useState(false);

  // Match-fill exercise state
  const [fillAnswers, setFillAnswers] = useState<Record<string, string>>({});
  const [fillChecked, setFillChecked] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const unitFlashcards = FLASHCARDS.filter((c) => c.unitId === unit.id);
  const isLessonDone = progress.completedLessons.includes(unit.id);
  const isExerciseDone = progress.completedExercises.includes(unit.id);
  const savedQuiz = progress.quizScores[unit.id];

  const handleSpeakLine = async (text: string, idx: number) => {
    setPlayingLineIdx(idx);
    await speakEnglish(text, { slow: slowAudio });
    setPlayingLineIdx(null);
  };

  const handleToggleSequenceStep = (id: string) => {
    if (sequenceChecked) return;
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckSequence = () => {
    if (!unit.sequenceSteps) return;
    setSequenceChecked(true);
    const isCorrect = unit.sequenceSteps.every(
      (step, idx) => selectedOrderIds[idx] === step.id
    );
    if (isCorrect) {
      onCompleteExercise(unit.id, unit.exerciseTitle);
    }
  };

  const handleResetSequence = () => {
    setSelectedOrderIds([]);
    setSequenceChecked(false);
  };

  const handleCheckFill = () => {
    if (!unit.fillPrompts) return;
    setFillChecked(true);
    const allRight = unit.fillPrompts.every(
      (item) => fillAnswers[item.id] === item.answer
    );
    if (allRight) {
      onCompleteExercise(unit.id, unit.exerciseTitle);
    }
  };

  const handleResetFill = () => {
    setFillAnswers({});
    setFillChecked(false);
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    unit.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correct += 1;
      }
    });
    setQuizSubmitted(true);
    onRecordQuizScore(unit.id, unit.title, correct, unit.quiz.length);
  };

  const handleRetryQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const quizScore = unit.quiz.reduce(
    (acc, q) => acc + (quizAnswers[q.id] === q.correctIndex ? 1 : 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Unit Header */}
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 min-h-[40px] px-2 text-sm font-medium text-[#4A5368] hover:text-[#242938] self-start cursor-pointer rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to All Units</span>
        </button>

        <div
          className={`${unit.pastelCardBg} border border-[#EAE2D6] rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center`}
        >
          <div className="lg:col-span-8 space-y-3">
            <div className="text-xs font-medium text-[#4A5368]">
              <span>{unit.number}</span>
              <span aria-hidden="true"> · </span>
              <span>{unit.summary}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#242938]">
              {unit.title}
            </h1>
            <p className="text-base text-[#3D4559] max-w-2xl">{unit.subtitle}</p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenFlashcardsForUnit(unit.id)}
                className="px-4 py-2.5 min-h-[44px] rounded-xl bg-white hover:bg-[#FAF6F0] border border-[#D8CCBE] text-sm font-semibold text-[#242938] transition-colors cursor-pointer"
              >
                Practice {unitFlashcards.length} Unit Flashcards
              </button>
            </div>
          </div>
          <div className="lg:col-span-4 aspect-[4/3] rounded-2xl overflow-hidden border border-[#EAE2D6] bg-white">
            <img
              src={UNIT_IMAGES[unit.id]}
              alt={`Storybook illustration for ${unit.title}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Section Segmented Control */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EDE6DA] pb-4">
        <div
          role="tablist"
          aria-label="Unit study modes"
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F4EFE6] rounded-xl"
        >
          <button
            id="tab-lesson"
            type="button"
            role="tab"
            aria-selected={section === "lesson"}
            aria-controls="panel-lesson"
            onClick={() => setSection("lesson")}
            className={`px-4 py-2.5 min-h-[40px] text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              section === "lesson"
                ? "bg-white text-[#242938] shadow-xs"
                : "text-[#4A5368] hover:text-[#242938]"
            }`}
          >
            01. Dialogue & Grammar
          </button>
          <button
            id="tab-exercise"
            type="button"
            role="tab"
            aria-selected={section === "exercise"}
            aria-controls="panel-exercise"
            onClick={() => setSection("exercise")}
            className={`px-4 py-2.5 min-h-[40px] text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              section === "exercise"
                ? "bg-white text-[#242938] shadow-xs"
                : "text-[#4A5368] hover:text-[#242938]"
            }`}
          >
            02. Interactive Exercise
          </button>
          <button
            id="tab-quiz"
            type="button"
            role="tab"
            aria-selected={section === "quiz"}
            aria-controls="panel-quiz"
            onClick={() => setSection("quiz")}
            className={`px-4 py-2.5 min-h-[40px] text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              section === "quiz"
                ? "bg-white text-[#242938] shadow-xs"
                : "text-[#4A5368] hover:text-[#242938]"
            }`}
          >
            03. Fun Quiz
          </button>
        </div>

        <label className="inline-flex items-center gap-2.5 min-h-[40px] text-sm text-[#3D4559] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={slowAudio}
            onChange={(e) => setSlowAudio(e.target.checked)}
            className="w-5 h-5 accent-[#295CB8] rounded cursor-pointer"
          />
          <span>Slow audio speed (0.75x)</span>
        </label>
      </div>

      {/* Section 01: Dialogue & Grammar */}
      {section === "lesson" && (
        <div
          id="panel-lesson"
          role="tabpanel"
          aria-labelledby="tab-lesson"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[#EDE6DA] rounded-3xl p-6 sm:p-7 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-[#4A5368]">
                    Read & Listen Dialogue
                  </p>
                  <h2 className="font-display text-xl font-bold text-[#242938]">
                    {unit.dialogueTitle}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleSpeakLine(
                      unit.dialogue.map((d) => `${d.speaker} says: ${d.text}`).join(" "),
                      99
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#EEF4FF] hover:bg-[#E1ECFF] text-[#234C94] text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" aria-hidden="true" />
                  <span>{playingLineIdx === 99 ? "Speaking..." : "Listen All"}</span>
                </button>
              </div>

              <div className="space-y-4">
                {unit.dialogue.map((line, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-[#FAF8F4] border border-[#EFE9DF]"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-[#4A5368]">
                        {line.speaker}
                      </p>
                      <p className="text-base text-[#242938] leading-relaxed">
                        {line.text}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSpeakLine(line.text, idx)}
                      aria-label={`Listen to ${line.speaker}: ${line.text}`}
                      className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border transition-colors cursor-pointer ${
                        playingLineIdx === idx
                          ? "bg-[#295CB8] text-white border-[#295CB8]"
                          : "bg-white text-[#3D4559] border-[#D8CCBE] hover:bg-[#F3EFE8]"
                      }`}
                    >
                      <Volume2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Words Preview */}
            <div className="bg-white border border-[#EDE6DA] rounded-3xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-[#242938]">
                  Picture Vocabulary in This Unit
                </h3>
                <button
                  type="button"
                  onClick={() => onOpenFlashcardsForUnit(unit.id)}
                  className="text-sm font-semibold text-[#234C94] hover:underline cursor-pointer min-h-[40px]"
                >
                  Open Flashcards →
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {unitFlashcards.slice(0, 6).map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    aria-label={`Hear vocabulary word ${card.word}`}
                    onClick={() => speakEnglish(card.word, { slow: slowAudio })}
                    className={`${card.pastelSurface} border border-[#E4D9CB] rounded-2xl p-4 text-left hover:shadow-xs transition-shadow cursor-pointer flex flex-col items-center text-center gap-2 min-h-[120px]`}
                  >
                    <CuteIllustration kind={card.illustration} className="w-16 h-16" />
                    <span className="font-display font-semibold text-sm text-[#242938]">
                      {card.word}
                    </span>
                    <span className="text-xs text-[#4A5368] inline-flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" aria-hidden="true" /> Tap to hear
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grammar Notes Column */}
          <div className="lg:col-span-5 space-y-6">
            {unit.grammarPoints.map((gp, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#EDE6DA] rounded-3xl p-6 space-y-3"
              >
                <p className="text-xs font-medium text-[#4A5368]">
                  Grammar Pattern {idx + 1}
                </p>
                <h3 className="font-display text-lg font-bold text-[#242938]">
                  {gp.title}
                </h3>
                <div className="p-3.5 rounded-xl bg-[#F4F8FF] border border-[#D4E2F8] font-mono text-xs sm:text-sm text-[#1F3F75]">
                  {gp.pattern}
                </div>
                <p className="text-sm text-[#3D4559] leading-relaxed">
                  {gp.explanation}
                </p>
                <div className="pt-2 space-y-2">
                  {gp.examples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#FAF8F4] text-sm text-[#242938]"
                    >
                      <span>{ex}</span>
                      <button
                        type="button"
                        onClick={() => speakEnglish(ex, { slow: slowAudio })}
                        aria-label={`Listen to example: ${ex}`}
                        className="shrink-0 w-10 h-10 rounded-lg bg-white border border-[#D8CCBE] flex items-center justify-center text-[#3D4559] hover:text-[#242938] cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-[#EEFBF4] border border-[#BEE5CF] rounded-3xl p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#154F35]">
                    {isLessonDone ? "Lesson Completed" : "Ready for the next step?"}
                  </h3>
                  <p className="text-sm text-[#1F6344] mt-1">
                    {isLessonDone
                      ? "You earned 25 XP for reading and listening to this unit."
                      : "Mark this lesson complete to earn +25 XP and try the interactive exercise."}
                  </p>
                </div>
                {isLessonDone && (
                  <CheckCircle2
                    className="w-6 h-6 text-[#167854] shrink-0"
                    aria-label="Lesson completed"
                  />
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {!isLessonDone && (
                  <button
                    type="button"
                    onClick={() => onCompleteLesson(unit.id, unit.title)}
                    className="px-4 py-2.5 min-h-[44px] rounded-xl bg-[#167854] hover:bg-[#116143] text-white text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Mark Lesson Complete (+25 XP)
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSection("exercise")}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-white hover:bg-[#F7FCF9] border border-[#9CD7B8] text-[#154F35] text-sm font-semibold transition-colors cursor-pointer"
                >
                  Go to Interactive Exercise →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 02: Interactive Exercise */}
      {section === "exercise" && (
        <div
          id="panel-exercise"
          role="tabpanel"
          aria-labelledby="tab-exercise"
          className="bg-white border border-[#EDE6DA] rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-[#4A5368]">
                Hands-On Practice {isExerciseDone ? "· Completed" : ""}
              </p>
              <h2 className="font-display text-2xl font-bold text-[#242938] mt-1">
                {unit.exerciseTitle}
              </h2>
              <p className="text-sm text-[#3D4559] mt-1">
                {unit.exerciseInstruction}
              </p>
            </div>
          </div>

          {unit.exerciseType === "sequence" && unit.sequenceSteps && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[#242938]">
                    Step Pool (Tap in order 1 to {unit.sequenceSteps.length})
                  </p>
                  <div className="space-y-2.5">
                    {shuffledSteps.map((step) => {
                      const pickedIndex = selectedOrderIds.indexOf(step.id);
                      const isPicked = pickedIndex !== -1;
                      return (
                        <button
                          key={step.id}
                          type="button"
                          aria-pressed={isPicked}
                          onClick={() => handleToggleSequenceStep(step.id)}
                          disabled={sequenceChecked}
                          className={`w-full text-left p-4 min-h-[56px] rounded-2xl border text-sm transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                            isPicked
                              ? "bg-[#EEF4FF] border-[#6E9CE8] text-[#1A3973] font-medium"
                              : "bg-[#FAF8F4] border-[#DFD5C7] text-[#242938] hover:bg-[#F3EFE8]"
                          }`}
                        >
                          <span>{step.text}</span>
                          {isPicked && (
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-[#B5CFF7] shrink-0">
                              #{pickedIndex + 1}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[#242938]">
                    Your Ordered Story
                  </p>
                  <div className="space-y-2.5">
                    {unit.sequenceSteps.map((expectedStep, slotIdx) => {
                      const chosenId = selectedOrderIds[slotIdx];
                      const chosenObj = unit.sequenceSteps?.find((s) => s.id === chosenId);
                      const isSlotRight = sequenceChecked && chosenId === expectedStep.id;
                      const isSlotWrong = sequenceChecked && chosenId !== expectedStep.id;

                      return (
                        <div
                          key={expectedStep.id}
                          className={`p-4 rounded-2xl border min-h-[60px] flex items-center justify-between gap-3 text-sm ${
                            isSlotRight
                              ? "bg-[#EEFAF3] border-[#52B782] text-[#145338]"
                              : isSlotWrong
                              ? "bg-[#FFF1F0] border-[#E07C73] text-[#8F231C]"
                              : "bg-[#FFFDF9] border-[#DFD5C7] text-[#3D4559]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="font-mono text-xs font-bold mt-0.5 text-[#4A5368]">
                              {slotIdx + 1}.
                            </span>
                            <span>
                              {chosenObj
                                ? chosenObj.text
                                : "Tap a card on the left to fill this step..."}
                            </span>
                          </div>
                          {isSlotRight && (
                            <CheckCircle2
                              className="w-5 h-5 text-[#167854] shrink-0"
                              aria-label="Correct position"
                            />
                          )}
                          {isSlotWrong && (
                            <XCircle
                              className="w-5 h-5 text-[#C84331] shrink-0"
                              aria-label="Incorrect position"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {sequenceChecked && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`p-4 rounded-2xl border flex items-start gap-3 text-sm ${
                    unit.sequenceSteps.every(
                      (step, idx) => selectedOrderIds[idx] === step.id
                    )
                      ? "bg-[#EEFAF3] border-[#9CD7B8] text-[#145338]"
                      : "bg-[#FFF6EB] border-[#E8BE7D] text-[#6B420D]"
                  }`}
                >
                  {unit.sequenceSteps.every(
                    (step, idx) => selectedOrderIds[idx] === step.id
                  ) ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="font-semibold">
                          Awesome sequencing! Everything is in the natural order (+30 XP).
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="font-semibold">
                          Almost there! Follow the clues: First → Next → Then → After/Pour → Finally.
                        </p>
                        <p className="mt-1">Try resetting and placing step 1 first.</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCheckSequence}
                  disabled={
                    selectedOrderIds.length < unit.sequenceSteps.length ||
                    sequenceChecked
                  }
                  className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[#242938] hover:bg-[#383F54] disabled:opacity-45 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Check My Order
                </button>
                <button
                  type="button"
                  onClick={handleResetSequence}
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white hover:bg-[#FAF6F0] border border-[#D8CCBE] text-sm font-semibold text-[#242938] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          )}

          {unit.exerciseType === "match-fill" && unit.fillPrompts && (
            <div className="space-y-5">
              {unit.fillPrompts.map((item, idx) => {
                const chosen = fillAnswers[item.id];
                const isCorrect = fillChecked && chosen === item.answer;
                const isWrong = fillChecked && chosen !== item.answer;

                return (
                  <fieldset
                    key={item.id}
                    className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#EAE2D6] space-y-3"
                  >
                    <legend className="text-sm font-semibold text-[#242938] px-1">
                      {idx + 1}. {item.prompt}
                    </legend>
                    <div
                      role="radiogroup"
                      aria-label={`Choices for question ${idx + 1}`}
                      className="flex flex-wrap gap-2.5"
                    >
                      {item.options.map((opt) => {
                        const selected = chosen === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            disabled={fillChecked}
                            onClick={() =>
                              setFillAnswers((prev) => ({ ...prev, [item.id]: opt }))
                            }
                            className={`px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                              selected
                                ? "bg-[#295CB8] text-white border-[#295CB8]"
                                : "bg-white text-[#242938] border-[#D8CCBE] hover:bg-[#F3EFE8]"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {fillChecked && (
                      <div
                        role="status"
                        aria-live="polite"
                        className={`flex items-start gap-2.5 p-3 rounded-xl text-sm ${
                          isCorrect
                            ? "bg-[#EEFAF3] text-[#145338]"
                            : isWrong
                            ? "bg-[#FFF1F0] text-[#8F231C]"
                            : ""
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                        ) : (
                          <XCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                        )}
                        <span>
                          <strong>
                            {isCorrect ? "Correct!" : `Best answer: ${item.answer}.`}
                          </strong>{" "}
                          {item.explanation}
                        </span>
                      </div>
                    )}
                  </fieldset>
                );
              })}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCheckFill}
                  disabled={
                    Object.keys(fillAnswers).length < unit.fillPrompts.length ||
                    fillChecked
                  }
                  className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[#242938] hover:bg-[#383F54] disabled:opacity-45 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Check Answers
                </button>
                <button
                  type="button"
                  onClick={handleResetFill}
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white hover:bg-[#FAF6F0] border border-[#D8CCBE] text-sm font-semibold text-[#242938] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Try Again</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSection("quiz")}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-[#EEF4FF] hover:bg-[#E0ECFF] text-[#234C94] text-sm font-semibold transition-colors cursor-pointer"
                >
                  Continue to Fun Quiz →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section 03: Fun Quiz */}
      {section === "quiz" && (
        <div
          id="panel-quiz"
          role="tabpanel"
          aria-labelledby="tab-quiz"
          className="bg-white border border-[#EDE6DA] rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-[#4A5368]">
                Unit Checkup · 5 Questions
                {savedQuiz
                  ? ` · Best score: ${savedQuiz.bestScore}/${savedQuiz.total}`
                  : ""}
              </p>
              <h2 className="font-display text-2xl font-bold text-[#242938] mt-1">
                {unit.number} Fun Quiz
              </h2>
            </div>

            {quizSubmitted && (
              <div
                role="status"
                aria-live="polite"
                className="px-4 py-2.5 rounded-2xl bg-[#EEFBF4] border border-[#9CD7B8] text-[#145338] text-sm font-semibold tabular-nums"
              >
                Score: {quizScore} / {unit.quiz.length} (+{quizScore * 10} XP)
              </div>
            )}
          </div>

          <div className="space-y-5">
            {unit.quiz.map((q, qIdx) => {
              const chosenIdx = quizAnswers[q.id];
              const isCorrect = quizSubmitted && chosenIdx === q.correctIndex;

              return (
                <fieldset
                  key={q.id}
                  className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#EAE2D6] space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <legend className="text-base font-semibold text-[#242938] px-1">
                      {qIdx + 1}. {q.question}
                    </legend>
                    {q.audioPrompt && (
                      <button
                        type="button"
                        onClick={() =>
                          speakEnglish(q.audioPrompt || "", { slow: slowAudio })
                        }
                        className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-xl bg-[#EEF4FF] hover:bg-[#E0ECFF] text-[#234C94] text-xs font-semibold cursor-pointer shrink-0"
                      >
                        <Volume2 className="w-4 h-4" aria-hidden="true" />
                        <span>Play Audio Clue</span>
                      </button>
                    )}
                  </div>

                  <div
                    role="radiogroup"
                    aria-label={`Answer choices for question ${qIdx + 1}`}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                  >
                    {q.options.map((opt, oIdx) => {
                      const isSelected = chosenIdx === oIdx;
                      let optionStyle =
                        "bg-white text-[#242938] border-[#D8CCBE] hover:bg-[#F3EFE8]";

                      if (quizSubmitted) {
                        if (oIdx === q.correctIndex) {
                          optionStyle =
                            "bg-[#EEFAF3] text-[#145338] border-[#52B782] font-semibold";
                        } else if (isSelected && oIdx !== q.correctIndex) {
                          optionStyle =
                            "bg-[#FFF1F0] text-[#8F231C] border-[#E07C73]";
                        }
                      } else if (isSelected) {
                        optionStyle =
                          "bg-[#295CB8] text-white border-[#295CB8] font-semibold";
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          disabled={quizSubmitted}
                          onClick={() =>
                            setQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                          }
                          className={`text-left px-4 py-3 min-h-[48px] rounded-xl border text-sm transition-colors cursor-pointer flex items-center justify-between gap-2 ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && oIdx === q.correctIndex && (
                            <CheckCircle2
                              className="w-4 h-4 shrink-0 text-[#167854]"
                              aria-label="Correct answer"
                            />
                          )}
                          {quizSubmitted && isSelected && oIdx !== q.correctIndex && (
                            <XCircle
                              className="w-4 h-4 shrink-0 text-[#C84331]"
                              aria-label="Your selected answer (incorrect)"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <p
                      className={`text-sm p-3 rounded-xl ${
                        isCorrect
                          ? "bg-[#EEFAF3] text-[#145338]"
                          : "bg-[#FFF6EB] text-[#6B420D]"
                      }`}
                    >
                      <strong>{isCorrect ? "Well done!" : "Tip:"}</strong>{" "}
                      {q.explanation}
                    </p>
                  )}
                </fieldset>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {!quizSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length < unit.quiz.length}
                className="px-6 py-3 min-h-[44px] rounded-xl bg-[#C84331] hover:bg-[#AD3525] disabled:opacity-45 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Submit Quiz Answers
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRetryQuiz}
                className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-[#242938] hover:bg-[#383F54] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Retake Quiz</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
