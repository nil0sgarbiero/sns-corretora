alter table public.fornecedores
  rename column id to cod_fornecedor;

alter table public.fornecedores
  rename constraint fornecedores_pkey to pk_fornecedores;