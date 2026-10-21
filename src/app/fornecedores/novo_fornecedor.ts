import { Component, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoCheckboxGroupOption,
  PoFieldModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoSelectOption,
} from '@po-ui/ng-components';
import { SupabaseService } from '../services/supabase.service';
import { Fornecedor, RAMOS_ATUACAO, UF } from './fornecedores.model';

@Component({
  selector: 'app-novo-fornecedor',
  imports: [FormsModule, PoModalModule, PoFieldModule],
  template: `
    <po-modal
      #modal
      p-title="Nova seguradora"
      p-size="lg"
      [p-primary-action]="acaoSalvar"
      [p-secondary-action]="acaoCancelar">

      <div class="po-row">
        <po-input
          class="po-md-8"
          name="razao_social"
          [(ngModel)]="form.razao_social"
          p-label="Razão social"
          p-required>
        </po-input>

        <po-input
          class="po-md-4"
          name="nome_fantasia"
          [(ngModel)]="form.nome_fantasia"
          p-label="Nome fantasia">
        </po-input>

        <po-input
          class="po-md-4"
          name="cnpj"
          [(ngModel)]="form.cnpj"
          p-label="CNPJ"
          p-mask="99.999.999/9999-99">
        </po-input>

        <po-input
          class="po-md-4"
          name="codigo_susep"
          [(ngModel)]="form.codigo_susep"
          p-label="Código SUSEP">
        </po-input>

        <po-input
          class="po-md-4"
          name="codigo_corretor"
          [(ngModel)]="form.codigo_corretor"
          p-label="Código da corretora">
        </po-input>

        <po-input
          class="po-md-4"
          name="contato"
          [(ngModel)]="form.contato"
          p-label="Contato comercial">
        </po-input>

        <po-input
          class="po-md-4"
          name="telefone"
          [(ngModel)]="form.telefone"
          p-label="Telefone"
          p-mask="(99) 9999-9999">
        </po-input>

        <po-input
          class="po-md-4"
          name="celular"
          [(ngModel)]="form.celular"
          p-label="Celular"
          p-mask="(99) 99999-9999">
        </po-input>

        <po-input
          class="po-md-8"
          name="email"
          [(ngModel)]="form.email"
          p-label="E-mail"
          p-icon="an an-envelope-simple">
        </po-input>

        <po-input
          class="po-md-4"
          name="site"
          [(ngModel)]="form.site"
          p-label="Site">
        </po-input>

        <po-input
          class="po-md-3"
          name="cep"
          [(ngModel)]="form.cep"
          p-label="CEP"
          p-mask="99999-999">
        </po-input>

        <po-input
          class="po-md-6"
          name="logradouro"
          [(ngModel)]="form.logradouro"
          p-label="Logradouro">
        </po-input>

        <po-input
          class="po-md-3"
          name="numero"
          [(ngModel)]="form.numero"
          p-label="Número">
        </po-input>

        <po-input
          class="po-md-4"
          name="complemento"
          [(ngModel)]="form.complemento"
          p-label="Complemento">
        </po-input>

        <po-input
          class="po-md-4"
          name="bairro"
          [(ngModel)]="form.bairro"
          p-label="Bairro">
        </po-input>

        <po-input
          class="po-md-3"
          name="cidade"
          [(ngModel)]="form.cidade"
          p-label="Cidade">
        </po-input>

        <po-select
            class="po-md-1"
            name="estado"
            [ngModel]="form.estado"
            (ngModelChange)="form.estado = $event"
            p-label="UF"
            [p-options]="ufOptions">
        </po-select>

        <po-checkbox-group
            class="po-md-12"
            name="ramos_atuacao"
            [ngModel]="form.ramos_atuacao"
            (ngModelChange)="form.ramos_atuacao = $event"
            p-label="Ramos de atuação"
            [p-options]="ramosOptions">
        </po-checkbox-group>

        <po-decimal
            class="po-md-3"
            name="comissao_padrao"
            [(ngModel)]="form.comissao_padrao"
            p-label="Comissão padrão (%)"
            [p-decimals-length]="2"
            [p-min]="0"
            [p-max]="100">
        </po-decimal>

        <po-number
          class="po-md-3"
          name="prazo_comissao_dias"
          [(ngModel)]="form.prazo_comissao_dias"
          p-label="Prazo comissão (dias)"
          [p-min]="0">
        </po-number>

        <po-textarea
          class="po-md-12"
          name="observacoes"
          [(ngModel)]="form.observacoes"
          p-label="Observações"
          [p-rows]="3">
        </po-textarea>
      </div>

      @if (erro) {
        <p class="erro">{{ erro }}</p>
      }
    </po-modal>
  `,
  styles: `
    .erro {
      margin-top: 0.5rem;
      color: var(--color-danger);
      font-size: 0.875rem;
    }
  `,
})
export class NovoFornecedor {
  private readonly supabase = inject(SupabaseService);

  @ViewChild('modal', { static: true }) private modal!: PoModalComponent;

  @Output() readonly salvo = new EventEmitter<void>();

  readonly ramosOptions: PoCheckboxGroupOption[] = RAMOS_ATUACAO;
  readonly ufOptions: PoSelectOption[] = UF.map(uf => ({ label: uf, value: uf }));

  form: Partial<Fornecedor> = {};
  erro = '';
  salvando = false;

  readonly acaoSalvar: PoModalAction = { label: 'Salvar', action: () => this.salvar() };
  readonly acaoCancelar: PoModalAction = { label: 'Cancelar', action: () => this.modal.close() };

  open(): void {
    this.form = { ramos_atuacao: [], ativo: true };
    this.erro = '';
    this.modal.open();
  }

  async salvar(): Promise<void> {
    if (!this.form.razao_social?.trim()) {
      this.erro = 'Informe a razão social.';
      return;
    }

    this.salvando = true;

    const { error } = await this.supabase.client.from('fornecedores').insert({
      ...this.form,
      tipo: 'seguradora',
      ramos_atuacao: this.form.ramos_atuacao ?? [],
      ativo: true,
    });

    this.salvando = false;

    if (error) {
      console.error('Erro ao incluir seguradora:', error.message);
      this.erro = 'Não foi possível salvar. Tente novamente.';
      return;
    }

    this.modal.close();
    this.salvo.emit();
  }
}