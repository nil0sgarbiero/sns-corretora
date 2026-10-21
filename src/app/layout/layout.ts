import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  PoMenuModule,
  PoMenuItem,
  PoToolbarAction,
  PoToolbarModule,
  PoToolbarProfile,
} from '@po-ui/ng-components';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, PoToolbarModule, PoMenuModule],
  template: `
    <div class="po-wrapper">
      <po-toolbar
        p-title="SNS Corretora"
        [p-profile]="perfil()"
        [p-profile-actions]="acoesPerfil">
      </po-toolbar>

      <po-menu
        p-logo="/sns-logo.svg"
        p-short-logo="/favicon.png"
        p-logo-alt="SNS Corretora de Seguros"
        p-logo-link="/painel"
        [p-menus]="menus">
      </po-menu>

      <router-outlet />
    </div>
  `,
})
export class Layout {
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);

  readonly perfil = signal<PoToolbarProfile>({ title: '', subtitle: '' });

  readonly menus: PoMenuItem[] = [
    { label: 'Painel', icon: 'an an-house', shortLabel: 'Painel', link: '/painel' },
    { label: 'Clientes', icon: 'an an-users', shortLabel: 'Clientes', link: '/clientes' },
    { label: 'Fornecedores', icon: 'an an-truck', shortLabel: 'Fornec.', link: '/fornecedores' },
    { label: 'Apólices', icon: 'an an-file-text', shortLabel: 'Apólices', link: '/apolices' },
  ];

  readonly acoesPerfil: PoToolbarAction[] = [
    { label: 'Sair', icon: 'an an-sign-out', type: 'danger', action: () => this.sair() },
  ];

  constructor() {
    this.carregarPerfil();
  }

  private async carregarPerfil(): Promise<void> {
    const { data } = await this.supabase.client.auth.getSession();
    const email = data.session?.user?.email ?? '';
    this.perfil.set({ title: email.split('@')[0] ?? '', subtitle: email });
  }

  private async sair(): Promise<void> {
    await this.supabase.client.auth.signOut();
    await this.router.navigate(['/login']);
  }
}