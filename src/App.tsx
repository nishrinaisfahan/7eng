import { useState } from "react";
import { ChatTutor } from "./components/ChatTutor";
import { FlashcardStudio } from "./components/FlashcardStudio";
import { HomeOverview } from "./components/HomeOverview";
import { ProgressDashboard } from "./components/ProgressDashboard";
import { SentenceLab } from "./components/SentenceLab";
import { TopNav, type AppTab } from "./components/TopNav";
import { UnitWorkspace } from "./components/UnitWorkspace";
import { UNITS } from "./data/curriculum";
import { useProgress } from "./hooks/useProgress";
import { stopSpeaking } from "./utils/audio";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [unitSection, setUnitSection] = useState<"lesson" | "exercise" | "quiz">(
    "lesson"
  );
  const [flashcardInitialUnit, setFlashcardInitialUnit] = useState<string>("all");

  const {
    progress,
    setStudentName,
    toggleFlashcardMastered,
    completeLesson,
    completeExercise,
    recordQuizScore,
    recordSentenceBuilt,
    recordChatTurn,
    resetProgress,
  } = useProgress();

  const handleSelectTab = (tab: AppTab) => {
    stopSpeaking();
    setActiveTab(tab);
    if (tab !== "home") {
      setSelectedUnitId(null);
    } else {
      setSelectedUnitId(null);
    }
    if (tab === "flashcards") {
      setFlashcardInitialUnit("all");
    }
  };

  const handleOpenUnit = (
    unitId: string,
    section: "lesson" | "exercise" | "quiz" = "lesson"
  ) => {
    stopSpeaking();
    setSelectedUnitId(unitId);
    setUnitSection(section);
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartQuickQuiz = () => {
    const nextUnit =
      UNITS.find((u) => !progress.quizScores[u.id]) || UNITS[0];
    handleOpenUnit(nextUnit.id, "quiz");
  };

  const handleOpenFlashcardsForUnit = (unitId: string) => {
    stopSpeaking();
    setFlashcardInitialUnit(unitId);
    setSelectedUnitId(null);
    setActiveTab("flashcards");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeUnit = selectedUnitId
    ? UNITS.find((u) => u.id === selectedUnitId) || null
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF8] text-[#242938]">
      <TopNav
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onStartQuickQuiz={handleStartQuickQuiz}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {activeTab === "home" && !activeUnit && (
          <HomeOverview
            progress={progress}
            onOpenUnit={(id) => handleOpenUnit(id, "lesson")}
            onOpenFlashcards={() => handleSelectTab("flashcards")}
            onOpenChat={() => handleSelectTab("chat")}
          />
        )}

        {activeTab === "home" && activeUnit && (
          <UnitWorkspace
            key={`${activeUnit.id}-${unitSection}`}
            unit={activeUnit}
            progress={progress}
            initialSection={unitSection}
            onBack={() => {
              stopSpeaking();
              setSelectedUnitId(null);
            }}
            onCompleteLesson={completeLesson}
            onCompleteExercise={completeExercise}
            onRecordQuizScore={recordQuizScore}
            onOpenFlashcardsForUnit={handleOpenFlashcardsForUnit}
          />
        )}

        {activeTab === "flashcards" && (
          <FlashcardStudio
            key={flashcardInitialUnit}
            progress={progress}
            initialUnitId={flashcardInitialUnit}
            onToggleMastered={toggleFlashcardMastered}
          />
        )}

        {activeTab === "sentence-lab" && (
          <SentenceLab
            progress={progress}
            onRecordSentenceBuilt={recordSentenceBuilt}
          />
        )}

        {activeTab === "chat" && (
          <ChatTutor onRecordChatTurn={recordChatTurn} />
        )}

        {activeTab === "progress" && (
          <ProgressDashboard
            progress={progress}
            onUpdateName={setStudentName}
            onResetProgress={resetProgress}
            onOpenUnit={(id) => handleOpenUnit(id, "lesson")}
          />
        )}
      </main>

      <footer className="border-t border-[#EDE6DA] bg-[#FAF6EE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5E677D]">
          <p className="font-medium text-[#242938]">
            SunnyEnglish · Grade 7 Study Studio
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => handleSelectTab("home")}
              className="hover:text-[#242938] cursor-pointer"
            >
              Lessons
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab("flashcards")}
              className="hover:text-[#242938] cursor-pointer"
            >
              Flashcards
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab("sentence-lab")}
              className="hover:text-[#242938] cursor-pointer"
            >
              Sentence Lab
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab("chat")}
              className="hover:text-[#242938] cursor-pointer"
            >
              Chat Tutor
            </button>
            <button
              type="button"
              onClick={() => handleSelectTab("progress")}
              className="hover:text-[#242938] cursor-pointer"
            >
              Progress
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
