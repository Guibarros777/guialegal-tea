import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Plus,
  Star,
  CheckCircle2,
  VolumeX,
  Headphones,
  Moon,
  Sparkles,
  Users,
  Building,
  Heart,
  Phone,
} from 'lucide-react';
import { EstabelecimentoInclusivo } from '../../types';

export const GuiaEstabelecimentos: React.FC = () => {
  const [estabelecimentos, setEstabelecimentos] = useState<EstabelecimentoInclusivo[]>([
    {
      id: 'e1',
      nome: 'Supermercado Pão de Açúcar - Horário Silencioso',
      categoria: 'supermercado',
      endereco: 'Av. Brigadeiro Luís Antônio, 2014 - Jardim Paulista',
      cidade: 'São Paulo',
      uf: 'SP',
      telefone: '(11) 3886-5000',
      horarioSilencioso: true,
      abafadoresDisponiveis: true,
      salaDescompressao: false,
      filaPrioritariaReal: true,
      equipeTreinada: true,
      avaliacaoMedia: 4.9,
      descricao:
        'Terças e quintas das 9h às 10h com luzes atenuadas em 50%, desligamento de avisos sonoros e sem música ambiente. Abafadores disponíveis para empréstimo no SAC.',
    },
    {
      id: 'e2',
      nome: 'Cinemark - Sessão Azul Inclusiva',
      categoria: 'cinema',
      endereco: 'Shopping Iguatemi - Av. Brig. Faria Lima, 2232',
      cidade: 'São Paulo',
      uf: 'SP',
      telefone: '(11) 3815-4000',
      horarioSilencioso: true,
      abafadoresDisponiveis: true,
      salaDescompressao: true,
      filaPrioritariaReal: true,
      equipeTreinada: true,
      avaliacaoMedia: 5.0,
      descricao:
        'Sessões adaptadas onde a luz permanece suavemente acesa, volume reduzido e plateia livre para circular, falar e levantar da poltrona sem constrangimentos.',
    },
    {
      id: 'e3',
      nome: 'Restaurante Terraço Verde - Espaço Sensorial',
      categoria: 'restaurante',
      endereco: 'Rua Coronel Quirino, 980 - Cambuí',
      cidade: 'Campinas',
      uf: 'SP',
      telefone: '(19) 3251-1200',
      horarioSilencioso: false,
      abafadoresDisponiveis: true,
      salaDescompressao: true,
      filaPrioritariaReal: true,
      equipeTreinada: true,
      avaliacaoMedia: 4.8,
      descricao:
        'Cardápio visual adaptado, permissão expressa para alimentos especiais trazidos pelos pais e sala de descompressão silenciosa com puffs e brinquedos sensoriais.',
    },
    {
      id: 'e4',
      nome: 'Parque Ibirapuera - Jardim dos Sentidos',
      categoria: 'parque',
      endereco: 'Av. Pedro Álvares Cabral - Vila Mariana',
      cidade: 'São Paulo',
      uf: 'SP',
      telefone: '(11) 5574-5045',
      horarioSilencioso: false,
      abafadoresDisponiveis: false,
      salaDescompressao: true,
      filaPrioritariaReal: true,
      equipeTreinada: false,
      avaliacaoMedia: 4.7,
      descricao:
        'Área verde tranquila com plantas aromáticas e texturas táteis, ideal para descompressão ao ar livre longe do ruído de trânsito intenso.',
    },
  ]);

  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todos');
  const [showNovoModal, setShowNovoModal] = useState(false);

  // New item form
  const [novoNome, setNovoNome] = useState('');
  const [novaCategoria, setNovaCategoria] = useState<EstabelecimentoInclusivo['categoria']>('supermercado');
  const [novoEndereco, setNovoEndereco] = useState('');
  const [novaCidade, setNovaCidade] = useState('São Paulo');
  const [novaUf, setNovaUf] = useState('SP');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [temHorarioSilencioso, setTemHorarioSilencioso] = useState(true);
  const [temAbafador, setTemAbafador] = useState(true);

  const filtrados = estabelecimentos.filter((e) => {
    const matchBusca =
      e.nome.toLowerCase().includes(busca.toLowerCase()) ||
      e.cidade.toLowerCase().includes(busca.toLowerCase()) ||
      e.descricao.toLowerCase().includes(busca.toLowerCase());
    const matchCat = categoriaFiltro === 'todos' || e.categoria === categoriaFiltro;
    return matchBusca && matchCat;
  });

  const handleSalvarNovo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome || !novoEndereco) return;

    const novo: EstabelecimentoInclusivo = {
      id: `est_${Date.now()}`,
      nome: novoNome,
      categoria: novaCategoria,
      endereco: novoEndereco,
      cidade: novaCidade,
      uf: novaUf,
      telefone: '(11) 99999-9999',
      horarioSilencioso: temHorarioSilencioso,
      abafadoresDisponiveis: temAbafador,
      salaDescompressao: false,
      filaPrioritariaReal: true,
      equipeTreinada: true,
      avaliacaoMedia: 5.0,
      descricao: novaDescricao || 'Indicado pela comunidade GuiaLegal TEA.',
    };

    setEstabelecimentos([novo, ...estabelecimentos]);
    setShowNovoModal(false);
    setNovoNome('');
    setNovoEndereco('');
    setNovaDescricao('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-950 p-6 rounded-3xl border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-bold uppercase mb-2 border border-teal-500/30">
            <Building className="w-3.5 h-3.5" />
            Comunidade Inclusiva • Acomodações Sensoriais
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Guia de Estabelecimentos Inclusivos & Amigáveis
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Encontre supermercados com horário silencioso, cinemas com Sessão Azul, restaurantes adaptados e parques com espaços de descompressão avaliados por famílias atípicas.
          </p>
        </div>

        <button
          onClick={() => setShowNovoModal(true)}
          className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 text-xs shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Indicar Local Inclusivo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, bairro, cidade ou recurso sensorial..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'supermercado', label: 'Supermercados' },
            { id: 'cinema', label: 'Cinemas (Sessão Azul)' },
            { id: 'restaurante', label: 'Restaurantes' },
            { id: 'parque', label: 'Parques' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaFiltro(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                categoriaFiltro === cat.id
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* List of Places */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtrados.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 text-[10px] font-bold uppercase tracking-wider border border-teal-800">
                    {item.categoria}
                  </span>
                  <h4 className="font-extrabold text-white text-base mt-1">{item.nome}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>
                      {item.endereco} • {item.cidade}/{item.uf}
                    </span>
                  </p>
                </div>

                <div className="bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 text-center shrink-0 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-black text-white">{item.avaliacaoMedia.toFixed(1)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                {item.descricao}
              </p>

              {/* Badges of sensory accommodations */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                {item.horarioSilencioso && (
                  <span className="flex items-center gap-1 bg-cyan-950/60 border border-cyan-800/50 text-cyan-200 px-2.5 py-1 rounded-lg">
                    <VolumeX className="w-3 h-3 text-cyan-400" /> Horário Silencioso
                  </span>
                )}
                {item.abafadoresDisponiveis && (
                  <span className="flex items-center gap-1 bg-teal-950/60 border border-teal-800/50 text-teal-200 px-2.5 py-1 rounded-lg">
                    <Headphones className="w-3 h-3 text-teal-400" /> Abafadores no Balcão
                  </span>
                )}
                {item.salaDescompressao && (
                  <span className="flex items-center gap-1 bg-indigo-950/60 border border-indigo-800/50 text-indigo-200 px-2.5 py-1 rounded-lg">
                    <Moon className="w-3 h-3 text-indigo-400" /> Sala de Descompressão
                  </span>
                )}
                {item.filaPrioritariaReal && (
                  <span className="flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/50 text-emerald-200 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Fila Prioritária Real
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Contato: {item.telefone}</span>
              <span className="text-teal-400 font-semibold cursor-pointer hover:underline">
                Selo de Inclusão Verificado
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Suggest Place Modal */}
      {showNovoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">Indicar Novo Estabelecimento</h3>
              <button onClick={() => setShowNovoModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarNovo} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nome do Estabelecimento *</label>
                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Supermercado XYZ"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Categoria</label>
                <select
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-white"
                >
                  <option value="supermercado">Supermercado</option>
                  <option value="cinema">Cinema / Sessão Azul</option>
                  <option value="restaurante">Restaurante / Lanchonete</option>
                  <option value="parque">Parque / Lazer</option>
                  <option value="clinica">Clínica / Saúde</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Endereço Completo *</label>
                <input
                  type="text"
                  value={novoEndereco}
                  onChange={(e) => setNovoEndereco(e.target.value)}
                  placeholder="Rua, número e bairro"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Cidade</label>
                  <input
                    type="text"
                    value={novaCidade}
                    onChange={(e) => setNovaCidade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">UF</label>
                  <input
                    type="text"
                    value={novaUf}
                    onChange={(e) => setNovaUf(e.target.value)}
                    maxLength={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={temHorarioSilencioso}
                    onChange={(e) => setTemHorarioSilencioso(e.target.checked)}
                    className="rounded text-teal-600"
                  />
                  <span>Possui Horário Silencioso (luz baixa/sem música)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={temAbafador}
                    onChange={(e) => setTemAbafador(e.target.checked)}
                    className="rounded text-teal-600"
                  />
                  <span>Disponibiliza Abafadores de Ruído</span>
                </label>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Relato / Experiência</label>
                <textarea
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  placeholder="Como foi o atendimento com a pessoa autista?"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNovoModal(false)}
                  className="w-1/2 bg-slate-800 py-2.5 rounded-xl font-bold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-teal-600 hover:bg-teal-500 py-2.5 rounded-xl font-bold text-white shadow"
                >
                  Cadastrar Local
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
