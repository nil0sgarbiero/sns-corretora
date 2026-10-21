-- ============================================================
-- 1. TABELA APOLICES
-- ============================================================
create table if not exists public.apolices (
  cod_apolice           bigint generated always as identity primary key,

  -- Identificação
  numero_apolice        text not null,
  tipo_registro         text not null default 'apolice'
                        check (tipo_registro in ('apolice','endosso','renovacao')),
  cod_apolice_anterior  bigint references public.apolices(cod_apolice)
                        on delete set null,
  status                text not null default 'ativa'
                        check (status in ('ativa','cancelada','suspensa','renovada','nao_renovada')),

  -- Vínculos
  cod_cliente           bigint not null references public.clientes(cod_cliente)
                        on delete restrict,
  cod_fornecedor        bigint not null references public.fornecedores(cod_fornecedor)
                        on delete restrict,
  segurado              text,

  -- Ramo e cobertura
  ramo                  text not null,
  produto               text,
  coberturas            text[] default '{}',
  detalhes              jsonb default '{}'::jsonb,

  -- Vigência
  data_emissao          date,
  vigencia_inicio       date not null,
  vigencia_fim          date not null,

  -- Financeiro
  premio_liquido        numeric(12,2),
  custo_apolice         numeric(12,2),
  iof                   numeric(12,2),
  premio_total          numeric(12,2) not null,
  desconto              numeric(12,2),
  comissao_percentual   numeric(5,2),
  comissao_valor        numeric(12,2),
  forma_pagamento       text,
  parcelas              integer,
  primeiro_vencimento   date,

  -- Follow-up comercial
  data_lembrete         date,
  lembrete_motivo       text,
  lembrete_concluido    boolean not null default false,

  -- Controle
  observacoes           text,
  ativo                 boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  constraint ck_apolices_vigencia
    check (vigencia_fim >= vigencia_inicio)
);

-- ============================================================
-- 2. ÍNDICES
-- ============================================================
create index if not exists idx_apolices_cliente
  on public.apolices (cod_cliente);

create index if not exists idx_apolices_fornecedor
  on public.apolices (cod_fornecedor);

create index if not exists idx_apolices_vigencia_fim
  on public.apolices (vigencia_fim)
  where status = 'ativa';

create index if not exists idx_apolices_numero
  on public.apolices (numero_apolice);

create index if not exists idx_apolices_status
  on public.apolices (status);

create index if not exists idx_apolices_coberturas
  on public.apolices using gin (coberturas);

create index if not exists idx_apolices_detalhes
  on public.apolices using gin (detalhes);

create index if not exists idx_apolices_lembrete_pendente
  on public.apolices (data_lembrete)
  where data_lembrete is not null
    and lembrete_concluido = false;

-- ============================================================
-- 3. TRIGGER UPDATED_AT
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_apolices_updated_at on public.apolices;

create trigger trg_apolices_updated_at
  before update on public.apolices
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- 4. RLS — APOLICES
-- ============================================================
alter table public.apolices enable row level security;

drop policy if exists "apolices_select_autenticado" on public.apolices;
create policy "apolices_select_autenticado"
  on public.apolices for select to authenticated using (true);

drop policy if exists "apolices_insert_autenticado" on public.apolices;
create policy "apolices_insert_autenticado"
  on public.apolices for insert to authenticated with check (true);

drop policy if exists "apolices_update_autenticado" on public.apolices;
create policy "apolices_update_autenticado"
  on public.apolices for update to authenticated using (true) with check (true);

drop policy if exists "apolices_delete_autenticado" on public.apolices;
create policy "apolices_delete_autenticado"
  on public.apolices for delete to authenticated using (true);

-- ============================================================
-- 5. TABELA APOLICE_ITENS
-- ============================================================
create table if not exists public.apolice_itens (
  cod_item      bigint generated always as identity primary key,
  cod_apolice   bigint not null references public.apolices(cod_apolice)
                on delete cascade,
  descricao     text,
  identificacao text,
  valor         numeric(12,2),
  detalhes      jsonb default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_apolice_itens_apolice
  on public.apolice_itens (cod_apolice);

drop trigger if exists trg_apolice_itens_updated_at on public.apolice_itens;

create trigger trg_apolice_itens_updated_at
  before update on public.apolice_itens
  for each row
  execute function public.set_updated_at();

alter table public.apolice_itens enable row level security;

drop policy if exists "apolice_itens_all_autenticado" on public.apolice_itens;
create policy "apolice_itens_all_autenticado"
  on public.apolice_itens for all to authenticated
  using (true) with check (true);

-- ============================================================
-- 6. VIEW COM SITUAÇÃO CALCULADA
-- ============================================================
create or replace view public.vw_apolices
with (security_invoker = true)
as
select
  a.*,
  case
    when a.status = 'ativa' and a.vigencia_fim < current_date then 'vencida'
    else a.status
  end as situacao,
  (a.vigencia_fim - current_date) as dias_para_vencer,
  case
    when a.data_lembrete is not null
         and a.lembrete_concluido = false
         and a.data_lembrete <= current_date then true
    else false
  end as lembrete_vencido,
  c.nome as cliente_nome,
  f.nome_fantasia as seguradora_nome
from public.apolices a
left join public.clientes c on c.cod_cliente = a.cod_cliente
left join public.fornecedores f on f.cod_fornecedor = a.cod_fornecedor;