alter table public.clientes
  add column if not exists ativo boolean not null default true;

create index if not exists idx_clientes_ativo
  on public.clientes (ativo);