const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'environments');

function escreve(nome, producao) {
  const conteudo = `export const environment = {
  production: ${producao},
  supabaseUrl: '${process.env.SUPABASE_URL ?? ''}',
  supabaseAnonKey: '${process.env.SUPABASE_ANON_KEY ?? ''}',
};
`;
  fs.writeFileSync(path.join(dir, nome), conteudo);
}

fs.mkdirSync(dir, { recursive: true });
escreve('environment.ts', false);
escreve('environment.prod.ts', true);