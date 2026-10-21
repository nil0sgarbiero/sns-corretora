import { Component, ViewChild, computed, inject, input, signal } from '@angular/core';
import { PoTableAction, PoTableColumn, PoTableModule } from '@po-ui/ng-components';
import { SupabaseService } from '../services/supabase.service';
import { ApoliceView, RAMOS } from './apolice.model';
import { EditarApolice } from './editar_apolice';

@Component({
  selector: 'app-listar-apolice',
  imports: [PoTableModule, EditarApolice],
  template: `
    <po-table
      [p-columns]="colunas"
      [p-items]="apolicesFiltradas()"
      [p-actions]="acoesTabela"
      p-actions-right
      [p-loading]="carregando()"
      [p-show-more-disabled]="true"
      p-container="shadow"
      p-striped>
    </po-table>

    <app-editar-apolice (salvo)="carregar()" />
  `,
})
export class ListarApolice {
  private readonly supabase = inject(SupabaseService);

  @ViewChild(EditarApolice) private modalEditar!: EditarApolice;

  readonly filtroNumero = input('');
  readonly filtroCliente = input('');
  readonly filtroSeguradora = input('');
  readonly filtroSituacao = input('');

  readonly carregando = signal(true);
  readonly apolices = signal<ApoliceView[]>([]);

  readonly colunas: PoTableColumn[] = [
    { property: 'numero_apolice', label: 'Apólice' },
    { property: 'cliente_nome', label: 'Cliente' },
    { property: 'seguradora_nome', label: 'Seguradora' },
    { property: 'ramo_label', label: 'Ramo' },
    { property: 'vigencia_fim', label: 'Vence em', type: 'date' },
    { property: 'premio_total', label: 'Prêmio', type: 'currency', format: 'BRL' },
    {
      property: 'situacao',
      label: 'Situação',
      type: 'label',
      labels: [
        { value: 'ativa', label: 'Ativa', color: 'color-11' },
        { value: 'vencida', label: 'Vencida', color: 'color-07' },
        { value: 'suspensa', label: 'Suspensa', color: 'color-08' },
        { value: 'renovada', label: 'Renovada', color: 'color-12' },
        { value: 'cancelada', label: 'Cancelada', color: 'color-13' },
        { value: 'nao_renovada', label: 'Não renovada', color: 'color-13' },
      ],
    },
    { property: 'data_lembrete', label: 'Lembrete', type: 'date' },
  ];

  readonly acoesTabela: PoTableAction[] = [
    {
      label: 'Editar',
      icon: 'an an-pencil-simple',
      action: (apolice: ApoliceView) => this.editar(apolice),
    },
  ];

  readonly apolicesFiltradas = computed(() => {
    const numero = this.filtroNumero().toLowerCase().trim();
    const cliente = this.filtroCliente().toLowerCase().trim();
    const seguradora = this.filtroSeguradora().toLowerCase().trim();
    const situacao = this.filtroSituacao();

    return this.apolices().filter(item => {
      if (numero && !(item.numero_apolice ?? '').toLowerCase().includes(numero)) return false;
      if (cliente && !(item.cliente_nome ?? '').toLowerCase().includes(cliente)) return false;
      if (seguradora && !(item.seguradora_nome ?? '').toLowerCase().includes(seguradora)) return false;
      if (situacao && item.situacao !== situacao) return false;
      return true;
    });
  });

  constructor() {
    this.carregar();
  }

  editar(apolice: ApoliceView): void {
    this.modalEditar.open(apolice);
  }

  async carregar(): Promise<void> {
    this.carregando.set(true);

    const { data, error } = await this.supabase.client
      .from('vw_apolices')
      .select('*')
      .order('vigencia_fim', { ascending: true });

    if (error) {
      console.error('Erro ao carregar apólices:', error.message);
      this.carregando.set(false);
      return;
    }

    const linhas = ((data ?? []) as ApoliceView[]).map(item => ({
      ...item,
      ramo_label: RAMOS.find(r => r.value === item.ramo)?.label ?? item.ramo,
    }));

    this.apolices.set(linhas);
    this.carregando.set(false);
  }
}