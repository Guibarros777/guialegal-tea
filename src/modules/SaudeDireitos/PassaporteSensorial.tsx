import React, { useState } from 'react';
import {
  QrCode,
  Maximize2,
  Minimize2,
  Printer,
  ShieldCheck,
  Heart,
  VolumeX,
  Eye,
  AlertCircle,
  Phone,
  Sparkles,
  Edit3,
  Check,
  User,
  Activity,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/BrandLogo';
import { PassaporteSensorial as IPassaporteSensorial } from '../../types';

export const PassaporteSensorial: React.FC = () => {
  const { user } = useAuth();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [passaporte, setPassaporte] = useState<IPassaporteSensorial>({
    nomeCompleto: user?.nome || 'Alexandre Silva Santos',
    nomeSocialOuAfetivo: 'Ale',
    idadeOuDataNascimento: user?.dataNascimento || '10/05/2016 (8 anos)',
    cid: user?.laudo.cid || 'CID-10 F84.0 (Autismo Infantil)',
    comunicacao: 'comunicacao_alternativa',
    detalhesComunicacao:
      'Comunica-se por frases curtas e aplicativo de pranchas de comunicação alternativa (CAA/PECS). Em momentos de sobrecarga ou crise, pode entrar em mutismo seletivo ou shutdown.',
    gatilhos: [
      'Sons agudos e sirenes altas',
      'Luzes fluorescentes piscantes ou estroboscópicas',
      'Toque físico surpresa ou sem aviso prévio',
      'Aglomeração em filas e espaços confinados',
      'Cheiros intensos de perfumes ou produtos químicos',
    ],
    estrategiasAutorregulacao: [
      'Uso imediato de abafadores de ruído (headphone)',
      'Mordedor sensorial e brinquedo de estímulo tátil',
      'Permanência em local com meia-luz e silêncio',
      'Compressão profunda (abraço firme ou peso nos ombros)',
      'Manter frases simples e diretas, sem cobrança de contato visual',
    ],
    necessidadesAcomodacao: [
      'Prioridade absoluta no embarque ou atendimento (Lei 13.977/20)',
      'Autorização para permanência com fone de ouvido em qualquer ambiente',
      'Acompanhante permanente garantido por lei',
      'Alimentação especial trazida de casa devido à seletividade',
    ],
    alergiasAlimentares: 'Intolerância severa a lactose e glúten. Risco de choque anafilático a amendoim.',
    medicamentosUsoContinuo: 'Risperidona 0.5mg (noite) e Melatonina 3mg.',
    contatoEmergenciaNome: 'Mariana Silva Santos (Mãe)',
    contatoEmergenciaParentesco: 'Mãe / Representante Legal',
    contatoEmergenciaTelefone: user?.telefone || '(11) 98765-4321',
  });

  const [novoGatilho, setNovoGatilho] = useState('');
  const [novaEstrategia, setNovaEstrategia] = useState('');

  const addGatilho = () => {
    if (!novoGatilho.trim()) return;
    setPassaporte({ ...passaporte, gatilhos: [...passaporte.gatilhos, novoGatilho.trim()] });
    setNovoGatilho('');
  };

  const removeGatilho = (idx: number) => {
    setPassaporte({
      ...passaporte,
      gatilhos: passaporte.gatilhos.filter((_, i) => i !== idx),
    });
  };

  const addEstrategia = () => {
    if (!novaEstrategia.trim()) return;
    setPassaporte({
      ...passaporte,
      estrategiasAutorregulacao: [...passaporte.estrategiasAutorregulacao, novaEstrategia.trim()],
    });
    setNovaEstrategia('');
  };

  const removeEstrategia = (idx: number) => {
    setPassaporte({
      ...passaporte,
      estrategiasAutorregulacao: passaporte.estrategiasAutorregulacao.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-950 p-6 rounded-3xl border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-bold uppercase mb-2 border border-teal-500/30">
            <QrCode className="w-3.5 h-3.5" />
            Credencial Oficial Sensorial • Lei Romeo Mion
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Passaporte Sensorial Digital & Credencial TEA
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Apresente em aeroportos, voos, hospitais, escolas e abordagens policiais para comunicar imediatamente as necessidades sensoriais, gatilhos, formas de comunicação e contatos de emergência sem gerar sobrecarga.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-lg"
          >
            {isFullScreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span>Sair da Tela Cheia</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span>Apresentar em Tela Cheia</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
          >
            <Edit3 className="w-4 h-4 text-teal-400" />
            <span>{isEditing ? 'Concluir Edição' : 'Editar Dados'}</span>
          </button>
        </div>
      </div>

      {/* THE OFFICIAL SENSORY PASSPORT CARD CONTAINER */}
      <div
        className={`transition-all duration-300 ${
          isFullScreen
            ? 'fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl p-4 sm:p-8 overflow-y-auto flex flex-col items-center justify-center'
            : ''
        }`}
      >
        <div className="w-full max-w-3xl rounded-3xl bg-gradient-to-b from-[#0F233D] via-slate-900 to-[#0F233D] border-2 border-teal-500/50 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-slate-100 relative">
          {/* Watermark brand motif */}
          <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-10 pointer-events-none w-80 h-80">
            <img src="/logo_mark.png" alt="marca d'água" className="w-full h-full object-contain" />
          </div>

          {/* Card Header with Brand Logo & QR Code */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-teal-500/40 shrink-0">
                <img
                  src="/app_icon.png"
                  alt="Logo Oficial"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 text-[10px] font-extrabold uppercase border border-teal-700/60 tracking-wider">
                  PASSAPORTE SENSORIAL & AUTODEFESA
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
                  {passaporte.nomeCompleto}
                </h3>
                <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                  <span>Nome Afetivo: <strong>{passaporte.nomeSocialOuAfetivo}</strong></span>
                  <span>•</span>
                  <span>{passaporte.idadeOuDataNascimento}</span>
                </div>
              </div>
            </div>

            {/* Visual QR Code Badge */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-teal-500/40 text-center shrink-0 self-center sm:self-auto shadow-lg">
              <div className="w-20 h-20 bg-white p-1 rounded-xl mx-auto flex items-center justify-center">
                <div className="grid grid-cols-5 gap-1 w-full h-full p-1 bg-black rounded-lg">
                  <div className="bg-white col-span-2 row-span-2 rounded-sm" />
                  <div className="bg-white" />
                  <div className="bg-white col-span-2 row-span-2 rounded-sm" />
                  <div className="bg-white" />
                  <div className="bg-white col-span-3" />
                  <div className="bg-white col-span-2 row-span-2 rounded-sm" />
                  <div className="bg-white" />
                  <div className="bg-white col-span-2 row-span-2 rounded-sm" />
                </div>
              </div>
              <div className="text-[9px] font-bold text-teal-300 mt-1 uppercase">
                Verificação Rápida
              </div>
            </div>
          </div>

          {/* Diagnostics and CIPTEA Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Diagnóstico Formal</span>
              <span className="font-bold text-teal-300 text-sm">{passaporte.cid}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Carteira CIPTEA (Lei 13.977/20)</span>
              <span className="font-bold text-emerald-400 text-sm">
                {user?.laudo.numeroCiptea || 'CIPTEA-SP-2024-9912'} (Ativa e Válida)
              </span>
            </div>
          </div>

          {/* Communication Style */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Forma de Comunicação & Expressão</span>
            </h4>
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
              {passaporte.detalhesComunicacao}
            </div>
          </div>

          {/* Sensory Triggers & Calming Strategies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gatilhos */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-red-500/30 space-y-2">
              <div className="text-xs font-extrabold text-red-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  Gatilhos de Sobrecarga (Evitar)
                </span>
                <span className="text-[10px] text-red-400">{passaporte.gatilhos.length}</span>
              </div>

              <div className="space-y-1.5">
                {passaporte.gatilhos.map((gat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-red-950/30 border border-red-800/40 rounded-xl px-2.5 py-1.5 text-red-200"
                  >
                    <span>• {gat}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeGatilho(idx)}
                        className="text-red-400 hover:text-white text-[10px] ml-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={novoGatilho}
                    onChange={(e) => setNovoGatilho(e.target.value)}
                    placeholder="Adicionar gatilho..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                  />
                  <button
                    onClick={addGatilho}
                    className="bg-red-600 px-2.5 py-1 rounded-lg text-xs font-bold text-white"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {/* Estratégias */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-teal-500/30 space-y-2">
              <div className="text-xs font-extrabold text-teal-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-teal-400" />
                  Como Ajudar a Acalmar
                </span>
                <span className="text-[10px] text-teal-400">
                  {passaporte.estrategiasAutorregulacao.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {passaporte.estrategiasAutorregulacao.map((est, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs bg-teal-950/30 border border-teal-800/40 rounded-xl px-2.5 py-1.5 text-teal-200"
                  >
                    <span>✓ {est}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeEstrategia(idx)}
                        className="text-teal-400 hover:text-white text-[10px] ml-2"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={novaEstrategia}
                    onChange={(e) => setNovaEstrategia(e.target.value)}
                    placeholder="Adicionar regulação..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                  />
                  <button
                    onClick={addEstrategia}
                    className="bg-teal-600 px-2.5 py-1 rounded-lg text-xs font-bold text-white"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Health & Emergency Contacts Footer */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Contato Imediato de Emergência (Anjo Guardião)
              </span>
              <div className="font-extrabold text-white text-sm flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{passaporte.contatoEmergenciaNome} ({passaporte.contatoEmergenciaParentesco})</span>
              </div>
              <div className="text-teal-300 font-mono text-sm">{passaporte.contatoEmergenciaTelefone}</div>
            </div>

            <div className="text-left sm:text-right space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Alergias & Medicações
              </span>
              <div className="text-rose-300 font-semibold">{passaporte.alergiasAlimentares}</div>
              <div className="text-slate-400 text-[11px]">{passaporte.medicamentosUsoContinuo}</div>
            </div>
          </div>

          {/* Legal Warning footer */}
          <div className="text-[10px] text-slate-400 text-center border-t border-slate-800/80 pt-3">
            Documento de identificação e acessibilidade com amparo na Lei nº 12.764/2012 e Lei nº 13.977/2020.
            O desrespeito ou recusa de prioridade constitui infração legal.
          </div>
        </div>
      </div>
    </div>
  );
};
