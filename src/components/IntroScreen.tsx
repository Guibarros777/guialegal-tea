import React from 'react';
import { ArrowRight } from 'lucide-react';
import { IntroPuzzleBackground } from './IntroPuzzleBackground';

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#071322] text-slate-100 select-none px-4">
      {/* Background Animated Puzzle Assembling in the Logo Colors */}
      <IntroPuzzleBackground />

      {/* Main Centered Content: ONLY the Logo, Name, and Iniciar button (No frame/quadro) */}
      <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700 max-w-lg w-full px-4">
        {/* Logo Container - 100% faithful to the photo with no color-distorting filters */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center p-2 transform transition duration-500 hover:scale-105">
            <img
              src="/logo_mark.png"
              alt="Símbolo Oficial GuiaLegal TEA"
              className="w-full h-full object-contain filter drop-shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>

        {/* Brand Name directly underneath */}
        <div className="mt-6 sm:mt-7 space-y-1.5">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
            <span>GuiaLegal</span> <span className="text-teal-400">TEA</span>
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-200 tracking-[0.25em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            Cidadania & Direitos
          </p>
        </div>

        {/* Prominent Iniciar Button */}
        <div className="mt-8 sm:mt-10">
          <button
            onClick={onStart}
            autoFocus
            className="group relative flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-base sm:text-lg shadow-2xl shadow-cyan-900/60 hover:shadow-cyan-400/50 transform transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Iniciar navegação no GuiaLegal TEA"
          >
            <span>Iniciar</span>
            <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1.5 transition duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
