import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        aria-label="Instalar GuiaLegal TEA no seu dispositivo"
        className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:from-teal-600 hover:to-cyan-700 transition active:scale-95 ${
          compact ? 'px-2 py-1 text-xs' : ''
        }`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          aria-label="Como instalar no iPhone ou iPad"
          className={`flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-950/40 px-3 py-1.5 text-xs font-medium text-teal-200 hover:bg-teal-900/60 transition ${
            compact ? 'px-2 py-1 text-xs' : ''
          }`}
        >
          <Download className="w-3.5 h-3.5 text-teal-400" />
          <span>Instalar no iOS</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-modal-title"
          >
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                aria-label="Fechar instruções"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="ios-modal-title" className="text-base font-bold text-white">
                    Instalar GuiaLegal TEA
                  </h3>
                  <p className="text-xs text-slate-400">No iPhone ou iPad (Safari)</p>
                </div>
              </div>

              <div className="space-y-3.5 text-sm text-slate-300 bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-xs leading-relaxed">
                    Toque no botão <strong className="text-white flex items-center gap-1 inline-flex"><Share2 className="w-3 h-3 text-cyan-400" /> Compartilhar</strong> na barra inferior do Safari.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-xs leading-relaxed">
                    Role as opções e selecione <strong className="text-white flex items-center gap-1 inline-flex"><PlusSquare className="w-3 h-3 text-cyan-400" /> Adicionar à Tela de Início</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-xs leading-relaxed">
                    Toque em <strong className="text-white">Adicionar</strong> no canto superior direito para acesso rápido mesmo sem internet!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-teal-600 hover:bg-teal-500 py-2.5 text-xs font-semibold text-white transition shadow"
              >
                Entendi, continuar
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
