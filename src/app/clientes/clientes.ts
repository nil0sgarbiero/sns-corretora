import { Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoContainerModule,
  PoFieldModule,
  PoPageAction,
  PoPageModule,
  PoSelectOption,
} from '@po-ui/ng-components';
import { ESTADOS_UF } from '../shared/estados';
import { ListaCliente } from './lista_cliente';
import { NovoCliente } from './novo_cliente';

@Component({
  selector: 'app-clientes',
  imports: [
    FormsModule,
    PoPageModule,
    PoContainerModule,
    PoFieldModule,
    PoButtonModule,
    ListaCliente,
    NovoCliente,
  ],
  template: `
    <po-page-list p-title="Clientes" [p-actions]="acoes">
      <po-container p-title="Filtros">
        <div class="po-row">
          <po-input
            class="po-md-3"
            name="fNome"
            [ngModel]="filtroNome()"
            (ngModelChange)="filtroNome.set($event)"
            p-label="Nome"
            p-placeholder="Buscar por nome"
            p-clean>
          </po-input>

          <po-input
            class="po-md-3"
            name="fCpf"
            [ngModel]="filtroCpf()"
            (ngModelChange)="filtroCpf.set($event)"
            p-label="CPF"
            p-mask="999.999.999-99"
            p-clean>
          </po-input>

          <po-input
            class="po-md-3"
            name="fCidade"
            [ngModel]="filtroCidade()"
            (ngModelChange)="filtroCidade.set($event)"
            p-label="Cidade"
            p-clean>
          </po-input>

          <po-select
            class="po-md-3"
            name="fEstado"
            [ngModel]="filtroEstado()"
            (ngModelChange)="filtroEstado.set($event)"
            p-label="Estado"
            [p-options]="estadosFiltro">
          </po-select>
        </div>

        <po-button p-label="Limpar filtros" p-kind="tertiary" (p-click)="limpar()">
        </po-button>
      </po-container>

      <app-lista-cliente
        [filtroNome]="filtroNome()"
        [filtroCpf]="filtroCpf()"
        [filtroCidade]="filtroCidade()"
        [filtroEstado]="filtroEstado()">
      </app-lista-cliente>
    </po-page-list>

    <app-novo-cliente (salvo)="recarregar()" />
  `,
})
export class Clientes {
  @ViewChild(NovoCliente) private modalNovo!: NovoCliente;
  @ViewChild(ListaCliente) private lista!: ListaCliente;

  readonly filtroNome = signal('');
  readonly filtroCpf = signal('');
  readonly filtroCidade = signal('');
  readonly filtroEstado = signal('');

  readonly acoes: PoPageAction[] = [
    { label: 'Novo cliente', icon: 'an an-plus', action: () => this.modalNovo.open() },
  ];

  readonly estadosFiltro: PoSelectOption[] = [
    { label: 'Todos', value: '' },
    ...ESTADOS_UF,
  ];

  limpar(): void {
    this.filtroNome.set('');
    this.filtroCpf.set('');
    this.filtroCidade.set('');
    this.filtroEstado.set('');
  }

  recarregar(): void {
    this.lista.carregar();
  }
}