import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export type AppTab = "home" | "flashcards" | "sentence-lab" | "chat" | "progress";

type TopNavProps = {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onStartQuickQuiz: () => void;
};

const NAV_ITEMS: { id: AppTab; label: string }[] = [
  { id: "home", label: "Lessons" },
  { id: "flashcards", label: "Flashcards" },
  { id: "sentence-lab", label: "Sentence Lab" },
  { id: "chat", label: "Chat Tutor" },
  { id: "progress", label: "Progress" },
];

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onStartQuickQuiz,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (tab: AppTab) => {
    onSelectTab(tab);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF8]/95 backdrop-blur-sm border-b border-[#EDE6DA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => handleNav("home")}
          className="font-display text-xl font-bold tracking-tight text-[#242938] whitespace-nowrap shrink-0 cursor-pointer rounded-md px-1 min-h-[40px]"
        >
          SunnyEnglish
        </button>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A5368]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => handleNav(item.id)}
                className={`relative py-2 min-h-[40px] whitespace-nowrap shrink-0 transition-colors cursor-pointer rounded ${
                  isActive
                    ? "text-[#242938] font-semibold"
                    : "text-[#4A5368] hover:text-[#242938]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 bottom-0.5 h-0.5 rounded-full bg-[#C84331]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartQuickQuiz}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 min-h-[40px] text-sm font-semibold text-white bg-[#C84331] hover:bg-[#AD3525] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Practice Quiz
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[#EDE6DA] bg-white text-[#242938] cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="md:hidden border-t border-[#EDE6DA] bg-[#FFFDF8] px-4 py-3 space-y-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => handleNav(item.id)}
                className={`w-full text-left px-3 py-3 min-h-[44px] rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#FFEBE4] text-[#8F2E20] font-semibold"
                    : "text-[#4A5368] hover:bg-[#F6F1E9]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onStartQuickQuiz();
            }}
            className="w-full mt-2 px-4 py-3 min-h-[44px] text-sm font-semibold text-white bg-[#C84331] hover:bg-[#AD3525] rounded-xl cursor-pointer"
          >
            Practice Quiz
          </button>
        </nav>
      )}
    </header>
  );
};
