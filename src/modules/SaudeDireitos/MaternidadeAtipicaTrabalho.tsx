import React, { useState } from 'react';
import {
  Briefcase,
  Clock,
  Home,
  FileText,
  Copy,
  Check,
  Scale,
  Sparkles,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { copiarTexto } from '../../utils/clipboard';

export const MaternidadeAtipicaTrabalho: React.FC = () => {
  const { user } = useAuth();
  const [regime, setRegime] = useState<'servidor_publico' | 'clt'>('clt');
  const [empregador, setEmpregador] = useState('');
  const [cargo, setCargo] = useState('');
  const [percentualReducao, setPercentualReducao] = useState('20% a 50%');
  const [copiedRequerimento, setCopiedRequerimento] = useState(false);

  const gerarRequerimentoTexto = () => {
    const nome = user?.nome || '[NOME COMPLETO DO(A) TRABALHADOR(A)]';
    const cpf = user?.cpf || '[CPF]';
    const beneficiario = user?.nome || '[NOME DO FILHO(A) COM TEA]';
    const cid = user?.laudo.cid || 'F84.0';

    return `REQUERIMENTO ADMINISTRATIVO DE REDUÇÃO DE JORNADA DE TRABALHO
COM FUNDAMENTO NA LEI FEDERAL Nº 13.370/2016 E NO TEMA 1097 DO STF
(SEM REDUÇÃO SALARIAL E SEM COMPENSAÇÃO DE HORÁRIO)

AO DEPARTAMENTO DE RECURSOS HUMANOS / GESTÃO DE PESSOAS DE:
${empregador || '[NOME DA EMPRESA OU ÓRGÃO PÚBLICO EMPREGADOR]'}

REQUERENTE: ${nome}, CPF nº ${cpf}, ocupante da função de ${cargo || '[CARGO/FUNÇÃO]'}.

1. DOS FATOS E DA CONDIÇÃO ATÍPICA:
O(A) Requerente é genitor(a) e responsável legal de ${beneficiario}, diagnosticado(a) com Transtorno do Espectro Autista (CID ${cid}), dependente de cuidados intensivos, acompanhamento contínuo em terapias multidisciplinares (ABA, Fonoaudiologia, Terapia Ocupacional) e mediação diária, conforme laudos e prescrições médicas anexos.

2. DO DIREITO E DA JURISPRUDÊNCIA VINCULANTE:
${
  regime === 'servidor_publico'
    ? `O direito à concessão de horário especial sem compensação e sem redução de vencimentos encontra amparo expresso no Art. 98, §§ 2º e 3º da Lei Federal nº 8.112/1990, com a redação dada pela Lei Federal nº 13.370/2016, estendendo-se aos servidores estaduais e municipais por simetria constitucional.`
    : `O Supremo Tribunal Federal (STF), em julgamento com REPERCUSSÃO GERAL no TEMA 1097 (Recurso Extraordinário nº 1.237.867), fixou tese vinculante assegurando aos empregados públicos e trabalhadores celetistas que tenham dependente com deficiência o direito à redução de sua jornada de trabalho sem compensação e sem redução salarial.`
}
A Convenção Internacional sobre os Direitos das Pessoas com Deficiência (promulgada pelo Decreto nº 6.949/2009 com equivalência de Emenda Constitucional - Art. 5º, § 3º da CF/88) estabelece o dever de adaptação razoável e proteção integral à família acolhedora.

3. DOS PEDIDOS:
Diante do exposto, REQUER:
a) A concessão imediata da redução de ${percentualReducao} da jornada de trabalho semanal, sem redução salarial e sem exigência de compensação de horários;
b) Subsidiariamente, se viável às atividades da função, a concessão de regime de Teletrabalho (Home Office) ou horário flexível nos dias de atendimento terapêutico.

Termos em que pede e espera deferimento.
Local e Data: ${new Date().toLocaleDateString('pt-BR')}

_______________________________________
${nome}
CPF nº ${cpf}`;
  };

  const handleCopy = () => {
    copiarTexto(gerarRequerimentoTexto()).then((ok) => {
      if (!ok) return;
      setCopiedRequerimento(true);
      setTimeout(() => setCopiedRequerimento(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-950 p-6 rounded-3xl border border-rose-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 text-xs font-bold uppercase mb-2 border border-rose-500/30">
            <Heart className="w-3.5 h-3.5" />
            Tema 1097 STF • Lei 13.370/16
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Maternidade Atípica & Direitos no Trabalho
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Redução de jornada de trabalho sem corte de salário e sem compensação de horário para pais de pessoas com TEA, tanto para servidores públicos quanto para trabalhadores celetistas (CLT), conforme decisão histórica do STF.
          </p>
        </div>
      </div>

      {/* Grid: Overview and Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-rose-400" />
              <span>Direitos Trabalhistas Consolidados</span>
            </h3>
            <p className="text-xs text-slate-400">Proteção ao cuidador de pessoa com autismo</p>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-rose-300 font-bold block text-sm">
                Tema 1097 do STF (Celetistas / CLT):
              </span>
              <p>
                O Supremo Tribunal Federal decidiu que empregados sob a CLT pais de pessoas com deficiência têm direito à redução da jornada em patamar compatível com as terapias (usualmente entre 20% e 50%), sem prejuízo da remuneração e sem compensação de jornada.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-teal-300 font-bold block text-sm">
                Lei 13.370/2016 (Servidores Públicos):
              </span>
              <p>
                Altera o Art. 98 da Lei 8.112/1990 para conceder horário especial ao servidor que tenha cônjuge, filho ou dependente com deficiência, sem necessidade de compensação de horário.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-sky-300 font-bold block text-sm">
                Prioridade em Teletrabalho (Home Office):
              </span>
              <p>
                O Art. 34 do Estatuto da Pessoa com Deficiência e normativas de diversos tribunais e empresas conferem prioridade aos pais atípicos na escolha do regime de teletrabalho para conciliar as rotinas terapêuticas.
              </p>
            </div>
          </div>
        </div>

        {/* Generator Form */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">Gerador de Requerimento de Horário Especial</h3>
              <p className="text-xs text-slate-400">Preencha para gerar a petição administrativa pronta</p>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Regime de Trabalho</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegime('clt')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition ${
                      regime === 'clt'
                        ? 'bg-rose-950/60 border-rose-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    CLT (Tema 1097 STF)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegime('servidor_publico')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs transition ${
                      regime === 'servidor_publico'
                        ? 'bg-rose-950/60 border-rose-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Servidor Público (Lei 13.370)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Empregador / Órgão Público *</label>
                <input
                  type="text"
                  value={empregador}
                  onChange={(e) => setEmpregador(e.target.value)}
                  placeholder="Ex: Empresa ABC Ltda / Prefeitura Municipal de Campinas"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Cargo / Função do Trabalhador *</label>
                <input
                  type="text"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Ex: Analista Administrativo / Professora"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Percentual Requerido de Redução</label>
                <select
                  value={percentualReducao}
                  onChange={(e) => setPercentualReducao(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="20%">20% da jornada semanal</option>
                  <option value="30%">30% da jornada semanal</option>
                  <option value="40%">40% da jornada semanal</option>
                  <option value="50% (metade da jornada)">50% da jornada semanal (máximo usual)</option>
                  <option value="20% a 50%">Percentual a ser fixado em junta médica (20% a 50%)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={handleCopy}
              className="w-full bg-gradient-to-r from-rose-600 to-amber-600 hover:brightness-110 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-lg"
            >
              {copiedRequerimento ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Requerimento Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Requerimento Administrativo Pronto</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Requerimento Preview */}
      <div className="bg-slate-900/95 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="font-extrabold text-white text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-400" />
            <span>Peça Formatada para Protocolo no RH / Protocolo Geral:</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-xs font-bold text-rose-300 hover:text-white flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> Copiar Texto
          </button>
        </div>

        <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-72 overflow-y-auto leading-relaxed">
          {gerarRequerimentoTexto()}
        </pre>
      </div>
    </div>
  );
};
