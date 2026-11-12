import React, { useState } from 'react';
import {
  ShieldAlert,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Scale,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { copiarTexto } from '../../utils/clipboard';

export const AuditoriaPlanoSaude: React.FC = () => {
  const { user } = useAuth();

  const [operadora, setOperadora] = useState('');
  const [tipoNegativa, setTipoNegativa] = useState<
    'limite_sessoes' | 'ausencia_rol' | 'fora_rede' | 'metodo_aba' | 'coparticipacao'
  >('limite_sessoes');
  const [prescricaoMedica, setPrescricaoMedica] = useState(
    'Prescrição de 20 horas semanais de Terapia ABA, 3h de Fonoaudiologia e 2h de Terapia Ocupacional com Integração Sensorial.'
  );
  const [justificativaPlano, setJustificativaPlano] = useState('');
  const [copiedNotif, setCopiedNotif] = useState(false);

  // Análise jurídica fundamentada
  const getAnaliseNegativa = () => {
    switch (tipoNegativa) {
      case 'limite_sessoes':
        return {
          status: 'TOTALMENTE ILEGAL',
          severidade: 'CRÍTICA',
          artigos: 'RN nº 469/2021 e RN nº 539/2022 da ANS; Súmula 102/TJSP; Tema 1069/STJ.',
          diagnostico:
            'A ANS extinguiu definitivamente todo e qualquer limite quantitativo de sessões de psicoterapia, fonoaudiologia, terapia ocupacional e fisioterapia para pacientes com Transtorno do Espectro Autista (TEA). É abusiva e ilícita qualquer cláusula contratual que limite o número de atendimentos.',
        };
      case 'ausencia_rol':
      case 'metodo_aba':
        return {
          status: 'VIOLAÇÃO EXPRESSA DA LEI 14.454/2022',
          severidade: 'CRÍTICA',
          artigos: 'Lei Federal nº 14.454/2022; Art. 10, § 13 da Lei 9.656/1998; Tema 1069/STJ.',
          diagnostico:
            'A Lei Federal nº 14.454/2022 superou formalmente a tese do rol taxativo da ANS. Havendo comprovação de eficácia científica baseada em evidências (como amplamente reconhecido no método ABA) e recomendação médica expressa, o plano é obrigado a custear o tratamento integral.',
        };
      case 'fora_rede':
        return {
          status: 'DEVER DE REEMBOLSO INTEGRAL',
          severidade: 'ALTA',
          artigos: 'Art. 12, VI da Lei 9.656/98; RN nº 259/2011 da ANS.',
          diagnostico:
            'Se a operadora de saúde não dispuser de profissionais qualificados ou clínicas credenciadas na cidade ou região com vaga imediata no método prescrito (ABA/Integração Sensorial), ela tem a obrigação legal de custear ou reembolsar integralmente o tratamento na rede particular.',
        };
      case 'coparticipacao':
        return {
          status: 'COBRANÇA LIMITADA / ABUSIVA',
          severidade: 'ALTA',
          artigos: 'Art. 51, IV do CDC; Jurisprudência do STJ.',
          diagnostico:
            'A cobrança de coparticipação que onera desmedidamente o consumidor com tratamento contínuo essencial, a ponto de inviabilizar o acesso à saúde, é considerada abusiva pelo Código de Defesa do Consumidor e Tribunais de Justiça.',
        };
      default:
        return {
          status: 'ILICITUDE IDENTIFICADA',
          severidade: 'ALTA',
          artigos: 'Lei 9.656/98 e Lei 12.764/12.',
          diagnostico: 'A operadora de saúde tem o dever de prestar assistência integral ao beneficiário com TEA.',
        };
    }
  };

  const analise = getAnaliseNegativa();

  // Gerador de Notificação de Cumprimento em 48h
  const gerarNotificacaoTexto = () => {
    const nome = user?.nome || 'REPRESENTANTE LEGAL DO BENEFICIÁRIO';
    const cpf = user?.cpf || '000.000.000-00';
    const nomeBeneficiario = user?.nome || 'PESSOA COM TEA';

    return `NOTIFICAÇÃO EXTRAJUDICIAL DE URGÊNCIA (PRAZO FATAL: 48 HORAS)
À OPERADORA DE PLANO DE SAÚDE: ${operadora || '[NOME DA OPERADORA]'}
ASSUNTO: CUMPRIMENTO IMEDIATO DE COBERTURA INTEGRAL DE TERAPIAS MULTIDISCIPLINARES (TEA)

NOTIFICANTE: ${nome}, CPF nº ${cpf}, na qualidade de responsável legal de ${nomeBeneficiario}, portador(a) do Transtorno do Espectro Autista (CID ${user?.laudo.cid || 'F84.0'}).

1. DOS FATOS:
O(A) beneficiário(a) é portador(a) de TEA e recebeu expressa prescrição do médico assistente assistencial para o seguinte plano terapêutico:
"${prescricaoMedica}"
Ocorre que esta operadora de saúde indeferiu ou limitou ilegalmente o custeio do tratamento sob a alegação de: "${justificativaPlano || 'Limitação de sessões / ausência no rol / negativa injustificada'}".

2. DA FRONTAL ILEGALIDADE:
Tal conduta viola frontalmente:
a) A Resolução Normativa ANS nº 469/2021 e nº 539/2022, que revogaram todo e qualquer teto quantitativo de sessões para autismo;
b) A Lei Federal nº 14.454/2022 (Art. 10, § 13 da Lei 9.656/98), que superou o rol taxativo da ANS;
c) A Súmula nº 102 do TJSP e o Tema 1069 do STJ: "Havendo expressa indicação médica, é abusiva a negativa de cobertura de custeio de tratamento sob o argumento da sua natureza experimental ou por não estar previsto no rol da ANS".

3. DA NOTIFICAÇÃO E REQUERIMENTO:
Diante do exposto, NOTIFICA-SE esta operadora para que, no prazo IMPRETERÍVEL de 48 (quarenta e oito) horas a contar do recebimento:
1. Autorize integralmente as terapias multidisciplinares prescritas, sem qualquer limite semanal ou mensal de sessões;
2. Na ausência de clínica credenciada capacitada com vaga imediata, garanta o reembolso INTEGRAL das despesas com profissionais particulares na forma da RN 259/2011 da ANS.

ADVERTÊNCIA: O não atendimento da presente no prazo assinalado ensejará o ajuizamento imediato de AÇÃO DE OBRIGAÇÃO DE FAZER COM PEDIDO DE TUTELA DE URGÊNCIA (LIMINAR INAUDITA ALTERA PARTE) cumulada com pedido de astreintes (multa diária não inferior a R$ 1.000,00), além de denúncia perante a Diretoria de Fiscalização da ANS e PROCON.

Nestes termos, aguarda-se o cumprimento imediato.
Local e Data: ${new Date().toLocaleDateString('pt-BR')}

_______________________________________
${nome} (Representante Legal)`;
  };

  const handleCopyNotif = () => {
    copiarTexto(gerarNotificacaoTexto()).then((ok) => {
      if (!ok) return;
      setCopiedNotif(true);
      setTimeout(() => setCopiedNotif(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-950 p-6 rounded-3xl border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-bold uppercase mb-2 border border-teal-500/30">
            <Scale className="w-3.5 h-3.5" />
            Lei 14.454/2022 • RN 469 e 539 ANS • STJ
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Auditoria de Negativas de Planos de Saúde (Terapias TEA)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Verifique a ilegalidade da negativa do plano de saúde em relação ao método ABA, fonoaudiologia, terapia ocupacional ou psicomotricidade e gere a notificação formal de cumprimento em 48 horas sob pena de liminar na justiça.
          </p>
        </div>
      </div>

      {/* Grid: Form and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">Identificação da Negativa da Operadora</h3>
            <p className="text-xs text-slate-400">Preencha os dados do que o convênio médico respondeu.</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Nome do Plano / Operadora de Saúde *</label>
              <input
                type="text"
                value={operadora}
                onChange={(e) => setOperadora(e.target.value)}
                placeholder="Ex: Bradesco Saúde, Amil, Unimed, SulAmérica, Notredame..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Motivo / Tipo de Negativa do Plano *</label>
              <select
                value={tipoNegativa}
                onChange={(e) => setTipoNegativa(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
              >
                <option value="limite_sessoes">Limitou o número de sessões (ex: apenas 2 por semana)</option>
                <option value="metodo_aba">Negou o método ABA alegando ausência no rol da ANS</option>
                <option value="fora_rede">Não tem vaga na rede credenciada e recusa reembolso integral</option>
                <option value="coparticipacao">Cobrança de coparticipação abusiva por sessão</option>
                <option value="ausencia_rol">Alegou tratamento experimental</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Prescrição do Médico Assistente (Laudo)</label>
              <textarea
                value={prescricaoMedica}
                onChange={(e) => setPrescricaoMedica(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Justificativa ou Protocolo de Negativa da Operadora</label>
              <input
                type="text"
                value={justificativaPlano}
                onChange={(e) => setJustificativaPlano(e.target.value)}
                placeholder="Ex: Protocolo 3089410 - Negado conforme parecer da junta médica..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Legal Opinion */}
        <div className="bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Parecer Jurídico de Auditoria</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded bg-red-950 text-red-300 text-[10px] font-black border border-red-800 uppercase">
                {analise.status}
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-teal-400">Diagnóstico Legal:</div>
              <p className="text-xs text-slate-200 leading-relaxed">{analise.diagnostico}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 font-semibold">Fundamentação Normativa e Jurisprudencial:</div>
              <div className="text-xs font-mono text-teal-300">{analise.artigos}</div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleCopyNotif}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-lg"
            >
              {copiedNotif ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Notificação Copiada para a Área de Transferência!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Notificação Extrajudicial de 48h Pronta</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Official Notification Extrajudicial */}
      <div className="bg-slate-900/95 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="font-extrabold text-white text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            <span>Minuta Oficial de Notificação Extrajudicial (Envio por E-mail, Cartório ou Notificação Formal):</span>
          </div>
          <button
            onClick={handleCopyNotif}
            className="text-xs font-bold text-teal-300 hover:text-white flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> Copiar Texto
          </button>
        </div>

        <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-72 overflow-y-auto leading-relaxed">
          {gerarNotificacaoTexto()}
        </pre>
      </div>
    </div>
  );
};
