import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  UserCheck,
  Building2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Check,
  HeartHandshake,
  FileText,
  BadgeAlert,
  Sparkles,
} from 'lucide-react';
import { useAuth, formatarCpf, aplicarMascaraCpf, aplicarMascaraTelefone } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { TipoUsuario } from '../types';

export const AuthGatekeeper: React.FC = () => {
  const { loginWithGovBr, cadastrarUsuario, validarCpf } = useAuth();
  const [activeTab, setActiveTab] = useState<'govbr' | 'cadastro'>('govbr');

  // Gov.br state
  const [govBrCpf, setGovBrCpf] = useState('123.456.789-09');
  const [govBrNome, setGovBrNome] = useState('Carla Mendonça de Assis');
  const [govBrNivel, setGovBrNivel] = useState<'ouro' | 'prata' | 'bronze'>('ouro');
  const [govBrLoading, setGovBrLoading] = useState(false);
  const [govBrError, setGovBrError] = useState('');

  // Cadastro state
  const [cadastroStep, setCadastroStep] = useState<1 | 2 | 3>(1);
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>('mae_pai_atipico');
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('SP');

  // Laudo state
  const [cid, setCid] = useState('F84.0');
  const [numeroLaudo, setNumeroLaudo] = useState('');
  const [medicoNome, setMedicoNome] = useState('');
  const [crm, setCrm] = useState('');
  const [dataEmissaoLaudo, setDataEmissaoLaudo] = useState('');
  const [possuiCiptea, setPossuiCiptea] = useState(true);
  const [numeroCiptea, setNumeroCiptea] = useState('');
  const [orgaoEmissorCiptea, setOrgaoEmissorCiptea] = useState('SEDPcD/SP');

  // Consent
  const [termoLgpd, setTermoLgpd] = useState(false);
  const [termoVeracidade, setTermoVeracidade] = useState(false);
  const [formError, setFormError] = useState('');

  // Quick Demo Profiles
  const loadDemoGovBr = (perfil: 'mae' | 'autista') => {
    if (perfil === 'mae') {
      setGovBrCpf('249.882.170-86');
      setGovBrNome('Mariana Albuquerque Castro');
      setGovBrNivel('ouro');
    } else {
      setGovBrCpf('315.674.920-61');
      setGovBrNome('Lucas Fernandes Silva');
      setGovBrNivel('prata');
    }
    setGovBrError('');
  };

  const loadDemoCadastro = () => {
    setNome('Juliana Silveira Ramos');
    setCpf('249.882.170-86');
    setEmail('juliana.ramos@exemplo.com.br');
    setTelefone('(11) 98123-4567');
    setDataNascimento('1991-04-22');
    setCidade('Campinas');
    setUf('SP');
    setTipoUsuario('mae_pai_atipico');
    setCid('F84.0');
    setNumeroLaudo('LAU-2024-SP-7719');
    setMedicoNome('Dr. Carlos Eduardo Meirelles');
    setCrm('138920/SP');
    setDataEmissaoLaudo('2024-02-15');
    setPossuiCiptea(true);
    setNumeroCiptea('CIPTEA-SP-88301');
    setOrgaoEmissorCiptea('SEDPcD/SP');
    setTermoLgpd(true);
    setTermoVeracidade(true);
    setFormError('');
  };

  const handleGovBrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGovBrError('');

    const cleanCpf = govBrCpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      setGovBrError('Digite um CPF com 11 dígitos.');
      return;
    }

    if (!validarCpf(cleanCpf)) {
      setGovBrError('O CPF informado possui dígitos verificadores inválidos segundo a Receita Federal.');
      return;
    }

    setGovBrLoading(true);
    try {
      await loginWithGovBr({
        cpf: formatarCpf(govBrCpf),
        nome: govBrNome || 'Cidadão Identificado via gov.br',
        nivel: govBrNivel,
      });
    } catch {
      setGovBrError('Falha temporária ao comunicar com a autoridade gov.br.');
    } finally {
      setGovBrLoading(false);
    }
  };

  const handleCadastroStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!nome.trim()) {
      setFormError('Por favor informe o nome completo.');
      return;
    }

    const cleanCpf = cpf.replace(/\D/g, '');
    if (!validarCpf(cleanCpf)) {
      setFormError('CPF inválido. Certifique-se de digitar um CPF brasileiro válido.');
      return;
    }

    if (!email.includes('@')) {
      setFormError('E-mail institucional ou pessoal inválido.');
      return;
    }

    if (!cidade.trim()) {
      setFormError('Informe a cidade de residência.');
      return;
    }

    setCadastroStep(2);
  };

  const handleCadastroStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!medicoNome.trim()) {
      setFormError('Informe o nome do médico assistente que emitiu o laudo.');
      return;
    }
    if (!crm.trim()) {
      setFormError('Informe o CRM e UF do médico.');
      return;
    }

    setCadastroStep(3);
  };

  const handleCadastroFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!termoLgpd || !termoVeracidade) {
      setFormError('É obrigatório consentir com a LGPD e declarar a veracidade das informações.');
      return;
    }

    try {
      await cadastrarUsuario({
        authProvider: 'cadastro_direto',
        nome,
        cpf: formatarCpf(cpf),
        email,
        telefone,
        tipoUsuario,
        dataNascimento: dataNascimento || '1990-01-01',
        cidade,
        uf,
        laudo: {
          numeroLaudo: numeroLaudo || 'LAU-REG-2026',
          cid,
          medicoNome,
          crm,
          dataEmissao: dataEmissaoLaudo || new Date().toISOString().split('T')[0],
          possuiCiptea,
          numeroCiptea: possuiCiptea ? numeroCiptea || 'CIPTEA-EMITIDA' : undefined,
          orgaoEmissorCiptea: possuiCiptea ? orgaoEmissorCiptea : undefined,
        },
      });
    } catch {
      setFormError('Erro ao finalizar cadastro.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Notice */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 py-3 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <BrandLogo size="md" />
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-full px-3 py-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Ambiente Seguro e Criptografado</span>
            <span className="text-emerald-500">•</span>
            <span>LGPD Lei 13.709/18</span>
          </div>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Institutional Header */}
          <div className="bg-gradient-to-r from-[#0F233D] via-slate-900 to-[#0F233D] p-6 border-b border-slate-800 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-2">
                <Lock className="w-3.5 h-3.5" />
                Acesso Restrito & Protegido
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Identificação Obrigatória do Cidadão
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
                Em respeito à segurança de dados e à autodefesa jurídica de famílias atípicas, o acesso ao GuiaLegal TEA é exclusivo após identificação com o padrão <strong>gov.br</strong> ou <strong>cadastro validado com laudo</strong>.
              </p>
            </div>

            <div className="mt-4 sm:mt-0 shrink-0 flex flex-col items-center sm:items-end">
              <span className="text-[11px] text-slate-400">Padrão Nacional de Segurança</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-200 text-xs font-bold border border-blue-700/50">
                  gov.br
                </span>
                <span className="px-2 py-0.5 rounded bg-teal-900/60 text-teal-200 text-xs font-bold border border-teal-700/50">
                  CIPTEA
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 text-xs font-bold border border-amber-700/50">
                  BPC/LOAS
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/40">
            <button
              onClick={() => setActiveTab('govbr')}
              className={`py-4 px-4 text-center font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition ${
                activeTab === 'govbr'
                  ? 'bg-slate-900 text-teal-300 border-b-2 border-teal-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                br
              </div>
              <span>Entrar com gov.br</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-semibold bg-blue-950 text-blue-300 border border-blue-800/60 px-1.5 py-0.5 rounded">
                Recomendado
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cadastro')}
              className={`py-4 px-4 text-center font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition ${
                activeTab === 'cadastro'
                  ? 'bg-slate-900 text-teal-300 border-b-2 border-teal-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <FileCheck2 className="w-5 h-5 text-teal-400" />
              <span>Cadastro Validado (Laudo/TEA)</span>
            </button>
          </div>

          {/* TAB 1: GOV.BR AUTHENTICATION */}
          {activeTab === 'govbr' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-center gap-5 justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#002D62] border border-blue-400/30 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
                    gov<span className="text-emerald-400">.br</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      Conta Cidadão da República Federativa do Brasil
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Permite autenticação com verificação de identidade em nível Prata ou Ouro com integração à base da CIPTEA e Meu INSS.
                    </p>
                  </div>
                </div>

                {/* Quick preset selector for evaluators */}
                <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => loadDemoGovBr('mae')}
                    className="flex-1 sm:flex-initial text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    Simular Mãe Atípica (Ouro)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadDemoGovBr('autista')}
                    className="flex-1 sm:flex-initial text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    Simular Autista (Prata)
                  </button>
                </div>
              </div>

              {govBrError && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
                  <BadgeAlert className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{govBrError}</span>
                </div>
              )}

              <form onSubmit={handleGovBrSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Número do CPF do Cidadão *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={govBrCpf}
                      onChange={(e) => setGovBrCpf(aplicarMascaraCpf(e.target.value))}
                      placeholder="Digite apenas os 11 números"
                      maxLength={14}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                    <span className="text-[11px] text-teal-400 mt-1 block">
                      Digite apenas os números. Os pontos e o traço são inseridos automaticamente.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={govBrNome}
                      onChange={(e) => setGovBrNome(e.target.value)}
                      placeholder="Nome completo conforme Receita Federal"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nível de Confiabilidade da Conta gov.br
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['ouro', 'prata', 'bronze'] as const).map((nivel) => (
                      <button
                        type="button"
                        key={nivel}
                        onClick={() => setGovBrNivel(nivel)}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                          govBrNivel === nivel
                            ? 'bg-blue-950/70 border-blue-400 text-white ring-1 ring-blue-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Selo {nivel}
                          </span>
                          {govBrNivel === nivel && (
                            <Check className="w-3.5 h-3.5 text-blue-400" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1">
                          {nivel === 'ouro'
                            ? 'Validação Facial / Certificado Digital'
                            : nivel === 'prata'
                            ? 'Validação Bancária / SIGEPE'
                            : 'Validação Básica'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={govBrLoading}
                    className="w-full bg-gradient-to-r from-[#003366] via-[#0055A5] to-[#0072C6] hover:brightness-110 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition active:scale-[0.99] flex items-center justify-center gap-3 text-sm sm:text-base disabled:opacity-50"
                  >
                    {govBrLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Autenticando com Servidores gov.br...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-sm bg-white text-blue-900 font-black text-[9px] flex items-center justify-center">
                          br
                        </div>
                        <span>Autenticar com gov.br e Acessar GuiaLegal TEA</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Criptografia de ponta a ponta</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  <UserCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Apenas autodefesa e fins legítimos</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Em conformidade com a Lei 14.063/20</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED VALIDATED REGISTRATION */}
          {activeTab === 'cadastro' && (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between max-w-md mx-auto mb-6">
                {[
                  { num: 1, title: 'Identificação' },
                  { num: 2, title: 'Laudo / TEA' },
                  { num: 3, title: 'Termos & Acesso' },
                ].map((s, idx) => (
                  <React.Fragment key={s.num}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          cadastroStep === s.num
                            ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-300'
                            : cadastroStep > s.num
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {cadastroStep > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                      </div>
                      <span className="text-xs font-medium text-slate-300 hidden sm:inline">
                        {s.title}
                      </span>
                    </div>
                    {idx < 2 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 transition ${
                          cadastroStep > idx + 1 ? 'bg-emerald-600' : 'bg-slate-800'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Demo Fill Helper */}
              <div className="flex items-center justify-between bg-teal-950/30 border border-teal-800/30 rounded-xl p-3 text-xs text-teal-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  Preenchimento assistido para avaliação:
                </span>
                <button
                  type="button"
                  onClick={loadDemoCadastro}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-3 py-1 rounded-lg text-xs transition"
                >
                  Preencher com Dados Válidos de Teste
                </button>
              </div>

              {formError && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* STEP 1: Personal Identification */}
              {cadastroStep === 1 && (
                <form onSubmit={handleCadastroStep1} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Perfil do Usuário Cadastrante *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        {
                          id: 'mae_pai_atipico',
                          label: 'Mãe / Pai Atípico',
                          desc: 'Genitor de pessoa no espectro autista',
                        },
                        {
                          id: 'autista_autodefensor',
                          label: 'Autista Autodefensor',
                          desc: 'Própria pessoa com diagnóstico de TEA',
                        },
                        {
                          id: 'responsavel_legal',
                          label: 'Responsável Legal / Tutor',
                          desc: 'Guardião legal ou curador',
                        },
                        {
                          id: 'advogado_defensor',
                          label: 'Advogado / Defensor Público',
                          desc: 'Atuação profissional em defesa de direitos',
                        },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setTipoUsuario(item.id as TipoUsuario)}
                          className={`p-3 rounded-xl border text-left transition ${
                            tipoUsuario === item.id
                              ? 'bg-teal-950/50 border-teal-400 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold text-white">{item.label}</div>
                          <div className="text-[11px] text-slate-400">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Nome Completo do Cadastrante *
                      </label>
                      <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex: Mariana Silva e Santos"
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        CPF (com validação estrita) *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={cpf}
                        onChange={(e) => setCpf(aplicarMascaraCpf(e.target.value))}
                        placeholder="Digite apenas os 11 números"
                        maxLength={14}
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                      />
                      <span className="text-[11px] text-teal-400 mt-1 block">
                        Digite apenas os números. Os pontos e o traço são inseridos automaticamente.
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        E-mail de Notificações *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com.br"
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Telefone / WhatsApp (Para SOS)
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={telefone}
                        onChange={(e) => setTelefone(aplicarMascaraTelefone(e.target.value))}
                        placeholder="Apenas DDD e número"
                        maxLength={15}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Máscara automática (DDD + 9 dígitos)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="col-span-2 sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Município de Residência *
                      </label>
                      <input
                        type="text"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        placeholder="Ex: São Paulo"
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        UF *
                      </label>
                      <select
                        value={uf}
                        onChange={(e) => setUf(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                      >
                        {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map((sigla) => (
                          <option key={sigla} value={sigla}>{sigla}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                    >
                      <span>Avançar para Dados do Laudo & TEA</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Medical Report & CIPTEA */}
              {cadastroStep === 2 && (
                <form onSubmit={handleCadastroStep2} className="space-y-4">
                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                    <HeartHandshake className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <p>
                      A Lei Federal nº 12.764/2012 (Lei Berenice Piana) e a Lei nº 13.977/2020 (Lei Romeo Mion) asseguram que o laudo médico que atesta o TEA possui validade indeterminada em diversos estados brasileiros e fundamenta a expedição da CIPTEA.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Classificação Internacional de Doenças (CID) *
                      </label>
                      <select
                        value={cid}
                        onChange={(e) => setCid(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                      >
                        <option value="F84.0">CID-10 F84.0 - Autismo Infantil</option>
                        <option value="F84.1">CID-10 F84.1 - Autismo Atípico</option>
                        <option value="F84.5">CID-10 F84.5 - Síndrome de Asperger</option>
                        <option value="F84.9">CID-10 F84.9 - Transtorno Invasivo do Desenvolvimento NE</option>
                        <option value="6A02">CID-11 6A02 - Transtorno do Espectro do Autismo (TEA)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Identificador / Número do Laudo
                      </label>
                      <input
                        type="text"
                        value={numeroLaudo}
                        onChange={(e) => setNumeroLaudo(e.target.value)}
                        placeholder="Ex: LAU-2024-SP-8839"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Médico(a) Assistente Emissor *
                      </label>
                      <input
                        type="text"
                        value={medicoNome}
                        onChange={(e) => setMedicoNome(e.target.value)}
                        placeholder="Ex: Dr. Roberto Alcantara (Neuropediatra/Psiquiatra)"
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        CRM e UF *
                      </label>
                      <input
                        type="text"
                        value={crm}
                        onChange={(e) => setCrm(e.target.value)}
                        placeholder="Ex: 123456/SP"
                        required
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">
                          Possui a Carteira CIPTEA (Lei Romeo Mion)?
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Identificação oficial que garante prioridade imediata
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPossuiCiptea(!possuiCiptea)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                          possuiCiptea ? 'bg-teal-500 justify-end' : 'bg-slate-800 justify-start'
                        }`}
                      >
                        <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                      </button>
                    </div>

                    {possuiCiptea && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">
                            Número da CIPTEA
                          </label>
                          <input
                            type="text"
                            value={numeroCiptea}
                            onChange={(e) => setNumeroCiptea(e.target.value)}
                            placeholder="Ex: CIPTEA-SP-002931"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">
                            Órgão Emissor
                          </label>
                          <input
                            type="text"
                            value={orgaoEmissorCiptea}
                            onChange={(e) => setOrgaoEmissorCiptea(e.target.value)}
                            placeholder="Ex: Secretaria dos Direitos da PcD"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setCadastroStep(1)}
                      className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-4 rounded-xl text-xs transition"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 text-sm"
                    >
                      <span>Avançar para Termos & LGPD</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: LGPD Terms & Confirmation */}
              {cadastroStep === 3 && (
                <form onSubmit={handleCadastroFinal} className="space-y-5">
                  <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 text-xs text-slate-300 space-y-3">
                    <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
                      <FileText className="w-4 h-4" />
                      Termo de Proteção e Tratamento de Dados (LGPD - Lei 13.709/2018)
                    </div>
                    <p className="leading-relaxed text-[11px] text-slate-400">
                      Os dados inseridos no GuiaLegal TEA são classificados como dados sensíveis (saúde e deficiência) nos termos do Art. 11 da LGPD. Todos os dados permanecem armazenados prioritariamente de forma local (offline-first) no seu próprio navegador e cofre digital criptografado, sendo utilizados única e exclusivamente para geração de dossiês jurídicos, cálculo de direitos previdenciários e autodefesa.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                      <input
                        type="checkbox"
                        checked={termoLgpd}
                        onChange={(e) => setTermoLgpd(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-teal-600 bg-slate-900 border-slate-700 focus:ring-teal-500"
                      />
                      <span className="text-xs text-slate-300">
                        Autorizo expressamente o tratamento dos dados pessoais e dados de saúde para fins exclusivos de autodefesa jurídica, cálculo de BPC e gestão do Passaporte Sensorial.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                      <input
                        type="checkbox"
                        checked={termoVeracidade}
                        onChange={(e) => setTermoVeracidade(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-teal-600 bg-slate-900 border-slate-700 focus:ring-teal-500"
                      />
                      <span className="text-xs text-slate-300">
                        Declaro sob as penas da lei que as informações prestadas são verdadeiras e que sou a própria pessoa autista, genitor(a) ou tutor(a) legal constituído(a).
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setCadastroStep(2)}
                      className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3.5 px-4 rounded-xl text-xs transition"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-teal-900/30"
                    >
                      <Check className="w-4 h-4" />
                      <span>Concluir Cadastro e Ingressar na Plataforma</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer Informative Links */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-4 py-4 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GuiaLegal TEA © 2026 — Plataforma Pública de Autodefesa e Cidadania</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-teal-400 transition cursor-pointer">Lei Berenice Piana (12.764/12)</span>
            <span>•</span>
            <span className="hover:text-teal-400 transition cursor-pointer">Estatuto PcD (13.146/15)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
