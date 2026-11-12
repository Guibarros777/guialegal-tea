import React, { useState } from 'react';
import {
  Stethoscope,
  Users,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  HelpCircle,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface QuestaoSimulacao {
  id: string;
  tipo: 'medica' | 'social';
  pergunta: string;
  contextoCif: string;
  respostaOrientada: string;
  fundamento: string;
}

export const SimuladorPericia: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulador' | 'checklist' | 'direitos'>('simulador');

  // Checklist interativo
  const [checklist, setChecklist] = useState([
    { id: '1', item: 'Laudo Médico com CID (F84.0/F84.1/6A02) detalhando barreiras funcionais', checked: true },
    { id: '2', item: 'Relatórios de Terapias (Terapia Ocupacional, Fonoaudiologia, Psicologia/ABA)', checked: true },
    { id: '3', item: 'Receitas de uso contínuo dos últimos 12 meses', checked: true },
    { id: '4', item: 'Comprovantes de despesas com tratamentos e medicamentos não ofertados pelo SUS', checked: true },
    { id: '5', item: 'Comprovante do CadÚnico atualizado nos últimos 24 meses no CRAS', checked: false },
    { id: '6', item: 'Relatório Escolar / Plano de Ensino Individualizado (PEI) se matriculado', checked: false },
    { id: '7', item: 'Documento oficial com foto (RG/Certidão) da pessoa com TEA e do responsável', checked: true },
  ]);

  const toggleCheck = (id: string) => {
    setChecklist(checklist.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)));
  };

  const questoes: QuestaoSimulacao[] = [
    {
      id: 'q1',
      tipo: 'medica',
      pergunta: 'Como a pessoa se alimenta, se veste e realiza higiene pessoal no dia a dia?',
      contextoCif: 'Domínio de Cuidados Pessoais (d510 a d570 da CIF)',
      respostaOrientada:
        'Descreva detalhadamente o nível de supervisão contínua ou assistência física necessária. Não relate apenas o momento de calma: mencione se há seletividade alimentar extrema, risco de acidentes, necessidade de auxílio para vestir e higienização.',
      fundamento: 'Critério de dependência para Atividades de Vida Diária (AVDs).',
    },
    {
      id: 'q2',
      tipo: 'social',
      pergunta: 'Como é a rotina da família e o impacto financeiro/emocional do cuidado em tempo integral?',
      contextoCif: 'Fatores Ambientais e Apoio (e310 a e580 da CIF)',
      respostaOrientada:
        'Explique se um dos genitores teve que abandonar o emprego para acompanhar terapias e cuidados diários. Isso comprova o isolamento econômico gerado pela ausência de rede de apoio pública.',
      fundamento: 'Barreira atitudinal e indisponibilidade de serviços públicos de suporte.',
    },
    {
      id: 'q3',
      tipo: 'medica',
      pergunta: 'A pessoa tem crises sensoriais, agressividade ou heteroagressividade?',
      contextoCif: 'Funções Mentais Globais e Específicas (b140 a b160 da CIF)',
      respostaOrientada:
        'Apresente relatórios multiprofissionais que descrevam os gatilhos de sobrecarga sensorial (ruídos, aglomeração), duração das crises de meltdown/shutdown e tempo de recuperação.',
      fundamento: 'Impedimento de longo prazo no controle comportamental e sensorial.',
    },
    {
      id: 'q4',
      tipo: 'social',
      pergunta: 'O bairro onde reside dispõe de transporte adaptado e escolas capacitadas?',
      contextoCif: 'Barreiras Urbanísticas e Arquitetônicas da CIF',
      respostaOrientada:
        'Relate se há dificuldade de locomoção em transporte público lotado (sobrecarga sensorial) e se o SUS local tem fila excessiva para as terapias essenciais.',
      fundamento: 'Avaliação Social com fulcro no Art. 2º da Lei 13.146/2015.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-950/70 via-slate-900 to-slate-950 p-6 rounded-3xl border border-sky-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 text-xs font-bold uppercase mb-2 border border-sky-500/30">
            <Stethoscope className="w-3.5 h-3.5" />
            INSS • Avaliação Biopsicossocial (CIF)
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Simulador de Perícia Médica & Avaliação Social
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Prepare-se para as etapas médicas e sociais do INSS. Conheça as perguntas mais frequentes baseadas na Classificação Internacional de Funcionalidade (CIF), confira o checklist de documentos e conheça seus direitos inegociáveis na sala de perícia.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('simulador')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'simulador' ? 'bg-sky-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Simulador CIF
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'checklist' ? 'bg-sky-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Checklist de Documentos
          </button>
          <button
            onClick={() => setActiveTab('direitos')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'direitos' ? 'bg-sky-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Direitos na Perícia
          </button>
        </div>
      </div>

      {/* TAB 1: SIMULADOR DAS PERGUNTAS CIF */}
      {activeTab === 'simulador' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questoes.map((q) => (
              <div
                key={q.id}
                className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      q.tipo === 'medica'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {q.tipo === 'medica' ? 'Perícia Médica' : 'Avaliação Social'}
                  </span>
                  <span className="text-[10px] text-slate-400">{q.contextoCif}</span>
                </div>

                <h4 className="font-bold text-white text-sm sm:text-base">{q.pergunta}</h4>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="text-[10px] text-teal-400 font-bold uppercase">
                    Como Responder Corretamente:
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{q.respostaOrientada}</p>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>{q.fundamento}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CHECKLIST DE DOCUMENTOS OBRIGATÓRIOS */}
      {activeTab === 'checklist' && (
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-sky-400" />
                <span>Checklist de Documentação Obrigatória para a Perícia</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                A ausência de qualquer um destes documentos é o principal motivo de indeferimento indevido pelo INSS.
              </p>
            </div>
            <div className="text-xs font-bold text-sky-400 bg-sky-950/80 px-3 py-1 rounded-xl border border-sky-800">
              {checklist.filter((c) => c.checked).length} de {checklist.length} Prontos
            </div>
          </div>

          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                  item.checked
                    ? 'bg-slate-950 border-teal-500/50 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                      item.checked ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{item.item}</span>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                  {item.checked ? (
                    <span className="text-teal-400">Pronto</span>
                  ) : (
                    <span className="text-amber-400">Pendente</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DIREITOS INEGOCIÁVEIS NA SALA DE PERÍCIA */}
      {activeTab === 'direitos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-white text-sm">Direito ao Acompanhante</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              O perito <strong>não pode proibir</strong> a mãe, pai ou responsável de entrar na sala de perícia com a pessoa com TEA. O Art. 92 do Estatuto da PcD (Lei 13.146/15) e a Resolução CFM nº 2.155/2016 garantem a presença de acompanhante durante todo o ato médico.
            </p>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-white text-sm">Gravação da Perícia</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Você pode gravar o áudio da perícia no seu celular. O Supremo Tribunal Federal (Tema 980) consolidou que a gravação ambiental feita por um dos interlocutores é plenamente lícita e válida como prova em processo administrativo ou judicial.
            </p>
          </div>

          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-white text-sm">Regra do "Pior Dia"</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ao responder perguntas do perito, nunca responda com base no melhor momento em que a pessoa estava calma. Responda com base na rotina real e nos momentos de crise, desregulação e estresse, que demonstram o grau de barreira funcional e necessidade de assistência.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
