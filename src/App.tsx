/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthGatekeeper } from './components/AuthGatekeeper';
import { HeaderNav } from './components/HeaderNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DashboardOverview } from './modules/Dashboard/DashboardOverview';
import { EmergenciaCriseModal } from './modules/EmergenciaCrise/EmergenciaCriseModal';
import { CalculadoraBpc } from './modules/JuridicoPrevidenciario/CalculadoraBpc';
import { SimuladorPericia } from './modules/JuridicoPrevidenciario/SimuladorPericia';
import { GerenciadorPrazos } from './modules/JuridicoPrevidenciario/GerenciadorPrazos';
import { AuditoriaPlanoSaude } from './modules/SaudeDireitos/AuditoriaPlanoSaude';
import { PassaporteSensorial } from './modules/SaudeDireitos/PassaporteSensorial';
import { PasseLivreMobilidade } from './modules/SaudeDireitos/PasseLivreMobilidade';
import { MaternidadeAtipicaTrabalho } from './modules/SaudeDireitos/MaternidadeAtipicaTrabalho';
import { EducacaoInclusiva } from './modules/EducacaoSocial/EducacaoInclusiva';
import { GuiaEstabelecimentos } from './modules/EducacaoSocial/GuiaEstabelecimentos';
import { CofreDocumentos } from './modules/DocumentosDossies/CofreDocumentos';
import { GeradorDossies } from './modules/DocumentosDossies/GeradorDossies';
import { AssistenteVozChat } from './modules/AssistenciaConversacional/AssistenteVozChat';
import { IntroScreen } from './components/IntroScreen';
import { QuickActionsMenu } from './components/QuickActionsMenu';

function MainAppContent() {
  const { isAuthenticated } = useAuth();
  const [showIntro, setShowIntro] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  // Neurodivergent Sensory Accessibility states
  const [calmMode, setCalmMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  // Apply sensory modifications to body
  useEffect(() => {
    if (calmMode) {
      document.body.classList.add('calm-mode');
    } else {
      document.body.classList.remove('calm-mode');
    }

    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (dyslexicFont) {
      document.body.classList.add('dyslexic-friendly');
    } else {
      document.body.classList.remove('dyslexic-friendly');
    }
  }, [calmMode, highContrast, dyslexicFont]);

  // Initial Welcome Splash with Logo and Puzzle Assembly
  if (showIntro) {
    return <IntroScreen onStart={() => setShowIntro(false)} />;
  }

  // Mandatory Security Access: No access without Gov.br or Validated Registration
  if (!isAuthenticated) {
    return <AuthGatekeeper />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      {/* Header and Navigation Bar */}
      <HeaderNav
        onOpenSos={() => setIsSosOpen(true)}
        onOpenSensorialPassport={() => setActiveSection('passaporte')}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        calmMode={calmMode}
        setCalmMode={setCalmMode}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        dyslexicFont={dyslexicFont}
        setDyslexicFont={setDyslexicFont}
        speechEnabled={speechEnabled}
        setSpeechEnabled={setSpeechEnabled}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeSection === 'dashboard' && (
          <DashboardOverview
            onNavigate={(sec) => setActiveSection(sec)}
            onOpenSos={() => setIsSosOpen(true)}
            onOpenSensorialPassport={() => setActiveSection('passaporte')}
          />
        )}

        {activeSection === 'emergencia' && (
          <div className="space-y-4">
            <button
              onClick={() => setIsSosOpen(true)}
              className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:brightness-110 text-white font-black py-4 px-6 rounded-2xl shadow-xl transition active:scale-95 text-base flex items-center justify-center gap-2"
            >
              <span>Abrir Central de Emergência, Acolhimento e Flagrante em Tela Cheia</span>
            </button>
            <DashboardOverview
              onNavigate={(sec) => setActiveSection(sec)}
              onOpenSos={() => setIsSosOpen(true)}
              onOpenSensorialPassport={() => setActiveSection('passaporte')}
            />
          </div>
        )}

        {activeSection === 'bpc' && <CalculadoraBpc />}
        {activeSection === 'pericia' && <SimuladorPericia />}
        {activeSection === 'prazos' && <GerenciadorPrazos />}
        {activeSection === 'saude' && <AuditoriaPlanoSaude />}
        {activeSection === 'passaporte' && <PassaporteSensorial />}
        {activeSection === 'mobilidade' && <PasseLivreMobilidade />}
        {activeSection === 'trabalho' && <MaternidadeAtipicaTrabalho />}
        {activeSection === 'educacao' && <EducacaoInclusiva />}
        {activeSection === 'estabelecimentos' && <GuiaEstabelecimentos />}
        {activeSection === 'cofre' && <CofreDocumentos />}
        {activeSection === 'dossies' && <GeradorDossies />}
        {activeSection === 'chat_ia' && <AssistenteVozChat />}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-800 bg-slate-900/60 py-6 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">GuiaLegal TEA</span>
            <span>•</span>
            <span>Autodefesa e Gestão de Direitos para Famílias Atípicas</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button onClick={() => setActiveSection('bpc')} className="hover:text-teal-400">
              BPC/LOAS 2026
            </button>
            <button onClick={() => setActiveSection('saude')} className="hover:text-teal-400">
              RN 469/539 ANS
            </button>
            <button onClick={() => setActiveSection('educacao')} className="hover:text-teal-400">
              STF ADI 5357
            </button>
            <button onClick={() => setActiveSection('trabalho')} className="hover:text-teal-400">
              Tema 1097 STF
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Quick Actions Menu (One-tap speed dial for frequently used modules) */}
      <QuickActionsMenu
        isOpen={isQuickActionsOpen}
        onToggle={() => setIsQuickActionsOpen((prev) => !prev)}
        onClose={() => setIsQuickActionsOpen(false)}
        onNavigate={(sec) => setActiveSection(sec)}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenSensorialPassport={() => setActiveSection('passaporte')}
        currentSection={activeSection}
      />

      {/* Emergency Fullscreen Modal */}
      <EmergenciaCriseModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />

      {/* PWA Offline Notification Indicator */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
