-- ============================================================
-- SNS Corretora — estrutura inicial
-- Rodar no SQL Editor do Supabase
-- ============================================================

-- ------------------------------------------------------------
-- 1. CLIENTES
-- ------------------------------------------------------------
create table if not exists public.clientes (
  cod_cliente      bigint generated always as identity primary key,
  nome             text        not null,
  cpf              text,
  data_nascimento  date,
  telefone         text,
  celular          text,
  email            text,
  cep              text,
  logradouro       text,
  endereco         text,
  numero           text,
  complemento      text,
  bairro           text,
  cidade           text,
  estado           char(2),
  observacoes      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_clientes_nome   on public.clientes (nome);
create index if not exists idx_clientes_cpf    on public.clientes (cpf);
create index if not exists idx_clientes_cidade on public.clientes (cidade);

create unique index if not exists uq_clientes_cpf
  on public.clientes (cpf)
  where cpf is not null and cpf <> '';

-- ------------------------------------------------------------
-- 2. FORNECEDORES
-- ------------------------------------------------------------
create table if not exists public.fornecedores (
  cod_fornecedor   bigint generated always as identity primary key,
  razao_social     text        not null,
  nome_fantasia    text,
  cnpj             text,
  telefone         text,
  celular          text,
  email            text,
  cep              text,
  logradouro       text,
  endereco         text,
  numero           text,
  complemento      text,
  bairro           text,
  cidade           text,
  estado           char(2),
  observacoes      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_fornecedores_razao on public.fornecedores (razao_social);
create index if not exists idx_fornecedores_cnpj  on public.fornecedores (cnpj);

create unique index if not exists uq_fornecedores_cnpj
  on public.fornecedores (cnpj)
  where cnpj is not null and cnpj <> '';

-- ------------------------------------------------------------
-- 3. APÓLICES
-- ------------------------------------------------------------
create table if not exists public.apolices (
  cod_apolice      bigint generated always as identity primary key,
  numero_apolice   text        not null,
  cod_cliente      bigint      not null
                     references public.clientes (cod_cliente) on delete restrict,
  cod_fornecedor   bigint
                     references public.fornecedores (cod_fornecedor) on delete set null,
  tipo_seguro      text        not null,
  seguradora       text,
  data_inicio      date        not null,
  data_fim         date,
  valor_premio     numeric(14,2),
  valor_cobertura  numeric(14,2),
  forma_pagamento  text,
  status           text        not null default 'ativa'
                     check (status in ('ativa', 'vencida', 'cancelada', 'renovada')),
  observacoes      text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_apolices_cliente    on public.apolices (cod_cliente);
create index if not exists idx_apolices_fornecedor on public.apolices (cod_fornecedor);
create index if not exists idx_apolices_status     on public.apolices (status);
create index if not exists idx_apolices_data_fim   on public.apolices (data_fim);

-- ------------------------------------------------------------
-- 4. updated_at automático
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_clientes_updated_at on public.clientes;
create trigger trg_clientes_updated_at
  before update on public.clientes
  for each row execute function public.set_updated_at();

drop trigger if exists trg_fornecedores_updated_at on public.fornecedores;
create trigger trg_fornecedores_updated_at
  before update on public.fornecedores
  for each row execute function public.set_updated_at();

drop trigger if exists trg_apolices_updated_at on public.apolices;
create trigger trg_apolices_updated_at
  before update on public.apolices
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 5. RLS — acesso apenas para usuários logados
-- ------------------------------------------------------------
alter table public.clientes     enable row level security;
alter table public.fornecedores enable row level security;
alter table public.apolices     enable row level security;

drop policy if exists clientes_authenticated_all on public.clientes;
create policy clientes_authenticated_all on public.clientes
  for all to authenticated using (true) with check (true);

drop policy if exists fornecedores_authenticated_all on public.fornecedores;
create policy fornecedores_authenticated_all on public.fornecedores
  for all to authenticated using (true) with check (true);

drop policy if exists apolices_authenticated_all on public.apolices;
create policy apolices_authenticated_all on public.apolices
  for all to authenticated using (true) with check (true);