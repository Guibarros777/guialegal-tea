export type TipoUsuario =
  | 'autista_autodefensor'
  | 'mae_pai_atipico'
  | 'responsavel_legal'
  | 'advogado_defensor';

export interface UserSession {
  id: string;
  authProvider: 'govbr' | 'cadastro_direto';
  govBrLevel?: 'bronze' | 'prata' | 'ouro';
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  tipoUsuario: TipoUsuario;
  dataNascimento: string;
  cidade: string;
  uf: string;
  laudo: {
    numeroLaudo: string;
    cid: string;
    medicoNome: string;
    crm: string;
    dataEmissao: string;
    possuiCiptea: boolean;
    numeroCiptea?: string;
    orgaoEmissorCiptea?: string;
  };
  criadoEm: string;
}

export interface FamiliarBpc {
  id: string;
  nome: string;
  parentesco: string;
  rendaBruta: number;
  recebeBpcOuIdoso: boolean;
}

export interface DespesaBpc {
  id: string;
  categoria: 'medicamento' | 'fraldas' | 'terapias' | 'alimentacao_especial' | 'consultas_exames';
  descricao: string;
  valorMensal: number;
  possuiComprovante: boolean;
  naoFornecidoPeloSus: boolean;
}

export interface BpcResult {
  salarioMinimoVigente: number;
  limiteQuarto: number;
  limiteMeio: number;
  totalMembros: number;
  rendaBrutaTotal: number;
  totalDeducoes: number;
  rendaLiquidaTotal: number;
  rendaPerCapita: number;
  elegibilidade: 'ELEGIVEL_ADMINISTRATIVO' | 'ELEGIVEL_JUDICIAL_DEDUCOES' | 'ACIMA_DO_LIMITE';
  justificativa: string;
  fundamentacaoLegal: string;
}

export interface PassaporteSensorial {
  nomeCompleto: string;
  nomeSocialOuAfetivo?: string;
  idadeOuDataNascimento: string;
  cid: string;
  fotoUrl?: string;
  comunicacao: 'verbal' | 'nao_verbal' | 'comunicacao_alternativa' | 'escrita';
  detalhesComunicacao: string;
  gatilhos: string[];
  estrategiasAutorregulacao: string[];
  necessidadesAcomodacao: string[];
  alergiasAlimentares: string;
  medicamentosUsoContinuo: string;
  contatoEmergenciaNome: string;
  contatoEmergenciaParentesco: string;
  contatoEmergenciaTelefone: string;
}

export interface DocumentoCofre {
  id: string;
  titulo: string;
  categoria: 'laudo' | 'ciptea' | 'relatorio_terapia' | 'receita' | 'decisao_judicial' | 'outros';
  dataEmissao: string;
  validade?: string;
  observacoes: string;
  nomeArquivo?: string;
}

export interface EstabelecimentoInclusivo {
  id: string;
  nome: string;
  categoria: 'supermercado' | 'cinema' | 'restaurante' | 'parque' | 'clinica' | 'escola';
  endereco: string;
  cidade: string;
  uf: string;
  telefone: string;
  horarioSilencioso: boolean;
  abafadoresDisponiveis: boolean;
  salaDescompressao: boolean;
  filaPrioritariaReal: boolean;
  equipeTreinada: boolean;
  avaliacaoMedia: number;
  descricao: string;
}

export interface PrazoNotificacao {
  id: string;
  titulo: string;
  tipo: 'inss_recurso' | 'ans_resposta' | 'laudo_renovacao' | 'cadunico_atualizacao' | 'escola_pei';
  dataVencimento: string;
  prazoDias: number;
  descricao: string;
  concluido: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface IncidentTriageResult {
  gravidade: 'CRÍTICA' | 'ALTA' | 'MÉDIA';
  violacoesIdentificadas: string[];
  enquadramentoLegal: string;
  orientacaoImediata: string[];
  orgaosAcionaveis: string[];
  modeloNotificacao: string;
  iaOffline?: boolean;
}
