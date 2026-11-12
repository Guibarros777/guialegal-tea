import React, { useState } from 'react';
import {
  ShieldAlert,
  Sliders,
  LogOut,
  User,
  Volume2,
  VolumeX,
  Eye,
  Type,
  Sun,
  Moon,
  Sparkles,
  PhoneCall,
  Menu,
  X,
  FileCheck2,
  QrCode,
  Heart,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../context/AuthContext';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderNavProps {
  onOpenSos: () => void;
  onOpenSensorialPassport: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  calmMode: boolean;
  setCalmMode: (v: boolean) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  dyslexicFont: boolean;
  setDyslexicFont: (v: boolean) => void;
  speechEnabled: boolean;
  setSpeechEnabled: (v: boolean) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenSos,
  onOpenSensorialPassport,
  activeSection,
  setActiveSection,
  calmMode,
  setCalmMode,
  highContrast,
  setHighContrast,
  dyslexicFont,
  setDyslexicFont,
  speechEnabled,
  setSpeechEnabled,
}) => {
  const { user, logout } = useAuth();
  const [showAcessibilidadeMenu, setShowAcessibilidadeMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const sections = [
    { id: 'dashboard', label: 'Início & Resumo' },
    { id: 'emergencia', label: 'Crise & Urgência' },
    { id: 'bpc', label: 'Calculadora BPC' },
    { id: 'pericia', label: 'Simulador Perícia' },
    { id: 'saude', label: 'Planos & Terapias' },
    { id: 'passaporte', label: 'Passaporte Sensorial' },
    { id: 'educacao', label: 'Educação Inclusiva' },
    { id: 'estabelecimentos', label: 'Guia Inclusivo' },
    { id: 'dossies', label: 'Dossiês Jurídicos' },
    { id: 'chat_ia', label: 'Assistente IA' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Brand Logo with exact visual identity - only logo icon */}
          <button
            onClick={() => {
              setActiveSection('dashboard');
              setMobileNavOpen(false);
            }}
            className="text-left focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-2xl group transition transform hover:scale-105"
            aria-label="Ir para a página inicial do GuiaLegal TEA"
          >
            <BrandLogo size="md" showText={false} />
          </button>

          {/* Action Center & Accessibilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* SOS Crise / Flagrante Button - Prominent red/amber button */}
            <button
              onClick={onOpenSos}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:brightness-110 text-white font-extrabold px-3 sm:px-4 py-2 rounded-xl shadow-lg shadow-red-950/40 transition active:scale-95 text-xs sm:text-sm animate-pulse"
              aria-label="Botão de Emergência SOS e Direitos de Flagrante"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-white" />
              <span>SOS Crise</span>
            </button>

            {/* Quick Passport Shortcut */}
            <button
              onClick={onOpenSensorialPassport}
              className="hidden md:flex items-center gap-1.5 bg-teal-950/60 hover:bg-teal-900/80 border border-teal-500/40 text-teal-300 font-semibold px-3 py-2 rounded-xl text-xs transition"
              title="Apresentar Passaporte Sensorial"
            >
              <QrCode className="w-3.5 h-3.5 text-teal-400" />
              <span>Passaporte</span>
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton compact />

            {/* Accessibility Popover Toggle */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowAcessibilidadeMenu(!showAcessibilidadeMenu);
                  setShowUserMenu(false);
                }}
                className={`p-2 rounded-xl border transition ${
                  calmMode || highContrast || dyslexicFont
                    ? 'bg-teal-950 border-teal-500 text-teal-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                }`}
                aria-label="Configurações de acessibilidade sensorial"
                title="Acessibilidade Sensorial"
              >
                <Sliders className="w-4 h-4" />
              </button>

              {showAcessibilidadeMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-xs space-y-3">
                  <div className="font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
                    <span>Acomodações Sensoriais</span>
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-800/60 transition">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-sky-400" />
                        <div>
                          <div className="font-semibold text-slate-200">Modo Calmo</div>
                          <div className="text-[10px] text-slate-400">Suaviza luzes e estímulos</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={calmMode}
                        onChange={(e) => setCalmMode(e.target.checked)}
                        className="rounded text-teal-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-800/60 transition">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-amber-400" />
                        <div>
                          <div className="font-semibold text-slate-200">Alto Contraste</div>
                          <div className="text-[10px] text-slate-400">Aumenta definição de bordas</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={highContrast}
                        onChange={(e) => setHighContrast(e.target.checked)}
                        className="rounded text-teal-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-800/60 transition">
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 text-teal-400" />
                        <div>
                          <div className="font-semibold text-slate-200">Leitura Facilitada</div>
                          <div className="text-[10px] text-slate-400">Maior espaçamento entre letras</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={dyslexicFont}
                        onChange={(e) => setDyslexicFont(e.target.checked)}
                        className="rounded text-teal-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-800/60 transition">
                      <div className="flex items-center gap-2">
                        {speechEnabled ? (
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-slate-500" />
                        )}
                        <div>
                          <div className="font-semibold text-slate-200">Voz e Narração</div>
                          <div className="text-[10px] text-slate-400">Leitura em áudio de textos</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={speechEnabled}
                        onChange={(e) => setSpeechEnabled(e.target.checked)}
                        className="rounded text-teal-500"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* User Session Profile & Gov.br Badge */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowAcessibilidadeMenu(false);
                }}
                className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 transition text-xs"
                aria-label="Opções da conta e perfil do usuário"
              >
                <div className="w-6 h-6 rounded-full bg-teal-600/30 text-teal-300 flex items-center justify-center font-bold text-xs">
                  {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-semibold text-white max-w-[120px] truncate">
                    {user?.nome ? user.nome.split(' ')[0] : 'Cidadão'}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    {user?.authProvider === 'govbr'
                      ? `gov.br ${user.govBrLevel ? user.govBrLevel.toUpperCase() : 'OURO'}`
                      : 'Laudo Validado'}
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-xs space-y-3">
                  <div className="border-b border-slate-800 pb-3">
                    <div className="font-bold text-white text-sm">{user?.nome}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">CPF: {user?.cpf}</div>
                    <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px] font-semibold">
                      <FileCheck2 className="w-3 h-3" />
                      <span>
                        {user?.authProvider === 'govbr'
                          ? `Conta gov.br Selo ${user?.govBrLevel?.toUpperCase()}`
                          : 'Cadastro Validado com Laudo'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>
                      <strong className="text-slate-400">Perfil:</strong>{' '}
                      {user?.tipoUsuario === 'mae_pai_atipico'
                        ? 'Mãe / Pai Atípico'
                        : user?.tipoUsuario === 'autista_autodefensor'
                        ? 'Pessoa Autista'
                        : 'Responsável Legal'}
                    </div>
                    <div>
                      <strong className="text-slate-400">CID:</strong> {user?.laudo.cid}
                    </div>
                    <div>
                      <strong className="text-slate-400">CIPTEA:</strong>{' '}
                      {user?.laudo.possuiCiptea ? user.laudo.numeroCiptea || 'Ativa' : 'Não cadastrada'}
                    </div>
                    <div>
                      <strong className="text-slate-400">Local:</strong> {user?.cidade}/{user?.uf}
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-2">
                    <button
                      onClick={logout}
                      className="w-full flex items-center justify-center gap-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 font-semibold py-2 rounded-xl transition border border-red-800/40 text-xs"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Encerrar Sessão Segura</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white"
              aria-label="Abrir menu de navegação"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Bar */}
        <nav
          className="hidden lg:flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-slate-800/60"
          aria-label="Navegação Principal"
        >
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeSection === sec.id
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileNavOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-1.5 shadow-2xl animate-in slide-in-from-top-2">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSection(sec.id);
                setMobileNavOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                activeSection === sec.id
                  ? 'bg-teal-600 text-white font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{sec.label}</span>
              {activeSection === sec.id && <div className="w-2 h-2 rounded-full bg-white" />}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
