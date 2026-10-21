import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoFieldModule,
  PoPageAction,
  PoPageModule,
  PoSelectOption,
} from '@po-ui/ng-components';
import { ListarApolice } from './listar_apolice';
import { NovoApolice } from './novo_apolice';
import { SITUACOES } from './apolice.model';

@Component({
  selector: 'app-apolices',
  imports: [FormsModule, PoPageModule, PoFieldModule, ListarApolice, NovoApolice],
  template: `
    <po-page-default p-title="Apólices" [p-actions]="acoes">
      <div class="po-row">
        <po-input
          class="po-md-3"
          name="filtroNumero"
          [(ngModel)]="filtroNumero"
          p-label="Apólice"
          p-placeholder="Buscar por número"
          p-icon="an an-magnifying-glass"
          p-clean>
        </po-input>

        <po-input
          class="po-md-3"
          name="filtroCliente"
          [(ngModel)]="filtroCliente"
          p-label="Cliente"
          p-clean>
        </po-input>

        <po-input
          class="po-md-3"
          name="filtroSeguradora"
          [(ngModel)]="filtroSeguradora"
          p-label="Seguradora"
          p-clean>
        </po-input>

        <po-select
          class="po-md-3"
          name="filtroSituacao"
          [ngModel]="filtroSituacao"
          (ngModelChange)="filtroSituacao = $event"
          p-label="Situação"
          [p-options]="situacoes">
        </po-select>
      </div>

      <app-listar-apolice
        [filtroNumero]="filtroNumero"
        [filtroCliente]="filtroCliente"
        [filtroSeguradora]="filtroSeguradora"
        [filtroSituacao]="filtroSituacao" />

      <app-novo-apolice (salvo)="recarregar()" />
    </po-page-default>
  `,
})
export class Apolices {
  @ViewChild(ListarApolice) private lista!: ListarApolice;
  @ViewChild(NovoApolice) private modalNovo!: NovoApolice;

  readonly situacoes: PoSelectOption[] = SITUACOES;

  filtroNumero = '';
  filtroCliente = '';
  filtroSeguradora = '';
  filtroSituacao = '';

  readonly acoes: PoPageAction[] = [
    { label: 'Nova apólice', icon: 'an an-plus', action: () => this.modalNovo.open() },
  ];

  recarregar(): void {
    this.lista.carregar();
  }
}