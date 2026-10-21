-- ============================================================
-- Tabela: fornecedores (usada no sistema como "Seguradoras")
-- ============================================================

create table if not exists public.fornecedores (
  id                    uuid primary key default gen_random_uuid(),

  -- Classificação: permite usar a mesma tabela para prestadores no futuro
  tipo                  text not null default 'seguradora'
                        check (tipo in ('seguradora', 'prestador')),

  -- Identificação
  razao_social          text not null,
  nome_fantasia         text,
  cnpj                  text unique,
  codigo_susep          text,
  codigo_corretor       text,

  -- Contato comercial
  contato               text,
  telefone              text,
  celular               text,
  email                 text,
  site                  text,

  -- Endereço da sede
  cep                   text,
  logradouro            text,
  numero                text,
  complemento           text,
  bairro                text,
  cidade                text,
  estado                text,

  -- Dados operacionais
  ramos_atuacao         text[] default '{}',
  comissao_padrao       numeric(5,2),
  prazo_comissao_dias   integer,

  -- Controle
  ativo                 boolean not null default true,
  observacoes           text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Índices
-- ------------------------------------------------------------
create index if not exists idx_fornecedores_razao_social
  on public.fornecedores (razao_social);

create index if not exists idx_fornecedores_nome_fantasia
  on public.fornecedores (nome_fantasia);

create index if not exists idx_fornecedores_ativo
  on public.fornecedores (ativo);

create index if not exists idx_fornecedores_ramos
  on public.fornecedores using gin (ramos_atuacao);

-- ------------------------------------------------------------
-- updated_at automático
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

drop trigger if exists trg_fornecedores_updated_at on public.fornecedores;

create trigger trg_fornecedores_updated_at
  before update on public.fornecedores
  for each row
  execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Row Level Security
-- ------------------------------------------------------------
alter table public.fornecedores enable row level security;

drop policy if exists "fornecedores_select_autenticado" on public.fornecedores;
create policy "fornecedores_select_autenticado"
  on public.fornecedores for select
  to authenticated
  using (true);

drop policy if exists "fornecedores_insert_autenticado" on public.fornecedores;
create policy "fornecedores_insert_autenticado"
  on public.fornecedores for insert
  to authenticated
  with check (true);

drop policy if exists "fornecedores_update_autenticado" on public.fornecedores;
create policy "fornecedores_update_autenticado"
  on public.fornecedores for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "fornecedores_delete_autenticado" on public.fornecedores;
create policy "fornecedores_delete_autenticado"
  on public.fornecedores for delete
  to authenticated
  using (true);