import React, { useState } from 'react';
import {
  FolderLock,
  Plus,
  Trash2,
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
} from 'lucide-react';
import { DocumentoCofre } from '../../types';

export const CofreDocumentos: React.FC = () => {
  const [documentos, setDocumentos] = useState<DocumentoCofre[]>([
    {
      id: 'doc_1',
      titulo: 'Laudo Médico Circunstanciado com CID-10 F84.0',
      categoria: 'laudo',
      dataEmissao: '2024-03-10',
      validade: 'Indeterminada (Lei Estadual SP 17.158/19)',
      observacoes: 'Emitido por Neuropediatra Dr. Roberto Alcantara (CRM 138920/SP). Descreve nível 2 de suporte.',
      nomeArquivo: 'laudo_medico_neuropediatra_2024.pdf',
    },
    {
      id: 'doc_2',
      titulo: 'Carteira de Identificação CIPTEA (Lei Romeo Mion)',
      categoria: 'ciptea',
      dataEmissao: '2024-04-02',
      validade: '2029-04-02 (5 anos)',
      observacoes: 'Número CIPTEA-SP-2024-9912 expedida pela Secretaria dos Direitos da Pessoa com Deficiência.',
      nomeArquivo: 'ciptea_digital_oficial.pdf',
    },
    {
      id: 'doc_3',
      titulo: 'Relatório Multiprofissional de Terapia Ocupacional e ABA',
      categoria: 'relatorio_terapia',
      dataEmissao: '2024-09-15',
      validade: 'Recomendada atualização semestral',
      observacoes: 'Indica necessidade de 20 horas semanais de método ABA e Integração Sensorial de Ayres.',
      nomeArquivo: 'relatorio_evolutivo_aba_to.pdf',
    },
    {
      id: 'doc_4',
      titulo: 'Receituário Contínuo de Risperidona e Melatonina',
      categoria: 'receita',
      dataEmissao: '2024-10-01',
      validade: '2025-04-01 (6 meses)',
      observacoes: 'Receituário de controle especial C1.',
      nomeArquivo: 'receita_risperidona_melatonina.pdf',
    },
  ]);

  const [showNovoModal, setShowNovoModal] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaCategoria, setNovaCategoria] = useState<DocumentoCofre['categoria']>('laudo');
  const [novaData, setNovaData] = useState(new Date().toISOString().split('T')[0]);
  const [novaValidade, setNovaValidade] = useState('Indeterminada');
  const [novasObs, setNovasObs] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTitulo) return;

    const novo: DocumentoCofre = {
      id: `doc_${Date.now()}`,
      titulo: novoTitulo,
      categoria: novaCategoria,
      dataEmissao: novaData,
      validade: novaValidade,
      observacoes: novasObs,
      nomeArquivo: `${novoTitulo.toLowerCase().replace(/\s+/g, '_')}.pdf`,
    };

    setDocumentos([novo, ...documentos]);
    setShowNovoModal(false);
    setNovoTitulo('');
    setNovasObs('');
  };

  const removeDoc = (id: string) => {
    setDocumentos(documentos.filter((d) => d.id !== id));
  };

  const handleSimularDownload = (doc: DocumentoCofre) => {
    // Generate a quick downloadable text blob for demo simulation
    const content = `[COFRE SEGURO GUIALEGAL TEA]\nDOCUMENTO: ${doc.titulo}\nCATEGORIA: ${doc.categoria}\nDATA: ${doc.dataEmissao}\nVALIDADE: ${doc.validade}\nOBSERVAÇÕES: ${doc.observacoes}\n\nDocumento armazenado localmente em cofre seguro de dados conforme LGPD (Lei 13.709/2018).`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.nomeArquivo || 'documento_tea.txt';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-950 p-6 rounded-3xl border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-bold uppercase mb-2 border border-teal-500/30">
            <FolderLock className="w-3.5 h-3.5" />
            Cofre Seguro Offline • LGPD Lei 13.709/18
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Cofre Digital Seguro de Documentos & Laudos
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Armazenamento seguro, confidencial e offline-first de Laudos Médicos com validade legal, CIPTEA, relatórios multiprofissionais e comprovantes para instrução de pedidos judiciais e previdenciários.
          </p>
        </div>

        <button
          onClick={() => setShowNovoModal(true)}
          className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 text-xs shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar ao Cofre</span>
        </button>
      </div>

      {/* Grid of Stored Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentos.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 space-y-3 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 text-[10px] font-bold uppercase tracking-wider border border-teal-800">
                    {doc.categoria.replace('_', ' ')}
                  </span>
                  <h4 className="font-extrabold text-white text-base mt-1">{doc.titulo}</h4>
                </div>

                <button
                  onClick={() => removeDoc(doc.id)}
                  className="text-slate-500 hover:text-red-400 p-1"
                  title="Remover documento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Data de Emissão</span>
                  <span className="text-white font-medium">
                    {new Date(doc.dataEmissao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Validade Jurídica</span>
                  <span className="text-emerald-400 font-bold">{doc.validade || 'Indeterminada'}</span>
                </div>
              </div>

              {doc.observacoes && (
                <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                  {doc.observacoes}
                </p>
              )}
            </div>

            <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] font-mono truncate max-w-[180px]">
                {doc.nomeArquivo}
              </span>
              <button
                onClick={() => handleSimularDownload(doc)}
                className="flex items-center gap-1.5 text-teal-300 hover:text-white font-bold text-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Cópia</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Document */}
      {showNovoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-base">Adicionar Documento ao Cofre</h3>
              <button onClick={() => setShowNovoModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Título do Documento *</label>
                <input
                  type="text"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  placeholder="Ex: Laudo Médico Neuropediatra 2026"
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
                  <option value="laudo">Laudo Médico (com CID)</option>
                  <option value="ciptea">Carteira CIPTEA (Romeo Mion)</option>
                  <option value="relatorio_terapia">Relatório de Terapias (ABA/Fono/TO)</option>
                  <option value="receita">Receita de Uso Contínuo</option>
                  <option value="decisao_judicial">Decisão Judicial / Liminar</option>
                  <option value="outros">Outro Documento</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Data de Emissão</label>
                  <input
                    type="date"
                    value={novaData}
                    onChange={(e) => setNovaData(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Validade Jurídica</label>
                  <input
                    type="text"
                    value={novaValidade}
                    onChange={(e) => setNovaValidade(e.target.value)}
                    placeholder="Ex: Indeterminada"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Observações e CRM do Médico</label>
                <textarea
                  value={novasObs}
                  onChange={(e) => setNovasObs(e.target.value)}
                  rows={2}
                  placeholder="Ex: Atenta necessidade de fonoaudiologia e acompanhante escolar..."
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
                  Salvar no Cofre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
