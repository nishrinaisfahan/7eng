import { useCallback, useEffect, useState } from "react";

export type QuizScoreRecord = {
  bestScore: number;
  total: number;
  attempts: number;
};

export type ActivityItem = {
  id: string;
  label: string;
  xp: number;
  timestamp: string;
};

export type StudentProgress = {
  studentName: string;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  masteredFlashcards: string[];
  completedLessons: string[];
  completedExercises: string[];
  quizScores: Record<string, QuizScoreRecord>;
  sentencesBuilt: number;
  completedSentenceIds: string[];
  chatTurns: number;
  recentActivity: ActivityItem[];
};

const STORAGE_KEY = "sunny_english_grade7_progress_v1";

function getTodayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function createInitialProgress(): StudentProgress {
  return {
    studentName: "Grade 7 Learner",
    xp: 40,
    streakDays: 1,
    lastActiveDate: getTodayIso(),
    masteredFlashcards: [],
    completedLessons: [],
    completedExercises: [],
    quizScores: {},
    sentencesBuilt: 0,
    completedSentenceIds: [],
    chatTurns: 0,
    recentActivity: [
      {
        id: "welcome",
        label: "Joined SunnyEnglish Grade 7 Studio",
        xp: 40,
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

function loadProgress(): StudentProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialProgress();
    const parsed = JSON.parse(raw) as Partial<StudentProgress>;
    const initial = createInitialProgress();
    return {
      ...initial,
      ...parsed,
      masteredFlashcards: Array.isArray(parsed.masteredFlashcards)
        ? parsed.masteredFlashcards
        : [],
      completedLessons: Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons
        : [],
      completedExercises: Array.isArray(parsed.completedExercises)
        ? parsed.completedExercises
        : [],
      completedSentenceIds: Array.isArray(parsed.completedSentenceIds)
        ? parsed.completedSentenceIds
        : [],
      quizScores: parsed.quizScores ?? {},
      recentActivity: Array.isArray(parsed.recentActivity)
        ? parsed.recentActivity
        : initial.recentActivity,
    };
  } catch {
    return createInitialProgress();
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<StudentProgress>(() => loadProgress());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
  }, [progress]);

  const updateStreak = (prev: StudentProgress): number => {
    const today = getTodayIso();
    if (prev.lastActiveDate === today) return prev.streakDays;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    return prev.lastActiveDate === yesterday ? prev.streakDays + 1 : 1;
  };

  const appendActivity = (
    list: ActivityItem[],
    label: string,
    xp: number
  ): ActivityItem[] => {
    const entry: ActivityItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      label,
      xp,
      timestamp: new Date().toISOString(),
    };
    return [entry, ...list].slice(0, 12);
  };

  const setStudentName = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setProgress((prev) => ({ ...prev, studentName: trimmed }));
  }, []);

  const toggleFlashcardMastered = useCallback(
    (cardId: string, cardWord: string, mastered: boolean) => {
      setProgress((prev) => {
        const exists = prev.masteredFlashcards.includes(cardId);
        if (mastered && !exists) {
          return {
            ...prev,
            xp: prev.xp + 10,
            streakDays: updateStreak(prev),
            lastActiveDate: getTodayIso(),
            masteredFlashcards: [...prev.masteredFlashcards, cardId],
            recentActivity: appendActivity(
              prev.recentActivity,
              `Mastered flashcard "${cardWord}"`,
              10
            ),
          };
        }
        if (!mastered && exists) {
          return {
            ...prev,
            masteredFlashcards: prev.masteredFlashcards.filter((id) => id !== cardId),
          };
        }
        return prev;
      });
    },
    []
  );

  const completeLesson = useCallback((unitId: string, unitTitle: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(unitId)) return prev;
      return {
        ...prev,
        xp: prev.xp + 25,
        streakDays: updateStreak(prev),
        lastActiveDate: getTodayIso(),
        completedLessons: [...prev.completedLessons, unitId],
        recentActivity: appendActivity(
          prev.recentActivity,
          `Completed lesson: ${unitTitle}`,
          25
        ),
      };
    });
  }, []);

  const completeExercise = useCallback((unitId: string, exerciseTitle: string) => {
    setProgress((prev) => {
      const already = prev.completedExercises.includes(unitId);
      const earned = already ? 10 : 30;
      return {
        ...prev,
        xp: prev.xp + earned,
        streakDays: updateStreak(prev),
        lastActiveDate: getTodayIso(),
        completedExercises: already
          ? prev.completedExercises
          : [...prev.completedExercises, unitId],
        recentActivity: appendActivity(
          prev.recentActivity,
          `Finished exercise: ${exerciseTitle}`,
          earned
        ),
      };
    });
  }, []);

  const recordQuizScore = useCallback(
    (unitId: string, unitTitle: string, score: number, total: number) => {
      setProgress((prev) => {
        const existing = prev.quizScores[unitId];
        const bestScore = existing ? Math.max(existing.bestScore, score) : score;
        const earned = score * 10;
        return {
          ...prev,
          xp: prev.xp + earned,
          streakDays: updateStreak(prev),
          lastActiveDate: getTodayIso(),
          quizScores: {
            ...prev.quizScores,
            [unitId]: {
              bestScore,
              total,
              attempts: (existing?.attempts ?? 0) + 1,
            },
          },
          recentActivity: appendActivity(
            prev.recentActivity,
            `Quiz "${unitTitle}": ${score}/${total}`,
            earned
          ),
        };
      });
    },
    []
  );

  const recordSentenceBuilt = useCallback((sentenceId: string, sentenceText: string) => {
    setProgress((prev) => {
      const already = prev.completedSentenceIds.includes(sentenceId);
      const earned = already ? 5 : 15;
      return {
        ...prev,
        xp: prev.xp + earned,
        streakDays: updateStreak(prev),
        lastActiveDate: getTodayIso(),
        sentencesBuilt: prev.sentencesBuilt + 1,
        completedSentenceIds: already
          ? prev.completedSentenceIds
          : [...prev.completedSentenceIds, sentenceId],
        recentActivity: appendActivity(
          prev.recentActivity,
          `Built sentence: "${sentenceText}"`,
          earned
        ),
      };
    });
  }, []);

  const recordChatTurn = useCallback((topicTitle: string) => {
    setProgress((prev) => ({
      ...prev,
      xp: prev.xp + 10,
      streakDays: updateStreak(prev),
      lastActiveDate: getTodayIso(),
      chatTurns: prev.chatTurns + 1,
      recentActivity: appendActivity(
        prev.recentActivity,
        `Practiced speaking about ${topicTitle}`,
        10
      ),
    }));
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = createInitialProgress();
    setProgress(fresh);
  }, []);

  return {
    progress,
    setStudentName,
    toggleFlashcardMastered,
    completeLesson,
    completeExercise,
    recordQuizScore,
    recordSentenceBuilt,
    recordChatTurn,
    resetProgress,
  };
}
