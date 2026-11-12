import React, { useState } from 'react';
import {
  CalendarClock,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BellRing,
  FileText,
} from 'lucide-react';
import { PrazoNotificacao } from '../../types';

export const GerenciadorPrazos: React.FC = () => {
  const [prazos, setPrazos] = useState<PrazoNotificacao[]>([
    {
      id: 'p1',
      titulo: 'Prazo para Recurso Ordinário no INSS (BPC)',
      tipo: 'inss_recurso',
      dataVencimento: '2026-12-15',
      prazoDias: 30,
      descricao:
        'Prazo improrrogável de 30 dias contados da ciência do indeferimento para interpor Recurso Ordinário na Junta de Recursos da Previdência Social (Art. 305 Decreto 3.048/99).',
      concluido: false,
    },
    {
      id: 'p2',
      titulo: 'Resposta Escrita Obrigatória da ANS / Plano de Saúde',
      tipo: 'ans_resposta',
      dataVencimento: '2026-11-20',
      prazoDias: 5,
      descricao:
        'A operadora de saúde tem o dever regulatório de fornecer a justificativa da negativa por escrito em até 5 dias úteis (Art. 10 da RN 395/2016 da ANS).',
      concluido: false,
    },
    {
      id: 'p3',
      titulo: 'Atualização Bienal do CadÚnico (CRAS)',
      tipo: 'cadunico_atualizacao',
      dataVencimento: '2027-04-10',
      prazoDias: 180,
      descricao:
        'O CadÚnico deve ser atualizado obrigatoriamente a cada 2 anos ou sempre que houver alteração de endereço ou renda, sob pena de suspensão cautelar do BPC.',
      concluido: true,
    },
    {
      id: 'p4',
      titulo: 'Entrega do Plano de Ensino Individualizado (PEI) pela Escola',
      tipo: 'escola_pei',
      dataVencimento: '2026-12-05',
      prazoDias: 15,
      descricao:
        'Prazo notificado à equipe pedagógica para apresentar o PEI com as adaptações curriculares e o plano de atuação do profissional de apoio.',
      concluido: false,
    },
  ]);

  const [novoTitulo, setNovoTitulo] = useState('');
  const [novoTipo, setNovoTipo] = useState<PrazoNotificacao['tipo']>('inss_recurso');
  const [novaData, setNovaData] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');

  const calcularDiasRestantes = (dataVencimento: string) => {
    const hoje = new Date();
    const venc = new Date(dataVencimento);
    const diffTime = venc.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleAddPrazo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTitulo || !novaData) return;

    const dias = calcularDiasRestantes(novaData);
    const novo: PrazoNotificacao = {
      id: `pz_${Date.now()}`,
      titulo: novoTitulo,
      tipo: novoTipo,
      dataVencimento: novaData,
      prazoDias: Math.max(1, dias),
      descricao: novaDescricao || 'Prazo legal cadastrado pelo usuário.',
      concluido: false,
    };

    setPrazos([...prazos, novo]);
    setNovoTitulo('');
    setNovaData('');
    setNovaDescricao('');
  };

  const toggleConcluido = (id: string) => {
    setPrazos(prazos.map((p) => (p.id === id ? { ...p, concluido: !p.concluido } : p)));
  };

  const removePrazo = (id: string) => {
    setPrazos(prazos.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-950 p-6 rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase mb-2 border border-indigo-500/30">
            <CalendarClock className="w-3.5 h-3.5" />
            Controle de Prazos Decadenciais & Administrativos
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Gerenciador de Prazos e Notificações Legais
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            No Direito Previdenciário e da Saúde, a perda de um prazo pode significar meses sem benefício ou sem terapias. Acompanhe a contagem regressiva de recursos no INSS, respostas da ANS e atualizações obrigatórias do CadÚnico.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List of Deadlines */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Prazos em Andamento ({prazos.filter((p) => !p.concluido).length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {prazos.map((p) => {
              const diasRestantes = calcularDiasRestantes(p.dataVencimento);
              const isUrgente = diasRestantes <= 5 && !p.concluido;

              return (
                <div
                  key={p.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition space-y-3 ${
                    p.concluido
                      ? 'bg-slate-950/40 border-slate-800 opacity-60'
                      : isUrgente
                      ? 'bg-red-950/30 border-red-500/60 shadow-lg'
                      : 'bg-slate-900/90 border-slate-800 shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            p.tipo === 'inss_recurso'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : p.tipo === 'ans_resposta'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : p.tipo === 'cadunico_atualizacao'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                          }`}
                        >
                          {p.tipo.replace('_', ' ')}
                        </span>
                        {isUrgente && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Prazo Crítico!
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-white text-sm sm:text-base">{p.titulo}</h4>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`text-lg sm:text-xl font-black ${
                          p.concluido
                            ? 'text-slate-500'
                            : isUrgente
                            ? 'text-red-400'
                            : 'text-teal-300'
                        }`}
                      >
                        {p.concluido ? 'Cumprido' : `${diasRestantes} dias`}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Vence em {new Date(p.dataVencimento).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    {p.descricao}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => toggleConcluido(p.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                        p.concluido
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{p.concluido ? 'Concluído' : 'Marcar como Cumprido'}</span>
                    </button>

                    <button
                      onClick={() => removePrazo(p.id)}
                      className="text-slate-500 hover:text-red-400 p-1 text-xs"
                      title="Excluir prazo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add New Deadline Form */}
        <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 h-fit space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-teal-400" />
              <span>Cadastrar Novo Prazo Legal</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Notificação customizada com alarme offline
            </p>
          </div>

          <form onSubmit={handleAddPrazo} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Título do Prazo *</label>
              <input
                type="text"
                value={novoTitulo}
                onChange={(e) => setNovoTitulo(e.target.value)}
                placeholder="Ex: Recurso de Negativa da ABA no Convênio"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Tipo de Processo</label>
              <select
                value={novoTipo}
                onChange={(e) => setNovoTipo(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-teal-500"
              >
                <option value="inss_recurso">INSS • Recurso Administrativo (30 dias)</option>
                <option value="ans_resposta">ANS • Resposta do Plano (5 dias úteis)</option>
                <option value="cadunico_atualizacao">CRAS • CadÚnico (Atualização Bienal)</option>
                <option value="escola_pei">Escola • Notificação de PEI / Matrícula</option>
                <option value="laudo_renovacao">Saúde • Renovação de Relatório Terapêutico</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Data Fatal de Vencimento *</label>
              <input
                type="date"
                value={novaData}
                onChange={(e) => setNovaData(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Notas e Protocolo</label>
              <textarea
                value={novaDescricao}
                onChange={(e) => setNovaDescricao(e.target.value)}
                placeholder="Ex: Protocolo do Meu INSS nº 998124819..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Salvar Prazo no Gerenciador</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
