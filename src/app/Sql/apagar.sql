-- Confira antes o que será apagado
select count(*) from public.clientes     where observacoes = 'DADOS DE TESTE';
select count(*) from public.fornecedores where observacoes = 'DADOS DE TESTE';

-- Apague
delete from public.clientes     where observacoes = 'DADOS DE TESTE';
delete from public.fornecedores where observacoes = 'DADOS DE TESTE';