export interface Cliente {
  cod_cliente: number;
  nome: string;
  cpf: string | null;
  data_nascimento: string | null;
  telefone: string | null;
  celular: string | null;
  email: string | null;
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  observacoes: string | null;
}

export interface ClienteForm {
  nome: string;
  cpf: string;
  data_nascimento: string | null;
  telefone: string;
  celular: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  observacoes: string;
}