import React, { useState } from 'react';
import {
  Bus,
  Car,
  Ticket,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Percent,
  MapPin,
} from 'lucide-react';

export const PasseLivreMobilidade: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'federal' | 'isencoes' | 'vaga'>('federal');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-950 p-6 rounded-3xl border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs font-bold uppercase mb-2 border border-blue-500/30">
            <Bus className="w-3.5 h-3.5" />
            Mobilidade & Gratuidade • Lei 8.899/94
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Passe Livre, Mobilidade & Isenções Tributárias
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Conheça as regras para emissão do Passe Livre Federal Interestadual com direito a passagem gratuita para o acompanhante, isenções fiscais na compra de veículos (IPI, ICMS, IPVA) e credencial de estacionamento PcD.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('federal')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'federal' ? 'bg-blue-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Passe Livre Interestadual
          </button>
          <button
            onClick={() => setActiveTab('isencoes')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'isencoes' ? 'bg-blue-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Isenções para Veículos
          </button>
          <button
            onClick={() => setActiveTab('vaga')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'vaga' ? 'bg-blue-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Vaga Especial de Estacionamento
          </button>
        </div>
      </div>

      {/* TAB 1: PASSE LIVRE FEDERAL */}
      {activeTab === 'federal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Passe Livre Interestadual (Governo Federal)</h3>
                <p className="text-xs text-slate-400">Ministério dos Transportes / ANTT</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-teal-300 block mb-1">Quem tem direito?</strong>
                Pessoas com deficiência (incluindo autistas pela Lei 12.764/12) com renda familiar mensal per capita de até 1 (um) salário mínimo (R$ 1.518,00 em 2026).
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-emerald-300 block mb-1">Direito a Acompanhante Gratuito:</strong>
                Se o laudo médico atestar a necessidade de acompanhante para locomoção e cuidados (o que ocorre na quase totalidade dos casos de TEA), o acompanhante também viaja 100% de graça!
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-sky-300 block mb-1">Como emitir:</strong>
                O requerimento é feito diretamente no portal oficial do Ministério dos Transportes (passelivre.transportes.gov.br) com o laudo médico padronizado preenchido pelo SUS e comprovante do CadÚnico.
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">
                Reserva de Assentos nos Ônibus Interestaduais
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                As empresas de transporte interestadual são <strong>obrigadas por lei</strong> a reservar 2 (dois) assentos gratuitos em cada viagem convencional. A solicitação do bilhete deve ser feita até 3 horas antes do horário de partida, apresentando a credencial do Passe Livre.
              </p>

              <div className="bg-amber-950/40 border border-amber-600/40 p-4 rounded-2xl text-xs text-amber-200 space-y-1">
                <strong>Se a empresa recusar alegando falta de vaga:</strong>
                <p className="text-[11px] text-slate-300">
                  Exija formalmente a certidão com o motivo da recusa, data e horário (Resolução ANTT 1.692/2006). A recusa indevida enseja multa pesada à viação e reparação por danos morais.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <a
                href="https://passelivre.transportes.gov.br"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-lg"
              >
                <span>Acessar Portal Oficial do Passe Livre Federal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ISENÇÕES TRIBUTÁRIAS PARA VEÍCULOS */}
      {activeTab === 'isencoes' && (
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-5 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Percent className="w-5 h-5 text-teal-400" />
              <span>Isenções de Impostos na Compra de Carro Zero KM por Famílias Atípicas</span>
            </h3>
            <p className="text-xs text-slate-400">
              A pessoa com TEA não condutora confere o direito aos pais ou responsáveis legais de adquirir veículo com expressiva redução de tributos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-teal-300 uppercase">IPI (Federal)</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Isenção total do IPI pela Lei nº 8.989/1995 (prorrogada pela Lei 14.287/21) para veículos novos com valor de até R$ 200.000,00. Solicitação feita digitalmente no portal SISEN da Receita Federal.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-cyan-300 uppercase">ICMS (Estadual)</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Isenção parcial ou total conforme convênio CONFAZ vigente em cada Estado da federação para veículos adaptados ou automáticos até o teto estadual.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-300 uppercase">IPVA (Anual Estadual)</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Isenção integral do pagamento do IPVA anual em favor do veículo utilizado para o transporte da pessoa com TEA, conforme legislação da Secretaria da Fazenda de cada Estado.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VAGA ESPECIAL */}
      {activeTab === 'vaga' && (
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Credencial de Estacionamento em Vaga PcD (Resolução CONTRAN 965/22)
              </h3>
              <p className="text-xs text-slate-400">Válida em todo o território nacional</p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
            <p>
              A pessoa com TEA tem <strong>direito indiscutível</strong> à Credencial de Estacionamento para Vaga Especial PcD, emitida gratuitamente pelo órgão municipal de trânsito (DSV, CET, DETRAN ou aplicativo Carteira Digital de Trânsito - CDT).
            </p>
            <p>
              O veículo não precisa estar em nome da pessoa com autismo: a credencial vincula-se à pessoa e pode ser utilizada em qualquer veículo no qual ela esteja sendo transportada, desde que afixada no painel dianteiro.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
