import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  X,
  Stethoscope,
  FolderLock,
  Calculator,
  Heart,
  QrCode,
  ShieldAlert,
  FileText,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface QuickActionsMenuProps {
  onNavigate: (section: string) => void;
  onOpenSos: () => void;
  onOpenSensorialPassport: () => void;
  currentSection?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeColor: string;
  action?: () => void;
}

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
  onNavigate,
  onOpenSos,
  onOpenSensorialPassport,
  currentSection,
  isOpen: controlledIsOpen,
  onToggle,
  onClose,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof controlledIsOpen === 'boolean';
  const isOpen = isControlled ? controlledIsOpen : internalOpen;

  const closeMenu = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalOpen(false);
    }
  };

  const toggleMenu = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
      // Alt + A shortcut to toggle Quick Actions
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        toggleMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isControlled]);

  // Close when clicking outside the menu container
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const quickActions: QuickActionItem[] = [
    {
      id: 'pericia',
      title: 'Simulador de Perícia INSS',
      subtitle: 'Perguntas biopsicossociais CIF & direitos em sala',
      tag: 'Mais Usado',
      icon: Stethoscope,
      color: 'from-sky-500 to-blue-600',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    },
    {
      id: 'cofre',
      title: 'Cofre de Documentos',
      subtitle: 'Laudos, CIPTEA e receitas com sigilo offline',
      tag: 'Segurança',
      icon: FolderLock,
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'bpc',
      title: 'Calculadora BPC/LOAS 2026',
      subtitle: 'Deduções de saúde da Lei 14.176/21 e renda per capita',
      tag: 'R$ 1.518',
      icon: Calculator,
      color: 'from-teal-500 to-cyan-600',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    },
    {
      id: 'saude',
      title: 'Auditoria de Plano de Saúde',
      subtitle: 'Notificação contra negativas de ABA/Fono/TO (RN 469/539)',
      tag: 'ANS 48h',
      icon: Heart,
      color: 'from-rose-500 to-amber-600',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'passaporte',
      title: 'Passaporte Sensorial Digital',
      subtitle: 'Apresentar gatilhos, socorro e QR Code em tela cheia',
      tag: 'Credencial',
      icon: QrCode,
      color: 'from-purple-500 to-indigo-600',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      action: onOpenSensorialPassport,
    },
    {
      id: 'dossies',
      title: 'Gerador de Dossiês Jurídicos',
      subtitle: 'Petições formatadas para Ministério Público e Escolas',
      tag: 'Petições',
      icon: FileText,
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'emergencia',
      title: 'SOS Crise & Flagrante',
      subtitle: 'Descompressão imediata 4-7-8 e escudo probatório',
      tag: 'Urgência',
      icon: ShieldAlert,
      color: 'from-red-600 to-rose-700',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
      action: onOpenSos,
    },
  ];

  const handleSelect = (item: QuickActionItem) => {
    closeMenu();
    if (item.action) {
      item.action();
    } else {
      onNavigate(item.id);
    }
  };

  return (
    <div ref={menuRef} className="no-print fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Quick Actions Panel */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Menu de Ações Rápidas"
          className="mb-3 w-[92vw] max-w-sm sm:max-w-md bg-slate-900/95 backdrop-blur-xl border border-teal-500/40 rounded-3xl shadow-2xl shadow-slate-950/80 p-4 sm:p-5 text-slate-100 animate-in fade-in slide-in-from-bottom-5 duration-200 select-none overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 shadow-md">
                <Zap className="w-4 h-4 fill-slate-950" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span>Ações Rápidas</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">
                    1 Toque
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Atalhos imediatos para os módulos essenciais</p>
              </div>
            </div>

            <button
              onClick={closeMenu}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Fechar menu de ações rápidas"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions List */}
          <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1 -mr-1 custom-scrollbar">
            {quickActions.map((item) => {
              const Icon = item.icon;
              const isCurrent = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left p-2.5 sm:p-3 rounded-2xl border transition flex items-center justify-between gap-3 group ${
                    isCurrent
                      ? 'bg-teal-950/50 border-teal-500/50 text-white'
                      : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-teal-300 transition">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                    >
                      {item.tag}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-300 group-hover:translate-x-0.5 transition" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer note & shortcut */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-400">
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span>Acesso instantâneo sem recarregar</span>
            </span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[9px] border border-slate-700">
              Alt + A
            </kbd>
          </div>
        </div>
      )}

      {/* Floating Speed Dial Trigger Button */}
      <button
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Abrir menu flutuante de ações rápidas"
        className={`group relative flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 active:scale-95 border ${
          isOpen
            ? 'bg-slate-800 border-teal-400 text-white shadow-teal-950/60'
            : 'bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:brightness-110 border-teal-300/40 text-slate-950 shadow-cyan-900/40 hover:shadow-cyan-400/30 hover:scale-105'
        }`}
      >
        <div
          className={`transition-transform duration-300 flex items-center justify-center ${
            isOpen ? 'rotate-90' : 'group-hover:scale-110'
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-teal-300" />
          ) : (
            <Zap className="w-5 h-5 fill-slate-950 text-slate-950" />
          )}
        </div>

        <span
          className={`text-xs sm:text-sm font-black tracking-wide ${
            isOpen ? 'text-teal-200' : 'text-slate-950'
          }`}
        >
          {isOpen ? 'Fechar' : 'Ações Rápidas'}
        </span>

        {/* Pulse beacon for first discovery */}
        {!isOpen && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950"></span>
          </span>
        )}
      </button>
    </div>
  );
};
