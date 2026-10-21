import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PoPageModule, PoWidgetModule } from '@po-ui/ng-components';
import { SupabaseService } from '../services/supabase.service';

interface Indicador {
  label: string;
  valor: number;
  icone: string;
  rota: string;
}

@Component({
  selector: 'app-painel',
  imports: [PoPageModule, PoWidgetModule],
  template: `
    <po-page-default p-title="Painel de Informações">
      <div class="po-row">
        @for (item of indicadores(); track item.label) {
          <po-widget
            class="po-md-3 po-sm-6"
            [p-title]="item.label"
            (p-click)="abrir(item.rota)">
            <div class="kpi">
              <span class="kpi-valor">{{ item.valor }}</span>
              <span class="kpi-icone an {{ item.icone }}"></span>
            </div>
          </po-widget>
        }
      </div>
    </po-page-default>
  `,
  styles: `
    .kpi {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.25rem 0;
    }
    .kpi-valor {
      font-size: 2rem;
      font-weight: 700;
      color: var(--color-brand-01-base);
      line-height: 1;
    }
    .kpi-icone {
      font-size: 1.75rem;
      color: var(--color-brand-01-light);
    }
  `,
})
export class Painel {
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);

  readonly indicadores = signal<Indicador[]>([
    { label: 'Clientes', valor: 0, icone: 'an an-users', rota: '/clientes' },
    { label: 'Seguradoras', valor: 0, icone: 'an an-shield-check', rota: '/fornecedores' },
    { label: 'Apólices', valor: 0, icone: 'an an-file-text', rota: '/apolices' },
  ]);

  constructor() {
    this.carregar();
  }

  private async carregar(): Promise<void> {
    const contagens = await Promise.all([
      this.contar('clientes'),
      this.contar('fornecedores'),
      this.contar('apolices'),
    ]);

    this.indicadores.set([
      { label: 'Clientes', valor: contagens[0], icone: 'an an-users', rota: '/clientes' },
      { label: 'Seguradoras', valor: contagens[1], icone: 'an an-shield-check', rota: '/fornecedores' },
      { label: 'Apólices', valor: contagens[2], icone: 'an an-file-text', rota: '/apolices' },
    ]);
  }

  private async contar(tabela: string): Promise<number> {
    const { count, error } = await this.supabase.client
      .from(tabela)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`Erro ao contar ${tabela}:`, error.message);
      return 0;
    }

    return count ?? 0;
  }

  abrir(rota: string): void {
    this.router.navigate([rota]);
  }
}