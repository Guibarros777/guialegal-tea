import React, { useState } from 'react';
import {
  GraduationCap,
  AlertTriangle,
  Scale,
  FileCheck2,
  FileText,
  Copy,
  Check,
  ShieldAlert,
  Users,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { copiarTexto } from '../../utils/clipboard';

export const EducacaoInclusiva: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'direitos' | 'pei' | 'notificacao'>('direitos');

  // Notification form
  const [nomeEscola, setNomeEscola] = useState('');
  const [diretorNome, setDiretorNome] = useState('');
  const [tipoViolacao, setTipoViolacao] = useState<'recusa_matricula' | 'taxa_extra' | 'falta_mediador' | 'recusa_pei'>('taxa_extra');
  const [valorTaxa, setValorTaxa] = useState('850,00');
  const [copiedNotif, setCopiedNotif] = useState(false);

  const gerarNotificacaoEscolar = () => {
    const nome = user?.nome || '[NOME DO RESPONSÁVEL]';
    const cpf = user?.cpf || '[CPF DO RESPONSÁVEL]';
    const aluno = user?.nome || '[NOME DO ALUNO COM TEA]';
    const cid = user?.laudo.cid || 'F84.0';

    return `NOTIFICAÇÃO EXTRAJUDICIAL DE URGÊNCIA (PRAZO FATAL: 48 HORAS)
À DIREÇÃO DO ESTABELECIMENTO DE ENSINO: ${nomeEscola || '[NOME DA ESCOLA / COLÉGIO]'}
A/C: ${diretorNome || 'Diretoria Pedagógica / Administrativa'}

NOTIFICANTE: ${nome}, CPF nº ${cpf}, na qualidade de responsável legal pelo(a) aluno(a) ${aluno}, diagnosticado(a) com Transtorno do Espectro Autista (CID ${cid}).

1. DOS FATOS:
${
  tipoViolacao === 'taxa_extra'
    ? `O Notificante foi surpreendido com a cobrança abusiva e ilegal de taxa adicional / taxa de acompanhante / aumento de mensalidade no valor de R$ ${valorTaxa} a pretexto de custear o Profissional de Apoio Escolar (mediador) necessário à inclusão do educando.`
    : tipoViolacao === 'recusa_matricula'
    ? `A instituição recusou, protelou ou colocou obstáculos à matrícula ou rematrícula do educando sob alegações de ausência de vagas para alunos com deficiência ou necessidade de laudos suplementares.`
    : tipoViolacao === 'falta_mediador'
    ? `O educando encontra-se matriculado e desprovido do Profissional de Apoio Escolar garantido pela Lei nº 12.764/2012, sofrendo isolamento pedagógico e prejuízos severos em seu desenvolvimento.`
    : `A equipe pedagógica recusou-se a elaborar e apresentar o Plano de Ensino Individualizado (PEI) e as adaptações curriculares necessárias.`
}

2. DA FRONTAL ILEGALIDADE E TIPIFICAÇÃO PENAL:
A conduta acima viola frontalmente:
a) O Art. 28, § 1º da Lei Federal nº 13.146/2015 (Estatuto da Pessoa com Deficiência), que VEDA expressamente a cobrança de qualquer valor adicional de qualquer natureza em mensalidades, anuidades e matrículas para escolas privadas;
b) O julgamento da ADI nº 5357 pelo SUPREMO TRIBUNAL FEDERAL (STF), com eficácia vinculante e contra todos, que declarou constitucional a obrigação das escolas privadas de custear integralmente mediadores e adaptações sem repasse aos pais;
c) O Art. 8º da Lei Federal nº 7.853/1989 c/c Art. 28 da Lei 13.146/15, que tipifica como CRIME PUNÍVEL COM RECLUSÃO DE 2 (DOIS) A 5 (CINCO) ANOS E MULTA a recusa, procrastinação ou cobrança diferenciada por motivo derivado da deficiência.

3. DA NOTIFICAÇÃO E REQUERIMENTO:
NOTIFICA-SE a instituição para que, no prazo improrrogável de 48 (quarenta e oito) horas a contar do recebimento:
1. Cancele e se abstenha de cobrar qualquer taxa extra, garantindo o pleno fornecimento do profissional de apoio e a efetivação da matrícula;
2. Apresente o cronograma de implementação do Plano de Ensino Individualizado (PEI).

ADVERTÊNCIA: O não cumprimento ensejará o protocolo imediato de NOTÍCIA-CRIME e REPRESENTAÇÃO formal perante o MINISTÉRIO PÚBLICO ESTADUAL (Promotoria da Educação e dos Direitos da Pessoa com Deficiência), PROCON, Conselho Municipal de Educação e Delegacia Especializada, além de Ação Judicial com pedido de Danos Morais e Tutela de Urgência.

Nestes termos, aguarda-se manifestação.
Local e Data: ${new Date().toLocaleDateString('pt-BR')}

_______________________________________
${nome} (Responsável Legal)`;
  };

  const handleCopy = () => {
    copiarTexto(gerarNotificacaoEscolar()).then((ok) => {
      if (!ok) return;
      setCopiedNotif(true);
      setTimeout(() => setCopiedNotif(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 p-6 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase mb-2 border border-emerald-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            STF ADI 5357 • Art. 28 Estatuto PcD
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Educação Inclusiva & Proteção Escolar
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Proibição absoluta de taxa extra em escolas privadas, direito inegociável ao mediador/cuidador escolar custeado pela instituição e exigência do Plano de Ensino Individualizado (PEI). Recusa de matrícula é crime!
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('direitos')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'direitos' ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Direitos na Escola
          </button>
          <button
            onClick={() => setActiveTab('pei')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'pei' ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Guia do PEI
          </button>
          <button
            onClick={() => setActiveTab('notificacao')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'notificacao' ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Notificação Extrajudicial
          </button>
        </div>
      </div>

      {/* TAB 1: DIREITOS ESCOLARES */}
      {activeTab === 'direitos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 rounded-3xl p-6 border-2 border-red-500/50 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase text-red-400 tracking-wider">
              CRIME FEDERAL (LEI 7.853/89)
            </span>
            <h3 className="font-extrabold text-white text-base">Recusa de Matrícula</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Recusar, suspender ou procrastinar a matrícula de aluno com autismo é <strong>crime inafiançável punido com reclusão de 2 a 5 anos e multa</strong> (Art. 8º da Lei 7.853/89). Argumentar que "o limite de alunos autistas por sala já foi atingido" é ilegal e discriminatório.
            </p>
          </div>

          <div className="bg-slate-900/90 rounded-3xl p-6 border-2 border-amber-500/50 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
              STF ADI 5357 (VINCULANTE)
            </span>
            <h3 className="font-extrabold text-white text-base">Proibição de Taxa Extra</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Escolas privadas <strong>NUNCA podem cobrar taxa adicional</strong> pelo mediador, cuidador ou material adaptado. O Supremo Tribunal Federal fixou que o custo da inclusão é ônus da instituição de ensino e não da família atípica (Art. 28, § 1º da Lei 13.146/15).
            </p>
          </div>

          <div className="bg-slate-900/90 rounded-3xl p-6 border-2 border-teal-500/50 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-teal-600/20 text-teal-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase text-teal-400 tracking-wider">
              LEI BERENICE PIANA
            </span>
            <h3 className="font-extrabold text-white text-base">Profissional de Apoio (Mediador)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              O Art. 3º, parágrafo único da Lei nº 12.764/2012 assegura expressamente: "Em casos de comprovada necessidade, a pessoa com TEA terá direito a acompanhante especializado em sala de aula", tanto na rede pública quanto particular.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: GUIA DO PEI */}
      {activeTab === 'pei' && (
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>O que é e o que deve conter o Plano de Ensino Individualizado (PEI)?</span>
              </h3>
              <p className="text-xs text-slate-400">Instrumento pedagógico obrigatório de inclusão</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <strong className="text-teal-300 block text-sm">1. Avaliação Diagnóstica Inicial</strong>
              <p>Mapeamento das habilidades acadêmicas, linguagem, nível de atenção, interesses restritos, hiperfocos e perfil sensorial do aluno.</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <strong className="text-emerald-300 block text-sm">2. Metas e Adaptações Curriculares</strong>
              <p>Adaptação de enunciados, provas com menor sobrecarga visual, tempo estendido para avaliações e flexibilização de metas com foco nas potencialidades.</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <strong className="text-sky-300 block text-sm">3. Estratégias do Profissional de Apoio</strong>
              <p>Atuação específica do mediador: mediação social no recreio, apoio na organização do material, suporte sensorial e prevenção de crises de desregulação.</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <strong className="text-amber-300 block text-sm">4. Cronograma de Reavaliação Bimestral</strong>
              <p>Reuniões regulares entre a escola, família e terapeutas externos para ajuste contínuo dos objetivos educacionais.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICAÇÃO EXTRAJUDICIAL ESCOLAR */}
      {activeTab === 'notificacao' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Configurar Notificação para a Escola</h3>
              <p className="text-xs text-slate-400">Preencha os dados da escola para gerar a peça completa com advertência de crime</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nome da Escola / Colégio *</label>
                <input
                  type="text"
                  value={nomeEscola}
                  onChange={(e) => setNomeEscola(e.target.value)}
                  placeholder="Ex: Colégio Progresso de Campinas"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nome do(a) Diretor(a)</label>
                <input
                  type="text"
                  value={diretorNome}
                  onChange={(e) => setDiretorNome(e.target.value)}
                  placeholder="Ex: Profª Beatriz Alencar"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Tipo de Violação *</label>
                <select
                  value={tipoViolacao}
                  onChange={(e) => setTipoViolacao(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="taxa_extra">Cobrança de Taxa Extra / Mensalidade Maior</option>
                  <option value="recusa_matricula">Recusa ou Dificuldade na Matrícula</option>
                  <option value="falta_mediador">Falta de Mediador / Profissional de Apoio</option>
                  <option value="recusa_pei">Recusa em Fornecer o PEI</option>
                </select>
              </div>
            </div>

            {tipoViolacao === 'taxa_extra' && (
              <div className="max-w-xs text-xs">
                <label className="text-slate-300 font-semibold block mb-1">Valor Cobrado da Taxa Extra (R$)</label>
                <input
                  type="text"
                  value={valorTaxa}
                  onChange={(e) => setValorTaxa(e.target.value)}
                  placeholder="Ex: 850,00"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Generated Document */}
          <div className="bg-slate-900/95 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="font-extrabold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Minuta de Notificação Escolar (Imprimir ou Enviar por Notificação Formal / Cartório):</span>
              </div>
              <button
                onClick={handleCopy}
                className="text-xs font-bold text-emerald-300 hover:text-white flex items-center gap-1 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-700"
              >
                {copiedNotif ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copiar Texto
                  </>
                )}
              </button>
            </div>

            <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-72 overflow-y-auto leading-relaxed">
              {gerarNotificacaoEscolar()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
