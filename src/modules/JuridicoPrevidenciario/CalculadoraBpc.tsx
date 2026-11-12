import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Printer,
  Copy,
  Check,
  Scale,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { FamiliarBpc, DespesaBpc, BpcResult } from '../../types';
import { copiarTexto } from '../../utils/clipboard';

export const CalculadoraBpc: React.FC = () => {
  // Salário Mínimo 2026 oficial
  const SALARIO_MINIMO_2026 = 1518.0;
  const LIMITE_QUARTO = SALARIO_MINIMO_2026 / 4; // R$ 379,50
  const LIMITE_MEIO = SALARIO_MINIMO_2026 / 2; // R$ 759,00

  // State: Família
  const [familiares, setFamiliares] = useState<FamiliarBpc[]>([
    {
      id: '1',
      nome: 'Pessoa com TEA (Requerente)',
      parentesco: 'Filho(a) / Próprio',
      rendaBruta: 0,
      recebeBpcOuIdoso: false,
    },
    {
      id: '2',
      nome: 'Mãe / Cuidador(a) Principal',
      parentesco: 'Mãe',
      rendaBruta: 1518,
      recebeBpcOuIdoso: false,
    },
    {
      id: '3',
      nome: 'Irmão(ã) menor',
      parentesco: 'Irmão(ã)',
      rendaBruta: 0,
      recebeBpcOuIdoso: false,
    },
    {
      id: '4',
      nome: 'Avó idosa (com BPC próprio)',
      parentesco: 'Avó',
      rendaBruta: 1518,
      recebeBpcOuIdoso: true, // EXCLUÍDO POR LEI DO CÁLCULO
    },
  ]);

  // State: Deduções de Saúde e Medicamentos (Lei 14.176/2021)
  const [despesas, setDespesas] = useState<DespesaBpc[]>([
    {
      id: 'd1',
      categoria: 'medicamento',
      descricao: 'Risperidona / Melatonina / Suplementos (com receita, não fornecidos no posto)',
      valorMensal: 280,
      possuiComprovante: true,
      naoFornecidoPeloSus: true,
    },
    {
      id: 'd2',
      categoria: 'fraldas',
      descricao: 'Fraldas descartáveis especiais (4 pacotes/mês)',
      valorMensal: 190,
      possuiComprovante: true,
      naoFornecidoPeloSus: true,
    },
    {
      id: 'd3',
      categoria: 'terapias',
      descricao: 'Sessões de Fonoaudiologia e Terapia Ocupacional particular (fila longa no SUS)',
      valorMensal: 450,
      possuiComprovante: true,
      naoFornecidoPeloSus: true,
    },
  ]);

  const [copiedMemorial, setCopiedMemorial] = useState(false);

  // Handlers para Familiares
  const addFamiliar = () => {
    const novo: FamiliarBpc = {
      id: `fam_${Date.now()}`,
      nome: `Membro ${familiares.length + 1}`,
      parentesco: 'Outro membro',
      rendaBruta: 0,
      recebeBpcOuIdoso: false,
    };
    setFamiliares([...familiares, novo]);
  };

  const removeFamiliar = (id: string) => {
    if (familiares.length <= 1) return;
    setFamiliares(familiares.filter((f) => f.id !== id));
  };

  const updateFamiliar = (id: string, updates: Partial<FamiliarBpc>) => {
    setFamiliares(familiares.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  // Handlers para Despesas
  const addDespesa = () => {
    const nova: DespesaBpc = {
      id: `desp_${Date.now()}`,
      categoria: 'medicamento',
      descricao: 'Nova despesa médica contínua',
      valorMensal: 100,
      possuiComprovante: true,
      naoFornecidoPeloSus: true,
    };
    setDespesas([...despesas, nova]);
  };

  const removeDespesa = (id: string) => {
    setDespesas(despesas.filter((d) => d.id !== id));
  };

  const updateDespesa = (id: string, updates: Partial<DespesaBpc>) => {
    setDespesas(despesas.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  // Cálculo de BPC
  const calcularResultado = (): BpcResult => {
    const membrosContabilizados = familiares.length;

    // Renda bruta considerando a regra de exclusão do Art. 20 § 14 e 15 da Lei 8.742/93
    // BPC ou benefício de até 1 salário mínimo concedido a idoso ou outra pessoa com deficiência da mesma família NÃO entra na conta!
    let rendaBrutaTotal = 0;
    familiares.forEach((f) => {
      if (!f.recebeBpcOuIdoso) {
        rendaBrutaTotal += Number(f.rendaBruta || 0);
      }
    });

    // Total de despesas dedutíveis (Lei 14.176/2021)
    let totalDeducoes = 0;
    despesas.forEach((d) => {
      if (d.possuiComprovante && d.naoFornecidoPeloSus) {
        totalDeducoes += Number(d.valorMensal || 0);
      }
    });

    const rendaLiquidaTotal = Math.max(0, rendaBrutaTotal - totalDeducoes);
    const rendaPerCapita = rendaLiquidaTotal / Math.max(1, membrosContabilizados);

    let elegibilidade: BpcResult['elegibilidade'] = 'ACIMA_DO_LIMITE';
    let justificativa = '';
    let fundamentacaoLegal = '';

    if (rendaPerCapita <= LIMITE_QUARTO) {
      elegibilidade = 'ELEGIVEL_ADMINISTRATIVO';
      justificativa = `A renda líquida per capita da família é de R$ ${rendaPerCapita.toFixed(2)}, ficando ABAIXO ou igual a 1/4 do salário mínimo (R$ ${LIMITE_QUARTO.toFixed(2)}). Preenche o requisito econômico objetivo para concessão direta pelo INSS.`;
      fundamentacaoLegal = 'Art. 20, § 3º da Lei Federal nº 8.742/1993 c/c Lei Federal nº 14.176/2021.';
    } else if (rendaPerCapita <= LIMITE_MEIO) {
      elegibilidade = 'ELEGIVEL_JUDICIAL_DEDUCOES';
      justificativa = `A renda per capita calculada é de R$ ${rendaPerCapita.toFixed(2)}, situando-se entre 1/4 e 1/2 salário mínimo. Embora o INSS possa indeferir administrativamente pelo critério estrito de 1/4, o STF (Reclamação 4374 e Tema 173 da TNU) consolidou a inconstitucionalidade da regra quando comprovada a vulnerabilidade social e gastos com saúde. Elegível para recurso ou concessão via Defensoria Pública/Juizado Especial Federal.`;
      fundamentacaoLegal = 'Tema 173 da TNU, STF (RE 567.985 e RE 580.963) e Art. 20-B da Lei 8.742/93.';
    } else {
      elegibilidade = 'ACIMA_DO_LIMITE';
      justificativa = `A renda per capita líquida apurada de R$ ${rendaPerCapita.toFixed(2)} ultrapassa 1/2 salário mínimo. É recomendável revisar se existem outros comprovantes de terapias, tratamentos não absorvidos pelo SUS ou despesas de cuidado contínuo a serem deduzidos.`;
      fundamentacaoLegal = 'Critério de miserabilidade econômica da Lei 8.742/1993.';
    }

    return {
      salarioMinimoVigente: SALARIO_MINIMO_2026,
      limiteQuarto: LIMITE_QUARTO,
      limiteMeio: LIMITE_MEIO,
      totalMembros: membrosContabilizados,
      rendaBrutaTotal,
      totalDeducoes,
      rendaLiquidaTotal,
      rendaPerCapita,
      elegibilidade,
      justificativa,
      fundamentacaoLegal,
    };
  };

  const resultado = calcularResultado();

  // Gera Memorial de Cálculo Oficial em texto formatado
  const gerarMemorialTexto = () => {
    return `MEMORIAL DESCRITIVO DE CÁLCULO DE RENDA PER CAPITA - BPC/LOAS
REQUERIMENTO: Benefício de Prestação Continuada à Pessoa com Deficiência (TEA - CID ${'F84.0'})
AMPARO LEGAL: Lei nº 8.742/1993, Lei nº 12.764/2012 e Lei nº 14.176/2021

1. COMPOSIÇÃO DO GRUPO FAMILIAR (${familiares.length} pessoas):
${familiares
  .map(
    (f, idx) =>
      `  ${idx + 1}. ${f.nome} (${f.parentesco}) - Renda: R$ ${Number(f.rendaBruta).toFixed(
        2
      )}${f.recebeBpcOuIdoso ? ' [EXCLUÍDO DO CÔMPUTO - Art. 20, § 14 Lei 8.742/93]' : ''}`
  )
  .join('\n')}

2. TOTALIZAÇÃO DA RENDA BRUTA FAMILIAR COMPUTÁVEL:
   R$ ${resultado.rendaBrutaTotal.toFixed(2)}

3. DEDUÇÕES LEGAIS DE GASTOS COM TRATAMENTOS E SAÚDE (Lei nº 14.176/2021):
${despesas
  .map(
    (d, idx) =>
      `  (${idx + 1}) [${d.categoria.toUpperCase()}] ${d.descricao}: R$ ${Number(
        d.valorMensal
      ).toFixed(2)} (Comprovante anexo)`
  )
  .join('\n')}
   TOTAL DAS DEDUÇÕES COMPROVADAS: R$ ${resultado.totalDeducoes.toFixed(2)}

4. RENDA LÍQUIDA DO GRUPO FAMILIAR:
   R$ ${resultado.rendaBrutaTotal.toFixed(2)} - R$ ${resultado.totalDeducoes.toFixed(2)} = R$ ${resultado.rendaLiquidaTotal.toFixed(2)}

5. RENDA PER CAPITA LÍQUIDA FINAL:
   R$ ${resultado.rendaLiquidaTotal.toFixed(2)} ÷ ${resultado.totalMembros} membros = R$ ${resultado.rendaPerCapita.toFixed(2)} / pessoa

6. CONCLUSÃO TÉCNICA E JURÍDICA:
   Critério de 1/4 SM (2026): R$ ${resultado.limiteQuarto.toFixed(2)}
   Critério de 1/2 SM (Judicial/TNU): R$ ${resultado.limiteMeio.toFixed(2)}
   RESULTADO: ${resultado.elegibilidade}
   ${resultado.justificativa}
   Fundamentação: ${resultado.fundamentacaoLegal}

Documento emitido pelo GuiaLegal TEA para instrução processual junto ao INSS / JEF.`;
  };

  const handleCopyMemorial = () => {
    copiarTexto(gerarMemorialTexto()).then((ok) => {
      if (!ok) return;
      setCopiedMemorial(true);
      setTimeout(() => setCopiedMemorial(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-950 p-6 rounded-3xl border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-bold uppercase mb-2 border border-teal-500/30">
            <Scale className="w-3.5 h-3.5" />
            Lei Federal 8.742/93 c/c Lei 14.176/21
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Calculadora Inteligente de BPC/LOAS com Deduções Legais
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Calcule o direito ao benefício mensal de 1 Salário Mínimo (R$ 1.518,00 em 2026) aplicando a dedução de gastos com medicamentos, fraldas, terapias multidisciplinares e a exclusão legal de benefícios de idosos ou outras PcD da casa.
          </p>
        </div>

        <div className="shrink-0 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-right">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Salário Mínimo 2026</div>
          <div className="text-xl font-black text-teal-300">R$ 1.518,00</div>
          <div className="text-[11px] text-slate-400 mt-0.5">1/4 SM = R$ 379,50 | 1/2 SM = R$ 759,00</div>
        </div>
      </div>

      {/* Grid: Composição Familiar e Deduções */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: Grupo Familiar */}
        <div className="bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>1. Grupo Familiar Sob o Mesmo Teto</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700/50">
                  {familiares.length} pessoas
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Pessoas que residem sob o mesmo domicílio (Art. 20, § 1º da Lei 8.742/93).
              </p>
            </div>
            <button
              onClick={addFamiliar}
              className="flex items-center gap-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Membro
            </button>
          </div>

          <div className="space-y-3">
            {familiares.map((f, idx) => (
              <div
                key={f.id}
                className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-200">
                    Membro {idx + 1}
                  </span>
                  {familiares.length > 1 && (
                    <button
                      onClick={() => removeFamiliar(f.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Remover membro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Nome / Identificação</label>
                    <input
                      type="text"
                      value={f.nome}
                      onChange={(e) => updateFamiliar(f.id, { nome: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Parentesco</label>
                    <input
                      type="text"
                      value={f.parentesco}
                      onChange={(e) => updateFamiliar(f.id, { parentesco: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs items-center pt-1">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Renda Bruta Mensal (R$)</label>
                    <input
                      type="number"
                      min={0}
                      step={10}
                      value={f.rendaBruta}
                      onChange={(e) => updateFamiliar(f.id, { rendaBruta: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                  </div>

                  <div className="pt-3">
                    <label className="flex items-start gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={f.recebeBpcOuIdoso}
                        onChange={(e) => updateFamiliar(f.id, { recebeBpcOuIdoso: e.target.checked })}
                        className="rounded text-teal-600 mt-0.5"
                      />
                      <span className="text-[10px] text-slate-300 leading-tight">
                        Recebe BPC ou Aposentadoria de até 1 SM (Excluir do cálculo legalmente)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Deduções de Saúde e Medicamentos */}
        <div className="bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>2. Deduções de Saúde (Lei nº 14.176/21)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                  {despesas.length} itens
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Gastos contínuos comprováveis não absorvidos pelo SUS deduzem da renda!
              </p>
            </div>
            <button
              onClick={addDespesa}
              className="flex items-center gap-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Gasto
            </button>
          </div>

          <div className="space-y-3">
            {despesas.map((d) => (
              <div
                key={d.id}
                className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={d.categoria}
                    onChange={(e) => updateDespesa(d.id, { categoria: e.target.value as any })}
                    className="bg-slate-900 border border-slate-700 text-teal-300 text-xs rounded-lg px-2 py-1"
                  >
                    <option value="medicamento">Medicamentos de Uso Contínuo</option>
                    <option value="fraldas">Fraldas Descartáveis</option>
                    <option value="terapias">Terapias Multidisciplinares (ABA/TO/Fono)</option>
                    <option value="alimentacao_especial">Alimentação Especial / Enteral</option>
                    <option value="consultas_exames">Consultas / Exames Especiais</option>
                  </select>

                  <button
                    onClick={() => removeDespesa(d.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                    title="Remover despesa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    value={d.descricao}
                    onChange={(e) => updateDespesa(d.id, { descricao: e.target.value })}
                    placeholder="Descrição da despesa ou medicamento"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs items-center">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Valor Médio Mensal (R$)</label>
                    <input
                      type="number"
                      min={0}
                      step={5}
                      value={d.valorMensal}
                      onChange={(e) => updateDespesa(d.id, { valorMensal: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs"
                    />
                  </div>

                  <div className="pt-2 flex flex-col gap-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={d.possuiComprovante}
                        onChange={(e) => updateDespesa(d.id, { possuiComprovante: e.target.checked })}
                        className="rounded text-teal-600"
                      />
                      <span className="text-[10px] text-slate-300">Possui nota/recibo</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={d.naoFornecidoPeloSus}
                        onChange={(e) => updateDespesa(d.id, { naoFornecidoPeloSus: e.target.checked })}
                        className="rounded text-teal-600"
                      />
                      <span className="text-[10px] text-slate-300">Não atendido pelo SUS</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: Resultado & Memorial Descritivo */}
      <div className="bg-slate-900/95 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-teal-400" />
              <span>Diagnóstico Previdenciário Oficial</span>
            </h3>
            <p className="text-xs text-slate-400">
              Cálculo com fulcro na Lei 8.742/93, Lei 14.176/21 e jurisprudência vinculante da TNU/STF.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMemorial}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              {copiedMemorial ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-teal-400" />
                  <span>Copiar Memorial</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-[11px] text-slate-400">Renda Bruta Total</div>
            <div className="text-lg sm:text-xl font-bold text-slate-200 mt-1">
              R$ {resultado.rendaBrutaTotal.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">sem contar exclusões legais</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-[11px] text-slate-400">Deduções de Saúde</div>
            <div className="text-lg sm:text-xl font-bold text-rose-400 mt-1">
              - R$ {resultado.totalDeducoes.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">gastos essenciais comprováveis</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-[11px] text-slate-400">Renda Líquida Familiar</div>
            <div className="text-lg sm:text-xl font-bold text-teal-300 mt-1">
              R$ {resultado.rendaLiquidaTotal.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">base para divisão</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-teal-500/40 bg-teal-950/20">
            <div className="text-[11px] text-teal-300 font-semibold">Renda Per Capita Líquida</div>
            <div className="text-xl sm:text-2xl font-black text-teal-400 mt-1">
              R$ {resultado.rendaPerCapita.toFixed(2)}
            </div>
            <div className="text-[10px] text-teal-200 mt-0.5">
              por membro ({resultado.totalMembros} pessoas)
            </div>
          </div>
        </div>

        {/* Eligibility Result Banner */}
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            resultado.elegibilidade === 'ELEGIVEL_ADMINISTRATIVO'
              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-100'
              : resultado.elegibilidade === 'ELEGIVEL_JUDICIAL_DEDUCOES'
              ? 'bg-cyan-950/50 border-cyan-500/60 text-cyan-100'
              : 'bg-amber-950/50 border-amber-500/60 text-amber-100'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-black text-base">
              {resultado.elegibilidade === 'ELEGIVEL_ADMINISTRATIVO' && (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>ELEGÍVEL ADMINISTRATIVAMENTE NO INSS</span>
                </>
              )}
              {resultado.elegibilidade === 'ELEGIVEL_JUDICIAL_DEDUCOES' && (
                <>
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>ELEGÍVEL VIA RECURSO OU VIA JUDICIAL (COM DEDUÇÕES)</span>
                </>
              )}
              {resultado.elegibilidade === 'ACIMA_DO_LIMITE' && (
                <>
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <span>RENDA LÍQUIDA SUPERA 1/2 SALÁRIO MÍNIMO</span>
                </>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
              {resultado.justificativa}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <span className="text-[11px] font-semibold uppercase tracking-wider block opacity-80">
              Valor do Benefício
            </span>
            <span className="text-xl font-black text-white">R$ 1.518,00 / mês</span>
            <span className="text-[10px] block opacity-80">Sem 13º salário (Lei 8.742/93)</span>
          </div>
        </div>

        {/* Printable/Copyable Memorial de Cálculo */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>Memorial Descritivo de Cálculo (Anexar ao Meu INSS):</span>
            <span className="text-[10px] text-slate-500">Pronto para peticionamento</span>
          </div>
          <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap bg-slate-900 p-3.5 rounded-xl border border-slate-800/80 max-h-56 overflow-y-auto">
            {gerarMemorialTexto()}
          </pre>
        </div>
      </div>
    </div>
  );
};
