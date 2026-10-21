import { Component, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoCheckboxGroupOption,
  PoComboFilterMode,
  PoComboOption,
  PoFieldModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoSelectOption,
  PoTabsModule,
} from '@po-ui/ng-components';
import { SupabaseService } from '../services/supabase.service';
import {
  Apolice,
  ApoliceView,
  COBERTURAS,
  FORMAS_PAGAMENTO,
  RAMOS,
  STATUS_APOLICE,
  TIPOS_REGISTRO,
} from './apolice.model';
import { montarPayload, paraDate, validar } from './novo_apolice';

@Component({
  selector: 'app-editar-apolice',
  imports: [FormsModule, PoModalModule, PoFieldModule, PoTabsModule],
  template: `
    <po-modal
      #modal
      p-title="Editar apólice"
      p-size="extra-large"
      [p-primary-action]="acaoSalvar"
      [p-secondary-action]="acaoCancelar">

      <po-tabs>
        <po-tab p-label="Dados">
          <div class="po-row">
            <po-input class="po-md-4" name="numero_apolice" [(ngModel)]="form.numero_apolice"
              p-label="Número da apólice" p-required>
            </po-input>

            <po-select class="po-md-4" name="tipo_registro"
              [ngModel]="form.tipo_registro" (ngModelChange)="form.tipo_registro = $event"
              p-label="Tipo" [p-options]="tipos" p-append-in-body>
            </po-select>

            <po-select class="po-md-4" name="status"
              [ngModel]="form.status" (ngModelChange)="form.status = $event"
              p-label="Status" [p-options]="statusOpcoes" p-append-in-body>
            </po-select>

            <po-combo class="po-md-6" name="cod_cliente"
                [ngModel]="form.cod_cliente" (ngModelChange)="form.cod_cliente = $event"
                p-label="Cliente" p-placeholder="Buscar cliente"
                [p-options]="clientesOptions" [p-filter-mode]="filtroMode" p-append-in-body>
            </po-combo>

            <po-select class="po-md-6" name="cod_fornecedor"
              [ngModel]="form.cod_fornecedor" (ngModelChange)="form.cod_fornecedor = $event"
              p-label="Seguradora" [p-options]="seguradorasOptions" p-append-in-body>
            </po-select>

            <po-input class="po-md-8" name="segurado" [(ngModel)]="form.segurado"
              p-label="Segurado (se diferente do cliente)">
            </po-input>

            <po-datepicker class="po-md-4" name="data_emissao"
              [ngModel]="datas.data_emissao" (ngModelChange)="datas.data_emissao = $event"
              p-label="Emissão">
            </po-datepicker>
          </div>
        </po-tab>

        <po-tab p-label="Cobertura">
          <div class="po-row">
            <po-select class="po-md-6" name="ramo"
              [ngModel]="form.ramo" (ngModelChange)="form.ramo = $event"
              p-label="Ramo" [p-options]="ramos" p-append-in-body>
            </po-select>

            <po-input class="po-md-6" name="produto" [(ngModel)]="form.produto"
              p-label="Produto">
            </po-input>

            <po-checkbox-group class="po-md-12" name="coberturas"
              [ngModel]="form.coberturas" (ngModelChange)="form.coberturas = $event"
              p-label="Coberturas contratadas" [p-options]="coberturasOpcoes" [p-columns]="3">
            </po-checkbox-group>
          </div>
        </po-tab>

        <po-tab p-label="Vigência e valores">
          <div class="po-row">
            <po-datepicker class="po-md-3" name="vigencia_inicio"
              [ngModel]="datas.vigencia_inicio" (ngModelChange)="datas.vigencia_inicio = $event"
              p-label="Início da vigência">
            </po-datepicker>

            <po-datepicker class="po-md-3" name="vigencia_fim"
              [ngModel]="datas.vigencia_fim" (ngModelChange)="datas.vigencia_fim = $event"
              p-label="Fim da vigência">
            </po-datepicker>

            <po-decimal class="po-md-3" name="premio_liquido" [(ngModel)]="form.premio_liquido"
              (p-change)="recalcular()" p-label="Prêmio líquido" [p-decimals-length]="2" [p-min]="0">
            </po-decimal>

            <po-decimal class="po-md-3" name="custo_apolice" [(ngModel)]="form.custo_apolice"
              (p-change)="recalcular()" p-label="Custo de apólice" [p-decimals-length]="2" [p-min]="0">
            </po-decimal>

            <po-decimal class="po-md-3" name="iof" [(ngModel)]="form.iof"
              (p-change)="recalcular()" p-label="IOF" [p-decimals-length]="2" [p-min]="0">
            </po-decimal>

            <po-decimal class="po-md-3" name="desconto" [(ngModel)]="form.desconto"
              (p-change)="recalcular()" p-label="Desconto" [p-decimals-length]="2" [p-min]="0">
            </po-decimal>

            <po-decimal class="po-md-3" name="premio_total" [(ngModel)]="form.premio_total"
              p-label="Prêmio total" [p-decimals-length]="2" [p-min]="0">
            </po-decimal>

            <po-decimal class="po-md-3" name="comissao_percentual" [(ngModel)]="form.comissao_percentual"
              (p-change)="recalcular()" p-label="Comissão (%)" [p-decimals-length]="2" [p-min]="0" [p-max]="100">
            </po-decimal>

            <po-decimal class="po-md-3" name="comissao_valor" [(ngModel)]="form.comissao_valor"
              p-label="Comissão (R$)" [p-decimals-length]="2" [p-min]="0">
            </po-decimal>

            <po-select class="po-md-3" name="forma_pagamento"
              [ngModel]="form.forma_pagamento" (ngModelChange)="form.forma_pagamento = $event"
              p-label="Forma de pagamento" [p-options]="formas" p-append-in-body>
            </po-select>

            <po-number class="po-md-2" name="parcelas" [(ngModel)]="form.parcelas"
              p-label="Parcelas" [p-min]="1">
            </po-number>

            <po-datepicker class="po-md-3" name="primeiro_vencimento"
              [ngModel]="datas.primeiro_vencimento" (ngModelChange)="datas.primeiro_vencimento = $event"
              p-label="1º vencimento">
            </po-datepicker>
          </div>
        </po-tab>

        <po-tab p-label="Follow-up">
          <div class="po-row">
            <po-datepicker class="po-md-4" name="data_lembrete"
              [ngModel]="datas.data_lembrete" (ngModelChange)="datas.data_lembrete = $event"
              p-label="Data do lembrete">
            </po-datepicker>

            <po-input class="po-md-8" name="lembrete_motivo" [(ngModel)]="form.lembrete_motivo"
              p-label="Motivo do lembrete">
            </po-input>

            <po-switch class="po-md-4" name="lembrete_concluido"
              [ngModel]="form.lembrete_concluido" (ngModelChange)="form.lembrete_concluido = $event"
              p-label="Lembrete resolvido" p-label-on="Sim" p-label-off="Não">
            </po-switch>

            <po-switch class="po-md-4" name="ativo"
              [ngModel]="form.ativo" (ngModelChange)="form.ativo = $event"
              p-label="Registro ativo" p-label-on="Sim" p-label-off="Não">
            </po-switch>

            <po-textarea class="po-md-12" name="observacoes" [(ngModel)]="form.observacoes"
              p-label="Observações" [p-rows]="4">
            </po-textarea>
          </div>
        </po-tab>
      </po-tabs>

      @if (erro) {
        <p class="erro">{{ erro }}</p>
      }
    </po-modal>
  `,
  styles: `
    .erro {
      margin-top: 0.75rem;
      color: var(--color-danger);
      font-size: 0.875rem;
    }
  `,
})
export class EditarApolice {
  private readonly supabase = inject(SupabaseService);

