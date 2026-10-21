import { Component, ViewChild, computed, inject, input, signal } from '@angular/core';
import {
  PoTableAction,
  PoTableColumn,
  PoTableModule,
} from '@po-ui/ng-components';
import { SupabaseService } from '../services/supabase.service';
import { Cliente } from './cliente.model';
import { EditarCliente } from './editar_cliente';

@Component({
  selector: 'app-lista-cliente',
  imports: [PoTableModule, EditarCliente],
  template: `
    <po-table
      [p-columns]="colunas"
      [p-items]="clientesFiltrados()"
      [p-actions]="acoesTabela"
      p-actions-right
      [p-loading]="carregando()"
      p-striped>
    </po-table>

    <app-editar-cliente (salvo)="carregar()" />
  `,
})
export class ListaCliente {
  private readonly supabase = inject(SupabaseService);

  @ViewChild(EditarCliente) private modalEditar!: EditarCliente;

  readonly filtroNome = input('');
  readonly filtroCpf = input('');
  readonly filtroCidade = input('');
  readonly filtroEstado = input('');

  readonly carregando = signal(true);
  readonly clientes = signal<Cliente[]>([]);

  readonly colunas: PoTableColumn[] = [
    { property: 'nome', label: 'Nome' },
    { property: 'cpf', label: 'CPF', mask: '999.999.999-99' },
    { property: 'telefone', label: 'Telefone', mask: '(99) 9999-9999' },
    { property: 'celular', label: 'Celular', mask: '(99) 99999-9999' },
    { property: 'data_nascimento', label: 'Nascimento', type: 'date' },
    { property: 'email', label: 'E-mail' },
  ];

  readonly acoesTabela: PoTableAction[] = [
    {
      label: 'Editar',
      icon: 'an an-pencil-simple',
      action: (cliente: Cliente) => this.editar(cliente),
    },
  ];

  readonly clientesFiltrados = computed(() => {
    const nome = this.filtroNome().toLowerCase().trim();
    const cpf = this.filtroCpf().replace(/\D/g, '');
    const cidade = this.filtroCidade().toLowerCase().trim();
    const estado = this.filtroEstado();

    return this.clientes().filter(cliente => {
      if (nome && !cliente.nome?.toLowerCase().includes(nome)) return false;
      if (cpf && !(cliente.cpf ?? '').replace(/\D/g, '').includes(cpf)) return false;
      if (cidade && !cliente.cidade?.toLowerCase().includes(cidade)) return false;
      if (estado && cliente.estado !== estado) return false;
      return true;
    });
  });

  constructor() {
    this.carregar();
  }

  editar(cliente: Cliente): void {
    this.modalEditar.open(cliente);
  }

  async carregar(): Promise<void> {
    this.carregando.set(true);

    const { data, error } = await this.supabase.client
      .from('clientes')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao carregar clientes:', error.message);
      this.carregando.set(false);
      return;
    }

    this.clientes.set((data ?? []) as Cliente[]);
    this.carregando.set(false);
  }
}