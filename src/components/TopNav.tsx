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
          className="font-display text-xl font-bold tracking-tight text-[#242938] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E25C49] rounded-md px-1"
        >
          SunnyEnglish
        </button>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#525B70]"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E25C49] rounded ${
                  isActive
                    ? "text-[#242938] font-semibold"
                    : "text-[#525B70] hover:text-[#242938]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full bg-[#E25C49]"
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
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#E25C49] hover:bg-[#CC4B38] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E25C49]"
          >
            Practice Quiz
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[#EDE6DA] bg-white text-[#242938] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E25C49]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#EDE6DA] bg-[#FFFDF8] px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#FFEBE4] text-[#9F3626] font-semibold"
                    : "text-[#525B70] hover:bg-[#F6F1E9]"
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
            className="w-full mt-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#E25C49] rounded-xl cursor-pointer"
          >
            Practice Quiz
          </button>
        </div>
      )}
    </header>
  );
};
