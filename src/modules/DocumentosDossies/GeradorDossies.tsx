import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Sparkles,
  Scale,
  Send,
  Building,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../../components/BrandLogo';
import { copiarTexto } from '../../utils/clipboard';

export const GeradorDossies: React.FC = () => {
  const { user } = useAuth();

  const [tipoDossie, setTipoDossie] = useState<
    | 'mp_escola'
    | 'ans_plano'
    | 'inss_bpc'
    | 'trabalho_reducao'
  >('mp_escola');

  const [orgaoDestinatario, setOrgaoDestinatario] = useState(
    'Ao Ilustríssimo Senhor Promotor de Justiça da Promotoria de Justiça da Infância, Juventude e dos Direitos da Pessoa com Deficiência do Ministério Público Estadual'
  );
  const [fatos, setFatos] = useState(
    'O requerente buscou a matrícula escolar de seu filho com autismo e o colégio informou a cobrança compulsória de uma taxa extra mensal de R$ 850,00 para fornecimento do mediador escolar, sob alegação de custos operacionais extras.'
  );
  const [pedidos, setPedidos] = useState(
    '1. A instauração imediata de Procedimento Preparatório / Inquérito Civil;\n2. A expedição de Recomendação Ministerial para cessação imediata da cobrança da taxa extra;\n3. A apuração da prática do crime previsto no Art. 8º da Lei nº 7.853/1989 c/c Art. 28 da Lei nº 13.146/2015.'
  );

  const [gerandoIa, setGerandoIa] = useState(false);
  const [dossieGerado, setDossieGerado] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Sync default texts when user switches type
  const handleMudarTipo = (tipo: typeof tipoDossie) => {
    setTipoDossie(tipo);
    if (tipo === 'mp_escola') {
      setOrgaoDestinatario(
        'Ao Ilustríssimo Senhor Promotor de Justiça da Promotoria dos Direitos da Pessoa com Deficiência do Ministério Público Estadual'
      );
      setFatos(
        'A instituição de ensino condicionou a matrícula do aluno com Transtorno do Espectro Autista (TEA) ao pagamento compulsório de taxa extra de acompanhante / mediador, em afronta direta ao Estatuto da Pessoa com Deficiência e ao julgamento vinculante da ADI 5357 pelo STF.'
      );
      setPedidos(
        '1. A instauração de Inquérito Civil contra a instituição de ensino;\n2. A expedição de Recomendação Ministerial determinando a cessação imediata de qualquer taxa extra;\n3. A remessa de peças à autoridade policial para apuração do crime do Art. 8º da Lei nº 7.853/1989.'
      );
    } else if (tipo === 'ans_plano') {
      setOrgaoDestinatario(
        'À Diretoria de Fiscalização da Agência Nacional de Saúde Suplementar (ANS) e Núcleo de Defesa do Consumidor (PROCON)'
      );
      setFatos(
        'A operadora de plano de saúde limitou ou recusou o custeio das sessões de Terapia ABA, Fonoaudiologia e Terapia Ocupacional prescritas pelo médico assistente, desrespeitando as Resoluções Normativas ANS nº 469/2021 e nº 539/2022 e a Lei Federal nº 14.454/2022.'
      );
      setPedidos(
        '1. A aplicação das sanções administrativas e multas regulatórias cabíveis contra a operadora;\n2. A determinação de autorização imediata e integral de todas as sessões prescritas no prazo de 24 horas;\n3. O reembolso integral das despesas despendidas em razão da recusa indevida.'
      );
    } else if (tipo === 'inss_bpc') {
      setOrgaoDestinatario(
        'Ao Instituto Nacional do Seguro Social (INSS) - Agência da Previdência Social / Junta de Recursos da Previdência Social'
      );
      setFatos(
        'Requerimento de concessão do Benefício de Prestação Continuada (BPC/LOAS) à pessoa com TEA com aplicação das deduções legais obrigatórias de gastos com saúde, medicamentos contínuos, fraldas e terapias particulares não fornecidas pelo SUS, conforme expressa previsão da Lei Federal nº 14.176/2021.'
      );
      setPedidos(
        '1. A homologação do Memorial de Cálculo de Renda Líquida com a dedução comprovada dos gastos de saúde;\n2. A designação imediata de Perícia Médica e Avaliação Social com garantia de presença de acompanhante;\n3. A concessão e implantação do benefício mensal de 1 Salário Mínimo retroativo à Data de Entrada do Requerimento (DER).'
      );
    } else {
      setOrgaoDestinatario(
        'Ao Departamento de Gestão de Pessoas / Recursos Humanos do Empregador ou Órgão Público'
      );
      setFatos(
        'O(A) trabalhador(a) é genitor(a) de pessoa com autismo que necessita de acompanhamento diário intensivo em terapias multidisciplinares, requerendo horário especial com redução da jornada de trabalho sem compensação e sem redução salarial, na forma do Tema 1097 do STF e Lei 13.370/2016.'
      );
      setPedidos(
        '1. A concessão imediata da redução de até 50% da jornada semanal de trabalho sem prejuízo remuneratório;\n2. A adequação da escala de trabalho às necessidades terapêuticas do dependente com TEA.'
      );
    }
  };

  const handleGerarDossie = async () => {
    setGerandoIa(true);
    try {
      const res = await fetch('/api/gemini/dossier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoDossie:
            tipoDossie === 'mp_escola'
              ? 'Representação ao Ministério Público por Violação Escolar'
              : tipoDossie === 'ans_plano'
              ? 'Reclamação à ANS e Notificação ao Plano de Saúde'
              : tipoDossie === 'inss_bpc'
              ? 'Requerimento de BPC ao INSS com Deduções Legais'
              : 'Requerimento de Redução de Jornada de Trabalho (Tema 1097 STF)',
          dadosUsuario: {
            nome: user?.nome,
            cpf: user?.cpf,
            cidade: user?.cidade,
            uf: user?.uf,
            cid: user?.laudo.cid,
            ciptea: user?.laudo.numeroCiptea,
          },
          fatos,
          pedidosEspecificos: pedidos,
        }),
      });

      const data = await res.json();
      if (data.textoFormatado) {
        setDossieGerado(data.textoFormatado);
      } else {
        gerarFallbackLocal();
      }
    } catch {
      gerarFallbackLocal();
    } finally {
      setGerandoIa(false);
    }
  };

  const gerarFallbackLocal = () => {
    const nome = user?.nome || '[NOME DO REQUERENTE]';
    const cpf = user?.cpf || '[CPF DO REQUERENTE]';
    const cid = user?.laudo.cid || 'F84.0';

    const texto = `${orgaoDestinatario.toUpperCase()}

REQUERENTE / NOTIFICANTE:
${nome}, nacionalidade brasileira, inscrito(a) no CPF sob o nº ${cpf}, residente e domiciliado(a) em ${user?.cidade || '[CIDADE]'}/${user?.uf || 'UF'}, na qualidade de representante legal de dependente com Transtorno do Espectro Autista (CID ${cid}),

Vem, respeitosamente, à ilustre presença de Vossa Senhoria / Excelência, com esteio nas garantias fundamentais da Constituição da República Federativa do Brasil, na Lei Federal nº 12.764/2012 (Lei Berenice Piana), na Lei Federal nº 13.146/2015 (Estatuto da Pessoa com Deficiência) e demais normativas de regência, apresentar a presente:

REPRESENTAÇÃO / REQUERIMENTO DE DIREITOS DA PESSOA COM AUTISMO

1. DOS FATOS CIRCUNSTANCIADOS:
${fatos}

2. DOS FUNDAMENTOS JURÍDICOS:
A Convenção Internacional sobre os Direitos das Pessoas com Deficiência (promulgada pelo Decreto nº 6.949/2009 com status de Emenda Constitucional, nos termos do Art. 5º, § 3º da CF/88) estabelece como princípio basilar o respeito pela dignidade inerente, a autonomia individual e a plena inclusão social.
Ademais, o Art. 1º, § 2º da Lei Federal nº 12.764/2012 equipara a pessoa com TEA à pessoa com deficiência para todos os efeitos de direito, vedando condutas discriminatórias e impondo ao Estado e à sociedade o dever de assegurar a prioridade absoluta e a efetividade das prestações materiais necessárias à sua vida digna.

3. DOS PEDIDOS E REQUERIMENTOS FINAIS:
Diante de todo o exposto, REQUER:
${pedidos}

Protesta provar o alegado por todos os meios em direito admitidos, especialmente pela juntada dos laudos médicos, prescrições e comprovantes anexos ao presente dossiê.

Nestes termos, pede e espera pronto deferimento.
Local e Data: ${user?.cidade || 'Brasil'}, ${new Date().toLocaleDateString('pt-BR')}

___________________________________________________
${nome}
CPF nº ${cpf}`;

    setDossieGerado(texto);
  };

  const handleCopy = () => {
    if (!dossieGerado) return;
    copiarTexto(dossieGerado).then((ok) => {
      if (!ok) return;
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="no-print bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-950 p-6 rounded-3xl border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-bold uppercase mb-2 border border-teal-500/30">
            <Scale className="w-3.5 h-3.5" />
            Peças Jurídicas Prontas para Protocolo
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Gerador Automatizado de Dossiês Jurídicos
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Crie petições, representações ao Ministério Público, reclamações formais à ANS e requerimentos do INSS com fundamentação legal irretocável e layout de documento oficial timbrado pronto para imprimir ou protocolar.
          </p>
        </div>
      </div>

      {/* Select Type Tabs */}
      <div className="no-print grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          {
            id: 'mp_escola',
            label: 'Ministério Público (Escola)',
            desc: 'Recusa de Matrícula ou Taxa Extra',
          },
          {
            id: 'ans_plano',
            label: 'ANS & Procon (Plano)',
            desc: 'Negativa de Terapias / ABA',
          },
          {
            id: 'inss_bpc',
            label: 'INSS (BPC com Deduções)',
            desc: 'Requerimento com Gastos de Saúde',
          },
          {
            id: 'trabalho_reducao',
            label: 'Trabalho / Horário Especial',
            desc: 'Tema 1097 STF / Lei 13.370',
          },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => handleMudarTipo(item.id as any)}
            className={`p-3.5 rounded-2xl border text-left transition ${
              tipoDossie === item.id
                ? 'bg-teal-950/60 border-teal-400 text-white ring-1 ring-teal-400 shadow-md'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold text-white">{item.label}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
          </button>
        ))}
      </div>

      {/* Input Parameters Box */}
      <div className="no-print bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4 shadow-xl">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Parâmetros do Dossiê</h3>
          <span className="text-xs text-slate-400">Qualificação do usuário já pré-carregada</span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Órgão Destinatário da Peça *</label>
            <input
              type="text"
              value={orgaoDestinatario}
              onChange={(e) => setOrgaoDestinatario(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Dos Fatos Circunstanciados (Relato) *</label>
            <textarea
              value={fatos}
              onChange={(e) => setFatos(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Dos Pedidos Concretos *</label>
            <textarea
              value={pedidos}
              onChange={(e) => setPedidos(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleGerarDossie}
              disabled={gerandoIa}
              className="w-full bg-gradient-to-r from-teal-500 via-cyan-600 to-teal-600 hover:brightness-110 text-white font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-xl shadow-teal-950/40 disabled:opacity-50"
            >
              {gerandoIa ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Estruturando Dossiê Jurídico com IA Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-200" />
                  <span>Gerar Dossiê Formal Pronto para Protocolar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Official Document Display (Optimized for Screen & Print) */}
      {(dossieGerado || !dossieGerado) && (
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
          <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <FileText className="w-5 h-5 text-teal-400" />
              <span>Peça Jurídica Oficial Gerada</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold border border-slate-700 transition shadow"
              >
                <Printer className="w-4 h-4 text-teal-400" />
                <span>Imprimir / Salvar em PDF</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Texto Integral</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Timbre & Official Document Layout */}
          <div className="printable-dossier bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl max-w-4xl mx-auto font-serif leading-relaxed text-sm">
            {/* Timbre Header */}
            <div className="text-center border-b-2 border-slate-300 pb-6 mb-6">
              <div className="h-16 mx-auto mb-3 flex items-center justify-center">
                <img src="/logo_horizontal.png" alt="GuiaLegal TEA Logo Oficial" className="h-16 w-auto object-contain" />
              </div>
              <h1 className="font-sans font-black text-slate-900 tracking-wider text-sm uppercase">
                REPÚBLICA FEDERATIVA DO BRASIL
              </h1>
              <div className="font-sans text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                Fundamentado na Lei Federal nº 12.764/2012 e Lei Federal nº 13.146/2015
              </div>
            </div>

            {/* Document Body */}
            <pre className="font-serif whitespace-pre-wrap text-slate-900 text-sm leading-relaxed">
              {dossieGerado ||
                (gerarFallbackLocal(),
                `Clique no botão acima "Gerar Dossiê Formal Pronto para Protocolar" para estruturar a peça com seus dados.`)}
            </pre>

            {/* Official Footer */}
            <div className="mt-12 pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400 font-sans">
              Documento gerado pela plataforma pública GuiaLegal TEA para exercício de autodefesa e cidadania.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
