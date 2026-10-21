import { Component, ViewChild, computed, inject, input, signal } from '@angular/core';
import { PoTableAction, PoTableColumn, PoTableModule } from '@po-ui/ng-components';
import { SupabaseService } from '../services/supabase.service';
import { Fornecedor } from './fornecedores.model';
import { EditarFornecedor } from './editar_fornecedor';

@Component({
  selector: 'app-lista-fornecedor',
  imports: [PoTableModule, EditarFornecedor],
  template: `
    <po-table
      [p-columns]="colunas"
      [p-items]="fornecedoresFiltrados()"
      [p-actions]="acoesTabela"
      p-actions-right
      [p-loading]="carregando()"
      p-striped>
    </po-table>

    <app-editar-fornecedor (salvo)="carregar()" />
  `,
})
export class ListaFornecedor {
  private readonly supabase = inject(SupabaseService);

  @ViewChild(EditarFornecedor) private modalEditar!: EditarFornecedor;

  readonly filtroNome = input('');
  readonly filtroCnpj = input('');
  readonly filtroCidade = input('');
  readonly filtroEstado = input('');

  readonly carregando = signal(true);
  readonly fornecedores = signal<Fornecedor[]>([]);

  readonly colunas: PoTableColumn[] = [
    { property: 'nome_fantasia', label: 'Nome' },
    { property: 'razao_social', label: 'Razão social' },
    { property: 'cnpj', label: 'CNPJ', mask: '99.999.999/9999-99' },
    { property: 'cidade', label: 'Cidade' },
    { property: 'estado', label: 'UF' },
    { property: 'telefone', label: 'Telefone', mask: '(99) 9999-9999' },
    { property: 'ativo', label: 'Ativa', type: 'boolean' },
  ];

  readonly acoesTabela: PoTableAction[] = [
    {
      label: 'Editar',
      icon: 'an an-pencil-simple',
      action: (fornecedor: Fornecedor) => this.editar(fornecedor),
    },
  ];

  readonly fornecedoresFiltrados = computed(() => {
    const nome = this.filtroNome().toLowerCase().trim();
    const cnpj = this.filtroCnpj().replace(/\D/g, '');
    const cidade = this.filtroCidade().toLowerCase().trim();
    const estado = this.filtroEstado();

    return this.fornecedores().filter(item => {
      if (nome) {
        const alvo = `${item.nome_fantasia ?? ''} ${item.razao_social ?? ''}`.toLowerCase();
        if (!alvo.includes(nome)) return false;
      }
      if (cnpj && !(item.cnpj ?? '').replace(/\D/g, '').includes(cnpj)) return false;
      if (cidade && !item.cidade?.toLowerCase().includes(cidade)) return false;
      if (estado && item.estado !== estado) return false;
      return true;
    });
  });

  constructor() {
    this.carregar();
  }

  editar(fornecedor: Fornecedor): void {
    this.modalEditar.open(fornecedor);
  }

  async carregar(): Promise<void> {
    this.carregando.set(true);

    const { data, error } = await this.supabase.client
      .from('fornecedores')
      .select('*')
      .eq('tipo', 'seguradora')
      .order('nome_fantasia', { ascending: true });

    if (error) {
      console.error('Erro ao carregar seguradoras:', error.message);
      this.carregando.set(false);
      return;
    }

    this.fornecedores.set((data ?? []) as Fornecedor[]);
    this.carregando.set(false);
  }
}