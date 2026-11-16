import React from "react";
import type { IllustrationKind } from "../data/curriculum";

type Props = {
  kind: IllustrationKind;
  className?: string;
};

export const CuteIllustration: React.FC<Props> = ({ kind, className = "w-24 h-24" }) => {
  switch (kind) {
    case "wave":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#FFE8DC" />
          <circle cx="48" cy="40" r="16" fill="#FFD1B8" />
          <path d="M35 37c2-9 24-9 26 0" fill="#7D5A50" />
          <circle cx="43" cy="40" r="2" fill="#2D2A32" />
          <circle cx="53" cy="40" r="2" fill="#2D2A32" />
          <path d="M43 46c3 3 7 3 10 0" stroke="#D96B52" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M30 74c2-12 10-18 18-18s16 6 18 18" fill="#8CC5F8" />
          <path d="M67 52l9-12c2-3 6 0 4 3l-8 13" fill="#FFD1B8" stroke="#E0A589" strokeWidth="1.5" />
          <path d="M72 31l4-4M78 36h5" stroke="#F49D6E" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "sunrise":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#FFF3CF" />
          <circle cx="48" cy="52" r="18" fill="#FDB849" />
          <path d="M48 22v8M26 32l6 6M70 32l-6 6M18 52h8M70 52h8" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M16 64c12-6 26-6 36 0s20 4 28 0v14H16z" fill="#A7E3C6" />
          <ellipse cx="32" cy="36" rx="10" ry="5" fill="#FFFFFF" opacity="0.85" />
        </svg>
      );
    case "brush":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#E3F4FF" />
          <rect x="26" y="45" width="46" height="9" rx="4.5" transform="rotate(-32 48 48)" fill="#63B3ED" />
          <rect x="55" y="25" width="16" height="14" rx="4" transform="rotate(-32 63 32)" fill="#FFFFFF" stroke="#B7DCF8" strokeWidth="2" />
          <circle cx="30" cy="34" r="4" fill="#FFFFFF" />
          <circle cx="67" cy="58" r="3" fill="#9AE6B4" />
          <path d="M62 28l4-5M72 34l5-2" stroke="#63B3ED" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "family":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#FFEAF2" />
          <circle cx="33" cy="40" r="10" fill="#FAD2C0" />
          <path d="M21 68c2-10 7-14 12-14s10 4 12 14" fill="#A5B4FC" />
          <circle cx="63" cy="40" r="10" fill="#FAD2C0" />
          <path d="M51 68c2-10 7-14 12-14s10 4 12 14" fill="#F9A8D4" />
          <circle cx="48" cy="52" r="8" fill="#FFE0CE" />
          <path d="M39 74c2-8 5-11 9-11s7 3 9 11" fill="#86EFAC" />
          <path d="M48 25c2-4 7-4 8 0 0 4-8 8-8 8s-8-4-8-8c1-4 6-4 8 0z" fill="#F472B6" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#ECEBFF" />
          <circle cx="48" cy="50" r="24" fill="#FFFFFF" stroke="#8B85F5" strokeWidth="4" />
          <circle cx="31" cy="28" r="6" fill="#A5B4FC" />
          <circle cx="65" cy="28" r="6" fill="#A5B4FC" />
          <path d="M48 36v14l9 6" stroke="#4C489D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="48" cy="50" r="3" fill="#F472B6" />
        </svg>
      );
    case "schoolbag":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#E3F9EE" />
          <path d="M39 30c0-6 18-6 18 0" stroke="#34A876" strokeWidth="4" fill="none" strokeLinecap="round" />
          <rect x="27" y="31" width="42" height="40" rx="12" fill="#6EE7B7" />
          <path d="M27 42c0-7 7-11 21-11s21 4 21 11v6H27z" fill="#34D399" />
          <rect x="35" y="51" width="26" height="14" rx="5" fill="#FFFBEB" />
          <circle cx="48" cy="48" r="3" fill="#FBBF24" />
        </svg>
      );
    case "palette":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#FFF0E5" />
          <path d="M48 24c-15 0-26 11-26 24 0 12 9 22 22 22 5 0 8-3 8-7 0-3-2-5-2-7 0-3 3-5 7-5h5c7 0 12-5 12-12 0-9-11-15-26-15z" fill="#FDE6C4" stroke="#EAB880" strokeWidth="2.5" />
          <circle cx="35" cy="40" r="4.5" fill="#F87171" />
          <circle cx="46" cy="34" r="4.5" fill="#FBBF24" />
          <circle cx="58" cy="38" r="4.5" fill="#60A5FA" />
          <circle cx="34" cy="53" r="4.5" fill="#34D399" />
        </svg>
      );
    case "bicycle":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#E4FBF1" />
          <circle cx="30" cy="58" r="12" fill="none" stroke="#34A876" strokeWidth="3.5" />
          <circle cx="66" cy="58" r="12" fill="none" stroke="#34A876" strokeWidth="3.5" />
          <path d="M30 58l14-18h14l8 18M44 40l4 18h-18" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M55 34h8M38 38h8" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    case "guitar":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#F4EAFF" />
          <g transform="rotate(35 48 48)">
            <ellipse cx="48" cy="58" rx="14" ry="16" fill="#F6AD55" />
            <ellipse cx="48" cy="43" rx="10" ry="11" fill="#F6AD55" />
            <circle cx="48" cy="52" r="5" fill="#7C4A2D" />
            <rect x="45.5" y="16" width="5" height="26" rx="2" fill="#9C6644" />
            <rect x="44" y="12" width="8" height="6" rx="2" fill="#7C4A2D" />
          </g>
          <path d="M26 30c3-3 7 0 4 4M70 60c3-3 7 0 4 4" stroke="#9F7AEA" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#E5F0FF" />
          <path d="M22 32c10-4 20-2 26 4 6-6 16-8 26-4v34c-10-4-20-2-26 4-6-6-16-8-26-4z" fill="#FFFFFF" stroke="#60A5FA" strokeWidth="3" strokeLinejoin="round" />
          <path d="M48 36v34" stroke="#93C5FD" strokeWidth="2.5" />
          <path d="M28 42h12M28 49h12M56 42h12M56 49h12" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#FFF7DC" />
          <rect x="22" y="34" width="52" height="34" rx="9" fill="#93C5FD" />
          <path d="M36 34l4-7h16l4 7" fill="#60A5FA" />
          <circle cx="48" cy="51" r="11" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="3" />
          <circle cx="48" cy="51" r="5" fill="#1E3A8A" />
          <circle cx="65" cy="41" r="2.5" fill="#FEF08A" />
        </svg>
      );
    case "plant":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#E8FAEF" />
          <path d="M33 52h30l-4 22H37z" fill="#FDBA74" />
          <rect x="30" y="48" width="36" height="6" rx="3" fill="#FB923C" />
          <path d="M48 48V28" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="38" cy="34" rx="10" ry="6" transform="rotate(-25 38 34)" fill="#4ADE80" />
          <ellipse cx="58" cy="30" rx="10" ry="6" transform="rotate(25 58 30)" fill="#22C55E" />
        </svg>
      );
    case "glasses":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#E9F2FF" />
          <circle cx="33" cy="50" r="13" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="4" />
          <circle cx="63" cy="50" r="13" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="4" />
          <path d="M46 50c2-3 4-3 4 0" stroke="#4F46E5" strokeWidth="3.5" fill="none" />
          <path d="M27 45l5-5M57 45l5-5" stroke="#BAE6FD" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "smile":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#FFF3CE" />
          <circle cx="48" cy="48" r="24" fill="#FDE047" stroke="#F59E0B" strokeWidth="3" />
          <circle cx="39" cy="44" r="3" fill="#451A03" />
          <circle cx="57" cy="44" r="3" fill="#451A03" />
          <circle cx="33" cy="51" r="3.5" fill="#FDA4AF" />
          <circle cx="63" cy="51" r="3.5" fill="#FDA4AF" />
          <path d="M38 54c4 7 16 7 20 0" stroke="#451A03" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#FFEAF2" />
          <path d="M48 70S24 55 24 38c0-8 6-14 14-14 5 0 8 3 10 6 2-3 5-6 10-6 8 0 14 6 14 14 0 17-24 32-24 32z" fill="#FB7185" />
          <path d="M32 35c0-3 3-6 6-6" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "lightbulb":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#F4ECFF" />
          <path d="M48 24c-11 0-18 8-18 18 0 7 4 12 9 16v7h18v-7c5-4 9-9 9-16 0-10-7-18-18-18z" fill="#FDE047" stroke="#F59E0B" strokeWidth="2.5" />
          <rect x="40" y="65" width="16" height="8" rx="3" fill="#CBD5E1" />
          <path d="M48 15v5M24 27l4 4M72 27l-4 4" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#E8FAF2" />
          <path d="M48 22l7.5 15.5 17 2.4-12.3 12 2.9 17L48 61l-15.1 7.9 2.9-17-12.3-12 17-2.4z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#FFF0E8" />
          <path d="M48 22l22 8v18c0 14-10 23-22 27-12-4-22-13-22-27V30z" fill="#93C5FD" stroke="#3B82F6" strokeWidth="3" strokeLinejoin="round" />
          <path d="M48 34l3.5 7 7.5 1-5.5 5.2 1.3 7.5-6.8-3.6-6.8 3.6 1.3-7.5-5.5-5.2 7.5-1z" fill="#FDE047" />
        </svg>
      );
    case "pronoun-person":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#E6FBF1" />
          <circle cx="48" cy="36" r="12" fill="#6EE7B7" />
          <path d="M28 70c2-12 10-18 20-18s18 6 20 18" fill="#34D399" />
          <path d="M22 44h10M27 39l5 5-5 5" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case "pronoun-gift":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#E8F2FF" />
          <rect x="28" y="42" width="40" height="28" rx="6" fill="#93C5FD" />
          <rect x="24" y="34" width="48" height="10" rx="4" fill="#60A5FA" />
          <rect x="44" y="34" width="8" height="36" fill="#FDE047" />
          <path d="M48 34c-7-9-15-3-8 0M48 34c7-9 15-3 8 0" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "pronoun-home":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#F6EEFF" />
          <path d="M22 48l26-21 26 21v22H22z" fill="#DDD6FE" />
          <path d="M18 49l30-24 30 24" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="41" y="51" width="14" height="19" rx="3" fill="#FDE047" />
        </svg>
      );
    case "puzzle":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#FFF5DA" />
          <rect x="22" y="36" width="22" height="22" rx="5" fill="#F87171" />
          <rect x="40" y="36" width="22" height="22" rx="5" fill="#60A5FA" />
          <rect x="58" y="36" width="18" height="22" rx="5" fill="#34D399" />
          <circle cx="42" cy="47" r="4" fill="#60A5FA" />
          <circle cx="60" cy="47" r="4" fill="#34D399" />
        </svg>
      );
    case "whisk":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#FFF3D6" />
          <g transform="rotate(35 48 48)">
            <rect x="44" y="48" width="8" height="26" rx="4" fill="#F59E0B" />
            <ellipse cx="48" cy="34" rx="11" ry="16" fill="none" stroke="#64748B" strokeWidth="2.5" />
            <ellipse cx="48" cy="34" rx="6" ry="16" fill="none" stroke="#64748B" strokeWidth="2.2" />
            <line x1="48" y1="18" x2="48" y2="50" stroke="#64748B" strokeWidth="2.2" />
          </g>
        </svg>
      );
    case "spatula":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#FFEBF0" />
          <g transform="rotate(35 48 48)">
            <rect x="45" y="46" width="6" height="28" rx="3" fill="#D97706" />
            <rect x="36" y="20" width="24" height="26" rx="5" fill="#FB7185" />
            <line x1="43" y1="26" x2="43" y2="39" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="53" y1="26" x2="53" y2="39" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );
    case "pan":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#EEF2FF" />
          <circle cx="42" cy="48" r="20" fill="#475569" stroke="#94A3B8" strokeWidth="3" />
          <circle cx="42" cy="48" r="14" fill="#64748B" />
          <rect x="60" y="45" width="20" height="7" rx="3.5" fill="#D97706" />
          <circle cx="40" cy="48" r="6" fill="#FFFFFF" />
          <circle cx="41" cy="48" r="3" fill="#FBBF24" />
        </svg>
      );
    case "board":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#E8FAF0" />
          <rect x="24" y="30" width="44" height="36" rx="7" fill="#E6B88A" stroke="#C68B59" strokeWidth="2.5" />
          <circle cx="31" cy="37" r="3" fill="#E8FAF0" />
          <circle cx="48" cy="48" r="7" fill="#FB7185" />
          <circle cx="57" cy="54" r="4" fill="#4ADE80" />
        </svg>
      );
    case "bowl":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#FFF0E6" />
          <path d="M22 44h52c0 16-10 26-26 26S22 60 22 44z" fill="#FDA4AF" />
          <ellipse cx="48" cy="44" rx="26" ry="6" fill="#FEF3C7" />
          <circle cx="38" cy="55" r="2.5" fill="#FFFFFF" />
          <circle cx="52" cy="59" r="2.5" fill="#FFFFFF" />
          <circle cx="62" cy="52" r="2.5" fill="#FFFFFF" />
        </svg>
      );
    case "eggs":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#FFF7D9" />
          <ellipse cx="38" cy="50" rx="11" ry="15" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
          <ellipse cx="58" cy="52" rx="11" ry="15" fill="#E0F2FE" stroke="#60A5FA" strokeWidth="2" />
          <circle cx="58" cy="49" r="4" fill="#FFFFFF" opacity="0.7" />
        </svg>
      );
    case "herb":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#E6FAEE" />
          <path d="M48 70V30" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="37" cy="52" rx="10" ry="6" transform="rotate(-30 37 52)" fill="#4ADE80" />
          <ellipse cx="59" cy="46" rx="10" ry="6" transform="rotate(30 59 46)" fill="#22C55E" />
          <ellipse cx="48" cy="28" rx="7" ry="10" fill="#4ADE80" />
        </svg>
      );
    case "nutrition":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#F5EDFF" />
          <circle cx="48" cy="50" r="22" fill="#FFFFFF" stroke="#A78BFA" strokeWidth="3" />
          <path d="M48 50L48 28A22 22 0 0 1 68 58z" fill="#86EFAC" />
          <path d="M48 50L68 58A22 22 0 0 1 31 63z" fill="#FDE047" />
          <path d="M48 50L31 63A22 22 0 0 1 48 28z" fill="#FDA4AF" />
        </svg>
      );
    case "pancakes":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#FFEDF2" />
          <ellipse cx="48" cy="64" rx="26" ry="7" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <ellipse cx="48" cy="58" rx="19" ry="6" fill="#F6AD55" />
          <ellipse cx="48" cy="51" rx="18" ry="6" fill="#FBBF24" />
          <ellipse cx="48" cy="44" rx="17" ry="6" fill="#FCD34D" />
          <rect x="43" y="37" width="10" height="5" rx="2" fill="#FEF08A" />
          <circle cx="38" cy="44" r="3" fill="#FB7185" />
          <circle cx="57" cy="45" r="3" fill="#60A5FA" />
        </svg>
      );
    case "strawberry":
      return (
        <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
          <circle cx="48" cy="48" r="42" fill="#FFF0E8" />
          <path d="M48 72c-12 0-19-16-19-28 0-9 8-14 19-14s19 5 19 14c0 12-7 28-19 28z" fill="#FB7185" />
          <path d="M37 30l6-6 5 6 5-6 6 6-11 4z" fill="#22C55E" />
          <circle cx="42" cy="45" r="1.8" fill="#FEF08A" />
          <circle cx="54" cy="45" r="1.8" fill="#FEF08A" />
          <circle cx="48" cy="55" r="1.8" fill="#FEF08A" />
        </svg>
      );
  }
};
