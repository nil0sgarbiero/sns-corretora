import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoFieldModule,
  PoPageAction,
  PoPageModule,
  PoSelectOption,
} from '@po-ui/ng-components';
import { ListaFornecedor } from './lista_fornecedor';
import { NovoFornecedor } from './novo_fornecedor';
import { UF } from './fornecedores.model';

@Component({
  selector: 'app-fornecedores',
  imports: [FormsModule, PoPageModule, PoFieldModule, ListaFornecedor, NovoFornecedor],
  template: `
    <po-page-default p-title="Seguradoras" [p-actions]="acoes">
      <div class="po-row">
        <po-input
          class="po-md-4"
          name="filtroNome"
          [(ngModel)]="filtroNome"
          p-label="Nome"
          p-placeholder="Buscar por nome ou razão social"
          p-icon="an an-magnifying-glass"
          p-clean>
        </po-input>

        <po-input
          class="po-md-3"
          name="filtroCnpj"
          [(ngModel)]="filtroCnpj"
          p-label="CNPJ"
          p-mask="99.999.999/9999-99"
          p-clean>
        </po-input>

        <po-input
          class="po-md-3"
          name="filtroCidade"
          [(ngModel)]="filtroCidade"
          p-label="Cidade"
          p-clean>
        </po-input>

        <po-select
          class="po-md-2"
          name="filtroEstado"
          [ngModel]="filtroEstado"
          (ngModelChange)="filtroEstado = $event"
          p-label="UF"
          [p-options]="ufOptions">
        </po-select>
      </div>

      <app-lista-fornecedor
        [filtroNome]="filtroNome"
        [filtroCnpj]="filtroCnpj"
        [filtroCidade]="filtroCidade"
        [filtroEstado]="filtroEstado" />

      <app-novo-fornecedor (salvo)="recarregar()" />
    </po-page-default>
  `,
})
export class Fornecedores {
  @ViewChild(ListaFornecedor) private lista!: ListaFornecedor;
  @ViewChild(NovoFornecedor) private modalNovo!: NovoFornecedor;

  readonly ufOptions: PoSelectOption[] = UF.map(uf => ({ label: uf, value: uf }));

  filtroNome = '';
  filtroCnpj = '';
  filtroCidade = '';
  filtroEstado = '';

  readonly acoes: PoPageAction[] = [
    { label: 'Nova seguradora', icon: 'an an-plus', action: () => this.modalNovo.open() },
  ];

  recarregar(): void {
    this.lista.carregar();
  }
}