import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PoPageLogin, PoPageLoginModule } from '@po-ui/ng-templates';
import { PoNotificationService } from '@po-ui/ng-components';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-login',
  imports: [PoPageLoginModule],
  template: `
    <po-page-login
      p-logo="/logo.png"
      p-title="SNS - Corretora de Seguros"
      p-background="/fundo-login.jpg"
      [p-literals]="literais"
      [p-loading]="carregando()"
      (p-login-submit)="entrar($any($event))">
    </po-page-login>
  `,
})
export class Login {
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly notificacao = inject(PoNotificationService);

  readonly carregando = signal(false);

  readonly literais = {
    welcome: '',
    loginLabel: 'Insira seu usuário',
    loginPlaceholder: 'Insira seu usuário de acesso',
    loginErrorPattern: 'Usuário obrigatório',
    passwordLabel: 'Insira sua senha',
    passwordPlaceholder: 'Insira sua senha de acesso',
    passwordErrorPattern: 'Senha obrigatória',
    loginHint: 'Caso não possua usuário, entre em contato com o suporte',
  };

  async entrar(dados: PoPageLogin): Promise<void> {
    this.carregando.set(true);

    const { error } = await this.supabase.client.auth.signInWithPassword({
      email: dados.login,
      password: dados.password,
    });

    this.carregando.set(false);

    if (error) {
      this.notificacao.error(`${error.status} — ${error.message}`);
      return;
    }

    await this.router.navigate(['/clientes']);
  }
}