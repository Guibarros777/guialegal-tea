import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldAlert,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Send,
  Mic,
  Square,
  Download,
  AlertTriangle,
  Scale,
  Phone,
  FileText,
  Copy,
  Check,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { copiarTexto } from '../../utils/clipboard';

interface EmergenciaCriseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergenciaCriseModal: React.FC<EmergenciaCriseModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'acolhimento' | 'flagrante'>('acolhimento');

  // Breathing guide state
  const [breathingPhase, setBreathingPhase] = useState<'inspire' | 'segure' | 'expire'>('inspire');
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(true);

  // Calm Sound Synthesis via Web Audio API
  const [isPlayingCalmSound, setIsPlayingCalmSound] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Audio Recorder for incident proof
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Copied alert text state
  const [copiedText, setCopiedText] = useState(false);

  // Geolocation for emergency message
  const [currentCoords, setCurrentCoords] = useState<string>('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentCoords(`https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`);
        },
        () => {
          // ignore if denied
        }
      );
    }
  }, []);

  // Breathing cycle effect
  useEffect(() => {
    if (!isOpen || !isBreathingActive || activeTab !== 'acolhimento') return;

    const interval = setInterval(() => {
      setBreathingTimer((prev) => {
        if (prev <= 1) {
          if (breathingPhase === 'inspire') {
            setBreathingPhase('segure');
            return 7;
          } else if (breathingPhase === 'segure') {
            setBreathingPhase('expire');
            return 8;
          } else {
            setBreathingPhase('inspire');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isBreathingActive, breathingPhase, activeTab]);

  // Recording timer
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Audio synthesis (Brownian / Pink calm noise for sensory decompression)
  const toggleCalmSound = () => {
    if (isPlayingCalmSound) {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsPlayingCalmSound(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 1.8; // Soft brownian wave
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400; // Deep soothing rumble like gentle rainfall

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.18;

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start(0);
        noiseNodeRef.current = whiteNoise;
        setIsPlayingCalmSound(true);
      } catch (e) {
        console.error('Audio synthesis failed:', e);
      }
    }
  };

  // Start Incident Audio Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Não foi possível acessar o microfone para gravação de segurança.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCopyText = (text: string) => {
    copiarTexto(text).then((ok) => {
      if (!ok) return;
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    });
  };

  const handleSendWhatsappEmergency = () => {
    const contato = user?.telefone || '5511999999999';
    const nome = user?.nome || 'Pessoa com TEA';
    const texto = encodeURIComponent(
      `🚨 [ALERTA DE EMERGÊNCIA - GuiaLegal TEA]\n\nOlá, sou ${nome}. Estou em crise sensorial ou enfrentando uma situação de emergência/violação de direitos agora e preciso de suporte.\n\n${
        currentCoords ? `📍 Minha localização atual: ${currentCoords}\n\n` : ''
      }Por favor entre em contato comigo ou venha ao meu encontro.`
    );
    window.open(`https://api.whatsapp.com/send?text=${texto}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergencia-modal-title"
    >
      <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border-2 border-red-600/60 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-rose-950 px-6 py-4 border-b border-red-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 id="emergencia-modal-title" className="text-lg sm:text-xl font-black text-white tracking-tight">
                Central de Emergência, Crise e Flagrante
              </h2>
              <p className="text-xs text-red-300">
                Acolhimento imediato sensorial e autodefesa jurídica com respaldo na legislação federal
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isPlayingCalmSound && audioContextRef.current) {
                audioContextRef.current.close();
              }
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Fechar Central de Emergência"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950">
          <button
            onClick={() => setActiveTab('acolhimento')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'acolhimento'
                ? 'bg-slate-900 text-teal-300 border-b-2 border-teal-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Heart className="w-4 h-4 text-teal-400" />
            <span>Acolhimento & Descompressão Sensorial</span>
          </button>

          <button
            onClick={() => setActiveTab('flagrante')}
            className={`py-3.5 px-4 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'flagrante'
                ? 'bg-slate-900 text-red-300 border-b-2 border-red-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Scale className="w-4 h-4 text-red-400" />
            <span>Protocolo de Flagrante & Direitos Imediatos</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: SENSORY DECOMPRESSION & REASSURANCE */}
          {activeTab === 'acolhimento' && (
            <div className="space-y-6">
              {/* Immediate Message */}
              <div className="bg-teal-950/40 border border-teal-500/30 rounded-2xl p-4 text-center sm:text-left sm:flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center justify-center sm:justify-start gap-2">
                    <span>Você está em um espaço seguro.</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-200 mt-1">
                    Reduza os estímulos ao seu redor. Se puder, coloque fones de ouvido ou abafadores, sente-se confortavelmente e respire no seu próprio ritmo.
                  </p>
                </div>

                <button
                  onClick={toggleCalmSound}
                  className={`mt-3 sm:mt-0 shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                    isPlayingCalmSound
                      ? 'bg-teal-500 text-slate-950'
                      : 'bg-teal-900/60 text-teal-200 border border-teal-500/40 hover:bg-teal-800'
                  }`}
                >
                  {isPlayingCalmSound ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Pausar Som Calmante</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-teal-300" />
                      <span>Tocar Ruído Calmo (Chuva/432Hz)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Guided Breathing 4-7-8 for Decompression */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                  Exercício de Respiração Reguladora 4-7-8
                </div>

                {/* Animated Pulsing Ring */}
                <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                      breathingPhase === 'inspire'
                        ? 'bg-teal-500/20 scale-100 border-2 border-teal-400'
                        : breathingPhase === 'segure'
                        ? 'bg-cyan-500/25 scale-110 border-2 border-cyan-400'
                        : 'bg-indigo-500/15 scale-75 border-2 border-indigo-400'
                    }`}
                  />
                  <div className="relative z-10">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-300">
                      {breathingPhase === 'inspire'
                        ? 'Inspire pelo nariz'
                        : breathingPhase === 'segure'
                        ? 'Segure o ar'
                        : 'Solte devagar pela boca'}
                    </div>
                    <div className="text-4xl font-black text-white mt-1">
                      {breathingTimer}s
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setIsBreathingActive(!isBreathingActive)}
                    className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                  >
                    {isBreathingActive ? 'Pausar ciclo' : 'Retomar ciclo'}
                  </button>
                </div>
              </div>

              {/* Quick WhatsApp SOS to Pre-configured Angel / Emergency Contact */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-600/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-emerald-400" />
                    Enviar Alerta Instantâneo para Contato Anjo
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Envia mensagem automática formatada com sua localização e aviso de suporte sensorial via WhatsApp em 1 clique.
                  </p>
                </div>

                <button
                  onClick={handleSendWhatsappEmergency}
                  className="w-full sm:w-auto shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-lg active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Socorro no WhatsApp</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: IN-FLAGRANTE PROTOCOL & LEGAL TEXTS TO SHOW ON SCREEN */}
          {activeTab === 'flagrante' && (
            <div className="space-y-6">
              {/* Guidance for Current Confrontation */}
              <div className="bg-red-950/50 border border-red-600/50 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-red-300 font-extrabold text-sm mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>O QUE FAZER AGORA SE VOCÊ ESTÁ SENDO BARRADO OU DISCRIMINADO:</span>
                </div>
                <ol className="list-decimal list-inside text-xs text-slate-200 space-y-1 mt-2">
                  <li><strong>Mantenha a calma</strong> e posicione o celular para gravar áudio de segurança (botão abaixo).</li>
                  <li><strong>Mostre a tela do GuiaLegal TEA</strong> com o artigo de lei abaixo diretamente para o segurança, motorista ou gerente.</li>
                  <li><strong>Peça o nome e cargo</strong> de quem está impedindo o atendimento ou a entrada.</li>
                  <li><strong>Avise com firmeza:</strong> Discriminar pessoa com autismo é crime federal inafiançável punido com reclusão de até 3 anos (Art. 88 da Lei 13.146/15).</li>
                </ol>
              </div>

              {/* In-Browser Security Audio Recorder */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                    <Mic className="w-4 h-4 text-rose-400" />
                    Gravador de Áudio Probatório de Segurança
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    A gravação ambiental realizada por um dos interlocutores é lícita (Tema 980 STF) e serve como prova judicial.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow transition"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Iniciar Gravação</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 animate-pulse shadow transition"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Parar ({recordingSeconds}s)</span>
                    </button>
                  )}

                  {recordedAudioUrl && (
                    <a
                      href={recordedAudioUrl}
                      download={`incidente_tea_${Date.now()}.webm`}
                      className="p-2 rounded-xl bg-slate-800 text-teal-300 hover:bg-slate-700 transition"
                      title="Baixar áudio gravado"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Large Screen Legal Shields to Show on Demand */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-slate-200">
                    Artigos de Lei na Íntegra (Mostre esta tela para a autoridade):
                  </h4>
                  {copiedText && (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Copiado!
                    </span>
                  )}
                </div>

                {/* LAW CARD 1: Crime de Discriminação */}
                <div className="bg-slate-950 p-5 rounded-2xl border-2 border-red-500/60 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-red-950 text-red-300 font-black text-xs border border-red-700/60 uppercase">
                      CRIME DE DISCRIMINAÇÃO CONTRA PCD
                    </span>
                    <button
                      onClick={() =>
                        handleCopyText(
                          'Art. 88 da Lei 13.146/2015: Praticar, induzir ou incitar discriminação de pessoa em razão de sua deficiência: Pena - reclusão, de 1 (um) a 3 (três) anos, e multa.'
                        )
                      }
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copiar Artigo
                    </button>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    "Art. 88 da Lei Federal nº 13.146/2015 (Estatuto da Pessoa com Deficiência): Praticar, induzir ou incitar discriminação de pessoa em razão de sua deficiência: <span className="text-red-400 underline">Pena - reclusão, de 1 (um) a 3 (três) anos, e multa</span>."
                  </div>
                  <div className="text-xs text-slate-400">
                    § 1º Aumenta-se a pena em 1/3 (um terço) se a pessoa com deficiência estiver sob cuidado e responsabilidade do agente.
                  </div>
                </div>

                {/* LAW CARD 2: Equiparação expressa do Autista a PcD */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-teal-500/50 shadow space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-teal-950 text-teal-300 font-bold text-xs border border-teal-700/60 uppercase">
                      LEI BERENICE PIANA (LEI 12.764/2012)
                    </span>
                    <button
                      onClick={() =>
                        handleCopyText(
                          'Art. 1º, § 2º da Lei 12.764/2012: A pessoa com transtorno do espectro autista é considerada pessoa com deficiência, para todos os efeitos legais.'
                        )
                      }
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copiar Artigo
                    </button>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    "Art. 1º, § 2º da Lei Federal nº 12.764/2012: <span className="text-teal-300 underline">A pessoa com transtorno do espectro autista é considerada pessoa com deficiência, para todos os efeitos legais</span>."
                  </div>
                  <div className="text-xs text-slate-400">
                    Garante prioridade de atendimento, assento prioritário, embarque preferencial e direito a ingressar com alimentos especiais ou itens de suporte sensorial em estabelecimentos.
                  </div>
                </div>

                {/* LAW CARD 3: Recusa de Matrícula Escolar */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/50 shadow space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 font-bold text-xs border border-amber-700/60 uppercase">
                      RECUSA DE MATRÍCULA OU TAXA EXTRA (CRIME)
                    </span>
                    <button
                      onClick={() =>
                        handleCopyText(
                          'Art. 8º da Lei 7.853/89 e Art. 28 da Lei 13.146/15: Recusar matrícula de aluno com deficiência é crime punível com reclusão de 2 a 5 anos e multa. Escolas privadas não podem cobrar qualquer taxa extra de acompanhante (STF ADI 5357).'
                        )
                      }
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copiar Artigo
                    </button>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    "Art. 8º da Lei nº 7.853/1989 c/c Art. 28 da Lei nº 13.146/2015: Constitui crime punível com <span className="text-amber-400 underline">reclusão de 2 (dois) a 5 (cinco) anos e multa</span> recusar matrícula ou cobrar taxas extras/mensalidade maior de pessoa com deficiência. O STF julgou formalmente inconstitucional a cobrança de taxa de mediador (ADI 5357)."
                  </div>
                </div>
              </div>

              {/* Direct Calling Hotline Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <a
                  href="tel:100"
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl p-3 text-center transition flex flex-col items-center justify-center"
                >
                  <Phone className="w-4 h-4 text-yellow-400 mb-1" />
                  <div className="font-bold text-white text-xs">Disque 100</div>
                  <div className="text-[10px] text-slate-400">Direitos Humanos</div>
                </a>

                <a
                  href="tel:190"
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl p-3 text-center transition flex flex-col items-center justify-center"
                >
                  <Phone className="w-4 h-4 text-red-400 mb-1" />
                  <div className="font-bold text-white text-xs">190 (PM)</div>
                  <div className="text-[10px] text-slate-400">Flagrante Delito</div>
                </a>

                <a
                  href="tel:192"
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl p-3 text-center transition flex flex-col items-center justify-center"
                >
                  <Phone className="w-4 h-4 text-emerald-400 mb-1" />
                  <div className="font-bold text-white text-xs">192 (SAMU)</div>
                  <div className="text-[10px] text-slate-400">Crise Médica</div>
                </a>

                <a
                  href="tel:129"
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl p-3 text-center transition flex flex-col items-center justify-center"
                >
                  <Phone className="w-4 h-4 text-sky-400 mb-1" />
                  <div className="font-bold text-white text-xs">129 (Defensoria)</div>
                  <div className="text-[10px] text-slate-400">Assistência Jurídica</div>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
