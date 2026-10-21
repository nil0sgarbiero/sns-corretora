import { RAMOS_ATUACAO } from '../fornecedores/fornecedores.model';

export type TipoRegistro = 'apolice' | 'endosso' | 'renovacao';
export type StatusApolice = 'ativa' | 'cancelada' | 'suspensa' | 'renovada' | 'nao_renovada';
export type SituacaoApolice = StatusApolice | 'vencida';

export interface Apolice {
  cod_apolice?: number;
  numero_apolice: string;
  tipo_registro: TipoRegistro;
  cod_apolice_anterior?: number | null;
  status: StatusApolice;
  cod_cliente: number;
  cod_fornecedor: number;
  segurado?: string | null;
  ramo: string;
  produto?: string | null;
  coberturas?: string[];
  detalhes?: Record<string, unknown>;
  data_emissao?: string | null;
  vigencia_inicio: string;
  vigencia_fim: string;
  premio_liquido?: number | null;
  custo_apolice?: number | null;
  iof?: number | null;
  premio_total: number;
  desconto?: number | null;
  comissao_percentual?: number | null;
  comissao_valor?: number | null;
  forma_pagamento?: string | null;
  parcelas?: number | null;
  primeiro_vencimento?: string | null;
  data_lembrete?: string | null;
  lembrete_motivo?: string | null;
  lembrete_concluido?: boolean;
  observacoes?: string | null;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}

/** Linha da view vw_apolices: a apólice + campos calculados e nomes */
export interface ApoliceView extends Apolice {
  situacao: SituacaoApolice;
  dias_para_vencer: number | null;
  lembrete_vencido: boolean;
  cliente_nome: string | null;
  seguradora_nome: string | null;
  /** Derivado no carregamento, só para exibição */
  ramo_label?: string;
}

/** Os ramos vêm de fornecedores para os dois módulos nunca divergirem */
export const RAMOS = RAMOS_ATUACAO;

export const TIPOS_REGISTRO: { label: string; value: TipoRegistro }[] = [
  { label: 'Apólice', value: 'apolice' },
  { label: 'Endosso', value: 'endosso' },
  { label: 'Renovação', value: 'renovacao' },
];

export const STATUS_APOLICE: { label: string; value: StatusApolice }[] = [
  { label: 'Ativa', value: 'ativa' },
  { label: 'Cancelada', value: 'cancelada' },
  { label: 'Suspensa', value: 'suspensa' },
  { label: 'Renovada', value: 'renovada' },
  { label: 'Não renovada', value: 'nao_renovada' },
];

export const SITUACOES: { label: string; value: SituacaoApolice }[] = [
  ...STATUS_APOLICE,
  { label: 'Vencida', value: 'vencida' },
];

export const FORMAS_PAGAMENTO = [
  { label: 'Boleto', value: 'boleto' },
  { label: 'Débito em conta', value: 'debito_conta' },
  { label: 'Cartão de crédito', value: 'cartao_credito' },
  { label: 'PIX', value: 'pix' },
  { label: 'À vista', value: 'a_vista' },
];

export const COBERTURAS = [
  { label: 'Casco', value: 'casco' },
  { label: 'Colisão', value: 'colisao' },
  { label: 'Roubo e furto', value: 'roubo_furto' },
  { label: 'Incêndio', value: 'incendio' },
  { label: 'Danos elétricos', value: 'danos_eletricos' },
  { label: 'Vendaval', value: 'vendaval' },
  { label: 'Responsabilidade civil', value: 'rc' },
  { label: 'Danos a terceiros', value: 'danos_terceiros' },
  { label: 'Assistência 24h', value: 'assistencia_24h' },
  { label: 'Carro reserva', value: 'carro_reserva' },
  { label: 'Morte acidental', value: 'morte_acidental' },
  { label: 'Invalidez', value: 'invalidez' },
  { label: 'Diárias de internação', value: 'diarias' },
];