  @ViewChild('modal', { static: true }) private modal!: PoModalComponent;

  @Output() readonly salvo = new EventEmitter<void>();

  readonly tipos = TIPOS_REGISTRO;
  readonly statusOpcoes = STATUS_APOLICE;
  readonly ramos = RAMOS;
  readonly formas = FORMAS_PAGAMENTO;
  readonly coberturasOpcoes = COBERTURAS as PoCheckboxGroupOption[];
  readonly filtroMode = PoComboFilterMode.contains;

  clientesOptions: PoComboOption[] = [];
  seguradorasOptions: PoSelectOption[] = [];

  form: Partial<Apolice> = {};

  datas = {
    data_emissao: null as Date | null,
    vigencia_inicio: null as Date | null,
    vigencia_fim: null as Date | null,
    primeiro_vencimento: null as Date | null,
    data_lembrete: null as Date | null,
  };

  erro = '';

  readonly acaoSalvar: PoModalAction = { label: 'Salvar', action: () => this.salvar() };
  readonly acaoCancelar: PoModalAction = { label: 'Cancelar', action: () => this.modal.close() };

  open(apolice: ApoliceView): void {
    this.form = { ...apolice, coberturas: apolice.coberturas ?? [] };
    this.datas = {
      data_emissao: paraDate(apolice.data_emissao),
      vigencia_inicio: paraDate(apolice.vigencia_inicio),
      vigencia_fim: paraDate(apolice.vigencia_fim),
      primeiro_vencimento: paraDate(apolice.primeiro_vencimento),
      data_lembrete: paraDate(apolice.data_lembrete),
    };
    this.erro = '';
    this.carregarOpcoes();
    this.modal.open();
  }

  recalcular(): void {
    const liquido = this.form.premio_liquido ?? 0;
    const custo = this.form.custo_apolice ?? 0;
    const iof = this.form.iof ?? 0;
    const desconto = this.form.desconto ?? 0;

    this.form.premio_total = Number((liquido + custo + iof - desconto).toFixed(2));

    if (this.form.comissao_percentual != null && liquido > 0) {
      this.form.comissao_valor = Number(
        ((liquido * this.form.comissao_percentual) / 100).toFixed(2)
      );
    }
  }

  async salvar(): Promise<void> {
    const problema = validar(this.form, this.datas);
    if (problema) {
      this.erro = problema;
      return;
    }

    const { error } = await this.supabase.client
      .from('apolices')
      .update(montarPayload(this.form, this.datas))
      .eq('cod_apolice', this.form.cod_apolice);

    if (error) {
      console.error('Erro ao alterar apólice:', error.message);
      this.erro = 'Não foi possível salvar. Tente novamente.';
      return;
    }

    this.modal.close();
    this.salvo.emit();
  }

  private async carregarOpcoes(): Promise<void> {
    const [{ data: clientes }, { data: seguradoras }] = await Promise.all([
      this.supabase.client.from('clientes').select('cod_cliente, nome').order('nome'),
      this.supabase.client
        .from('fornecedores')
        .select('cod_fornecedor, nome_fantasia, razao_social')
        .eq('tipo', 'seguradora')
        .order('nome_fantasia'),
    ]);

    this.clientesOptions = (clientes ?? []).map((c: any) => ({
      label: c.nome,
      value: c.cod_cliente,
    }));

    this.seguradorasOptions = (seguradoras ?? []).map((f: any) => ({
      label: f.nome_fantasia || f.razao_social,
      value: f.cod_fornecedor,
    }));
  }
}