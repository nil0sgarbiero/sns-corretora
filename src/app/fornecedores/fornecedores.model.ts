export type TipoFornecedor = 'seguradora' | 'prestador';

export interface Fornecedor {
  cod_fornecedor?: string;
  tipo: TipoFornecedor;
  razao_social: string;
  nome_fantasia?: string | null;
  cnpj?: string | null;
  codigo_susep?: string | null;
  codigo_corretor?: string | null;
  contato?: string | null;
  telefone?: string | null;
  celular?: string | null;
  email?: string | null;
  site?: string | null;
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  ramos_atuacao?: string[];
  comissao_padrao?: number | null;
  prazo_comissao_dias?: number | null;
  ativo?: boolean;
  observacoes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const RAMOS_ATUACAO = [
  { label: 'Automóvel', value: 'auto' },
  { label: 'Residencial', value: 'residencial' },
  { label: 'Vida', value: 'vida' },
  { label: 'Empresarial', value: 'empresarial' },
  { label: 'Saúde', value: 'saude' },
  { label: 'Viagem', value: 'viagem' },
  { label: 'Rural', value: 'rural' },
  { label: 'Transporte', value: 'transporte' },
  { label: 'Responsabilidade Civil', value: 'rc' },
  { label: 'Outros', value: 'outros' },
];

export const UF = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
];