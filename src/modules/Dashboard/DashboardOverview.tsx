import React from 'react';
import {
  ShieldAlert,
  Calculator,
  Stethoscope,
  Heart,
  QrCode,
  Bus,
  GraduationCap,
  Building,
  FolderLock,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  Phone,
  Scale,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DashboardOverviewProps {
  onNavigate: (section: string) => void;
  onOpenSos: () => void;
  onOpenSensorialPassport: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigate,
  onOpenSos,
  onOpenSensorialPassport,
}) => {
  const { user } = useAuth();

  const modulos = [
    {
      id: 'emergencia',
      title: 'SOS Crise & Flagrante',
      desc: 'Acolhimento sensorial imediato, guia de respiração, gravador probatório e artigos de lei na tela.',
      icon: ShieldAlert,
      badge: 'Urgência',
      color: 'from-red-600 to-rose-700',
      action: onOpenSos,
    },
    {
      id: 'bpc',
      title: 'Calculadora de BPC/LOAS',
      desc: 'Cálculo com salário mínimo 2026 (R$ 1.518), deduções de saúde da Lei 14.176/21 e memorial descritivo.',
      icon: Calculator,
      badge: 'Previdenciário',
      color: 'from-teal-600 to-emerald-700',
    },
    {
      id: 'pericia',
      title: 'Simulador de Perícia INSS',
      desc: 'Perguntas simuladas da Avaliação Social e Médica (CIF) e direitos na sala de perícia.',
      icon: Stethoscope,
      badge: 'Biopsicossocial',
      color: 'from-sky-600 to-blue-700',
    },
    {
      id: 'prazos',
      title: 'Gerenciador de Prazos',
      desc: 'Controle de prazos de recursos, perícias e respostas de órgãos, com alertas de vencimento.',
      icon: Clock,
      badge: 'Prazos & Recursos',
      color: 'from-amber-700 to-orange-800',
    },
    {
      id: 'cofre',
      title: 'Cofre de Documentos',
      desc: 'Laudos, CIPTEA e receitas guardados com sigilo e acesso offline.',
      icon: FolderLock,
      badge: 'Segurança',
      color: 'from-emerald-700 to-teal-800',
    },
    {
      id: 'saude',
      title: 'Auditoria de Plano de Saúde',
      desc: 'Fiscalize negativas de ABA, fono e TO conforme as RNs 469/539 da ANS e Lei 14.454/22.',
      icon: Heart,
      badge: 'Saúde Suplementar',
      color: 'from-cyan-600 to-teal-700',
    },
    {
      id: 'passaporte',
      title: 'Passaporte Sensorial Digital',
      desc: 'Credencial rápida com gatilhos, autorregulações, contatos de socorro e código QR para tela cheia.',
      icon: QrCode,
      badge: 'Credencial Oficial',
      color: 'from-teal-700 to-cyan-800',
      action: onOpenSensorialPassport,
    },
    {
      id: 'educacao',
      title: 'Educação Inclusiva & PEI',
      desc: 'Proibição de taxa extra (STF ADI 5357), profissional de apoio e notificação escolar pronta.',
      icon: GraduationCap,
      badge: 'Educação',
      color: 'from-emerald-700 to-teal-800',
    },
    {
      id: 'mobilidade',
      title: 'Passe Livre & Mobilidade',
      desc: 'Passe Livre Interestadual com acompanhante gratuito e isenções tributárias para veículos PcD.',
      icon: Bus,
      badge: 'Mobilidade',
      color: 'from-blue-700 to-indigo-800',
    },
    {
      id: 'trabalho',
      title: 'Maternidade Atípica & Trabalho',
      desc: 'Redução de jornada sem redução salarial para servidores e celetistas (Tema 1097 STF).',
      icon: Scale,
      badge: 'Direito do Trabalho',
      color: 'from-rose-700 to-amber-800',
    },
    {
      id: 'estabelecimentos',
      title: 'Guia de Locais Inclusivos',
      desc: 'Supermercados com horário silencioso, cinemas com Sessão Azul e espaços com acomodação sensorial.',
      icon: Building,
      badge: 'Comunidade',
      color: 'from-indigo-700 to-slate-800',
    },
    {
      id: 'dossies',
      title: 'Dossiês Jurídicos Prontos',
      desc: 'Petições formais timbradas para o Ministério Público, ANS, INSS e Departamentos de RH.',
      icon: FileText,
      badge: 'Petições Oficiais',
      color: 'from-slate-700 to-teal-900',
    },
    {
      id: 'chat_ia',
      title: 'Assistente IA & Voz',
      desc: 'Inteligência Artificial Gemini para triagem de violações e tira-dúvidas jurídicas por voz.',
      icon: MessageSquare,
      badge: 'IA Gemini',
      color: 'from-amber-600 to-rose-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner with Official Logo Fidelity */}
      <div className="bg-gradient-to-br from-[#0F233D] via-slate-900 to-[#0F233D] border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow behind logo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-6">
          <div className="space-y-3 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                <span>
                  {user?.authProvider === 'govbr'
                    ? `Autenticado via gov.br (Nível ${user.govBrLevel ? user.govBrLevel.toUpperCase() : 'OURO'})`
                    : 'Acesso Protegido • Cadastro com Laudo Validado'}
                </span>
              </span>
              <span className="text-xs text-slate-400 font-medium">CPF: {user?.cpf}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Olá, {user?.nome?.split(' ')[0] || 'Cidadão'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bem-vindo(a) à plataforma central do <strong>GuiaLegal TEA</strong>. Aqui você exerce a autodefesa jurídica e a gestão plena de direitos com ferramentas de acolhimento sensorial, cálculo de BPC/LOAS, auditoria de planos de saúde e triagem assistida por Inteligência Artificial.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenSos}
                className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:brightness-110 text-white font-extrabold px-5 py-3 rounded-xl shadow-lg transition active:scale-95 text-xs sm:text-sm flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>SOS Emergência & Crise</span>
              </button>

              <button
                onClick={onOpenSensorialPassport}
                className="bg-teal-600/30 hover:bg-teal-600/40 text-teal-200 border border-teal-500/50 font-bold px-4 py-3 rounded-xl transition text-xs sm:text-sm flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-teal-400" />
                <span>Abrir Passaporte Sensorial</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Indicator Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Salário Mínimo (2026)</span>
          <div className="text-lg sm:text-xl font-black text-teal-300 mt-1">R$ 1.518,00</div>
          <span className="text-[10px] text-slate-500">Base oficial para BPC e limites</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Deduções de Saúde</span>
          <div className="text-lg sm:text-xl font-black text-emerald-400 mt-1">Lei 14.176/21</div>
          <span className="text-[10px] text-slate-500">Remédios e terapias dedutíveis</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Sessões de Terapias</span>
          <div className="text-lg sm:text-xl font-black text-cyan-400 mt-1">SEM LIMITE</div>
          <span className="text-[10px] text-slate-500">RNs 469 e 539 ANS / STJ</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Taxa Extra Escolar</span>
          <div className="text-lg sm:text-xl font-black text-rose-400 mt-1">CRIME (STF)</div>
          <span className="text-[10px] text-slate-500">ADI 5357 e Lei 7.853/89</span>
        </div>
      </div>

      {/* Interactive Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
            <span>Módulos de Autodefesa e Gestão de Direitos</span>
          </h2>
          <span className="text-xs text-slate-400">{modulos.length} Ferramentas Ativas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulos.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                role="button"
                tabIndex={0}
                aria-label={`Abrir módulo: ${mod.title}`}
                onClick={() => (mod.action ? mod.action() : onNavigate(mod.id))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (mod.action) mod.action();
                    else onNavigate(mod.id);
                  }
                }}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-teal-500/40 rounded-3xl p-5 sm:p-6 transition cursor-pointer shadow-lg hover:shadow-teal-950/20 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-slate-800">
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-white text-base group-hover:text-teal-300 transition">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{mod.desc}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-teal-400 font-bold">
                  <span>Acessar Módulo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
