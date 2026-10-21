import { Routes } from '@angular/router';
import { Login } from './login/login';
import { authGuard } from './auth.guard';
import { Layout } from './layout/layout';
import { Painel } from './painel/painel';
import { Clientes } from './clientes/clientes';
import { Fornecedores } from './fornecedores/fornecedores';
import { Apolices } from './apolices/apolices';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'painel', pathMatch: 'full' },
      { path: 'painel', component: Painel },
      { path: 'clientes', component: Clientes },
      { path: 'fornecedores', component: Fornecedores },
      { path: 'apolices', component: Apolices },
    ],
  },
  { path: '**', redirectTo: '' },
];