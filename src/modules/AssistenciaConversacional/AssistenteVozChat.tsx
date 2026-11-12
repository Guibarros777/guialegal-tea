import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Scale,
  FileText,
  Copy,
  Check,
  Building,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage, IncidentTriageResult } from '../../types';
import { copiarTexto } from '../../utils/clipboard';

export const AssistenteVozChat: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'triagem'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content:
        'Olá! Sou o Assistente Jurídico do GuiaLegal TEA. Posso tirar dúvidas sobre a Lei Berenice Piana (Lei 12.764/12), cálculo e recurso de BPC/LOAS no INSS, negativas de planos de saúde, direitos na escola inclusiva e redução de jornada de trabalho. Como posso ajudar você hoje?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  // Speech Recognition (Voice Input)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Speech Synthesis (Audio Output)
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Incident Triage State
  const [relatoIncidente, setRelatoIncidente] = useState('');
  const [categoriaIncidente, setCategoriaIncidente] = useState('Escola / Educação');
  const [localIncidente, setLocalIncidente] = useState('');
  const [loadingTriagem, setLoadingTriagem] = useState(false);
  const [resultadoTriagem, setResultadoTriagem] = useState<IncidentTriageResult | null>(null);
  const [copiedNotif, setCopiedNotif] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'pt-BR';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Reconhecimento de voz não suportado neste navegador.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Speak text with humanized calm rate
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95; // slightly calmer cadence for autistic ease of processing
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Send Chat Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || loadingChat) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoadingChat(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages.slice(-5),
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Desculpe, não consegui formular a resposta.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Local fallback
      const assistantMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content:
          'A Lei Federal nº 12.764/2012 assegura que a pessoa com Transtorno do Espectro Autista é equiparada à pessoa com deficiência para todos os efeitos legais, tendo prioridade absoluta em serviços públicos e privados, vedada qualquer taxa extra em escolas (STF ADI 5357) e sem limite de sessões de terapias nos planos de saúde (RN 469/539 ANS).',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoadingChat(false);
    }
  };

  // Incident Triage
  const handleTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relatoIncidente.trim() || loadingTriagem) return;

    setLoadingTriagem(true);
    try {
      const res = await fetch('/api/gemini/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relato: relatoIncidente,
          categoria: categoriaIncidente,
          local: localIncidente,
        }),
      });

      const data = await res.json();
      setResultadoTriagem(data);
    } catch {
      setResultadoTriagem({
        gravidade: 'ALTA',
        violacoesIdentificadas: [
          'Possível violação da Lei 12.764/2012 (Lei Berenice Piana)',
          'Possível infração ao Estatuto da Pessoa com Deficiência (Lei 13.146/2015)',
        ],
        enquadramentoLegal: 'Art. 1º, § 2º da Lei 12.764/2012 e Art. 88 da Lei 13.146/2015.',
        orientacaoImediata: [
          'Documente a negativa com protocolo ou testemunhas.',
          'Apresente o artigo de lei no GuiaLegal TEA.',
          'Acione o Ministério Público ou Defensoria Pública.',
        ],
        orgaosAcionaveis: ['Defensoria Pública', 'Ministério Público', 'Disque 100'],
        modeloNotificacao: 'NOTIFICAÇÃO EXTRAJUDICIAL DE CUMPRIMENTO IMEDIATO DA LEI 12.764/2012...',
      });
    } finally {
      setLoadingTriagem(false);
    }
  };

  const handleCopyNotif = () => {
    if (!resultadoTriagem?.modeloNotificacao) return;
    copiarTexto(resultadoTriagem.modeloNotificacao).then((ok) => {
      if (!ok) return;
      setCopiedNotif(true);
      setTimeout(() => setCopiedNotif(false), 2000);
    });
  };

  const quickQuestions = [
    'A escola pode cobrar taxa pelo mediador?',
    'Como calcular BPC deduzindo remédios e fraldas?',
    'Plano de saúde pode limitar sessões de ABA?',
    'Como pedir redução de jornada de trabalho?',
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-950 p-6 rounded-3xl border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-bold uppercase mb-2 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Inteligência Artificial Gemini Especializada em Direito TEA
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Assistente Jurídico por Voz & Triagem de Incidentes
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Tire dúvidas com respostas orientadas pela legislação brasileira, use a voz com leitura acessível em áudio ou faça a triagem imediata de uma violação para descobrir gravidade, artigos infringidos e órgãos para acionar.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'chat' ? 'bg-teal-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat & Voz</span>
          </button>
          <button
            onClick={() => setActiveTab('triagem')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'triagem' ? 'bg-teal-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Triagem de Incidentes</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CONVERSATIONAL CHAT & VOICE */}
      {activeTab === 'chat' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[600px]">
          {/* Chat Top Bar */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">GuiaLegal TEA AI</h4>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Base jurídica federal atualizada (2026)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => speakText(messages[messages.length - 1]?.content || '')}
                className={`p-2 rounded-xl text-xs transition border flex items-center gap-1.5 ${
                  isSpeaking
                    ? 'bg-rose-950 border-rose-600 text-rose-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Ouvir última resposta em voz alta"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-teal-400" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Parar Voz' : 'Ouvir'}</span>
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-100 border border-slate-800 shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {loadingChat && (
              <div className="flex items-center gap-2 text-xs text-teal-400 bg-slate-950 p-3 rounded-2xl border border-slate-800 w-fit">
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce delay-200" />
                <span className="text-[11px] ml-1">Consultando precedentes e leis...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 flex gap-2 overflow-x-auto no-scrollbar text-[11px]">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputMessage(q);
                }}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl transition ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title={isListening ? 'Parar gravação de voz' : 'Falar pergunta por voz'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-teal-400" />}
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isListening ? 'Ouvindo... pode falar' : 'Digite ou fale sua dúvida jurídica sobre autismo...'}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />

            <button
              type="submit"
              disabled={loadingChat || !inputMessage.trim()}
              className="bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white p-3 rounded-xl transition shadow active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: INCIDENT TRIAGE */}
      {activeTab === 'triagem' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>Triagem de Incidentes e Violações em Tempo Real</span>
              </h3>
              <p className="text-xs text-slate-400">
                Conte o que aconteceu (ex: plano negou terapias, escola cobrou taxa, segurança foi grosseiro, INSS indeferiu). A IA enquadra a lei, define a gravidade e prepara a notificação.
              </p>
            </div>

            <form onSubmit={handleTriageSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Categoria Principal *</label>
                  <select
                    value={categoriaIncidente}
                    onChange={(e) => setCategoriaIncidente(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Escola / Educação">Escola / Educação (Taxa ou Recusa)</option>
                    <option value="Plano de Saúde / Terapias">Plano de Saúde (Negativa ou Limite de ABA)</option>
                    <option value="Acesso a Estabelecimento / Consumo">Acesso a Estabelecimento / Consumo</option>
                    <option value="Transporte / Mobilidade">Transporte / Mobilidade / Passe Livre</option>
                    <option value="INSS / Previdência">INSS / BPC / Perícia Médica</option>
                    <option value="Ambiente de Trabalho">Ambiente de Trabalho / Horário Especial</option>
                    <option value="Abordagem Policial / Urgência">Abordagem Policial / Crise de Segurança</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Local / Cidade onde ocorreu</label>
                  <input
                    type="text"
                    value={localIncidente}
                    onChange={(e) => setLocalIncidente(e.target.value)}
                    placeholder="Ex: Shopping Center em Campinas/SP"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Relato do que aconteceu (seja detalhado) *
                </label>
                <textarea
                  value={relatoIncidente}
                  onChange={(e) => setRelatoIncidente(e.target.value)}
                  placeholder="Ex: Fui matricular meu filho de 6 anos com diagnóstico de autismo na escola e o diretor exigiu pagamento extra de R$ 900 para o cuidador, afirmando que sem o valor a escola não tem como recebê-lo..."
                  rows={4}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loadingTriagem}
                className="w-full bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 hover:brightness-110 text-white font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 text-xs sm:text-sm shadow-xl disabled:opacity-50"
              >
                {loadingTriagem ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Realizando Triagem Jurídica e Enquadramento Legal...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Realizar Triagem com Inteligência Artificial</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Triage Output */}
          {resultadoTriagem && (
            <div className="bg-slate-900/95 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                      resultadoTriagem.gravidade === 'CRÍTICA'
                        ? 'bg-red-600 text-white animate-pulse'
                        : resultadoTriagem.gravidade === 'ALTA'
                        ? 'bg-amber-600 text-white'
                        : 'bg-teal-600 text-white'
                    }`}
                  >
                    GRAVIDADE: {resultadoTriagem.gravidade}
                  </span>
                  <h4 className="font-extrabold text-white text-base">Relatório de Enquadramento Legal</h4>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                    Violações Identificadas
                  </span>
                  <ul className="space-y-1 text-xs text-slate-200">
                    {resultadoTriagem.violacoesIdentificadas?.map((v, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-red-400">•</span>
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                    Enquadramento Legal Específico
                  </span>
                  <div className="text-xs text-teal-200 font-mono leading-relaxed">
                    {resultadoTriagem.enquadramentoLegal}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                  Orientações Imediatas Passo a Passo
                </span>
                <ol className="list-decimal list-inside space-y-1 text-xs text-slate-200">
                  {resultadoTriagem.orientacaoImediata?.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ol>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Órgãos Públicos a Acionar
                </span>
                <div className="flex flex-wrap gap-2">
                  {resultadoTriagem.orgaosAcionaveis?.map((org, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold"
                    >
                      {org}
                    </span>
                  ))}
                </div>
              </div>

              {resultadoTriagem.modeloNotificacao && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-teal-400" />
                      Minuta de Notificação Extrajudicial Pronta:
                    </span>
                    <button
                      onClick={handleCopyNotif}
                      className="text-xs text-teal-300 font-bold hover:text-white flex items-center gap-1"
                    >
                      {copiedNotif ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copiar Minuta
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap bg-slate-900 p-3.5 rounded-xl border border-slate-800 max-h-56 overflow-y-auto">
                    {resultadoTriagem.modeloNotificacao}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
