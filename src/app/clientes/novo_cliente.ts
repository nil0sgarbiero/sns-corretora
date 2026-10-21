import { Component, EventEmitter, Output, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoFieldModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoSelectOption,
} from '@po-ui/ng-components';
import { SupabaseService } from '../services/supabase.service';
import { CepService } from '../shared/cep.service';
import { ESTADOS_UF } from '../shared/estados';
import { ClienteForm } from './cliente.model';

@Component({
  selector: 'app-novo-cliente',
  imports: [FormsModule, PoModalModule, PoFieldModule],
  template: `
    <po-modal
      #modal
      p-title="Novo cliente"
      p-size="lg"
      [p-primary-action]="acaoSalvar"
      [p-secondary-action]="acaoCancelar"
      (p-close)="fechar()">

      <div class="po-row">
        <po-input
          class="po-md-8"
          name="nome"
          [(ngModel)]="form.nome"
          p-label="Nome"
          p-required>
        </po-input>

        <po-input
          class="po-md-4"
          name="cpf"
          [(ngModel)]="form.cpf"
          p-label="CPF"
          p-mask="999.999.999-99">
        </po-input>
      </div>

      <div class="po-row">
        <po-datepicker
          class="po-md-4"
          name="data_nascimento"
          [(ngModel)]="form.data_nascimento"
          p-label="Data de nascimento">
        </po-datepicker>

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
      </div>

      <div class="po-row">
        <po-input
          class="po-md-8"
          name="email"
          [(ngModel)]="form.email"
          p-label="E-mail"
          p-type="email">
        </po-input>

        <po-input
          class="po-md-4"
          name="cep"
          [(ngModel)]="form.cep"
          p-label="CEP"
          p-mask="99999-999"
          [p-loading]="buscandoCep()"
          (p-blur)="buscarCep()">
        </po-input>
      </div>

      <div class="po-row">
        <po-input
          class="po-md-6"
          name="logradouro"
          [(ngModel)]="form.logradouro"
          p-label="Logradouro">
        </po-input>

        <po-input
          class="po-md-2"
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
      </div>

      <div class="po-row">
        <po-input
          class="po-md-4"
          name="bairro"
          [(ngModel)]="form.bairro"
          p-label="Bairro">
        </po-input>

        <po-input
          class="po-md-6"
          name="cidade"
          [(ngModel)]="form.cidade"
          p-label="Cidade">
        </po-input>

        <po-select
          class="po-md-2"
          name="estado"
          [ngModel]="form.estado"
          (ngModelChange)="form.estado = $event"
          p-label="UF"
          [p-options]="estados">
        </po-select>
      </div>

      <div class="po-row">
        <po-textarea
          class="po-md-12"
          name="observacoes"
          [(ngModel)]="form.observacoes"
          p-label="Observações"
          [p-rows]="3">
        </po-textarea>
      </div>
    </po-modal>
  `,
})
export class NovoCliente {
  private readonly supabase = inject(SupabaseService);
  private readonly cepService = inject(CepService);

  @ViewChild('modal', { static: true }) private modal!: PoModalComponent;

  @Output() salvo = new EventEmitter<void>();

  form: ClienteForm = this.vazio();

  readonly buscandoCep = signal(false);
  readonly estados: PoSelectOption[] = ESTADOS_UF;

  readonly acaoSalvar: PoModalAction = {
    label: 'Salvar',
    action: () => this.salvar(),
  };

  readonly acaoCancelar: PoModalAction = {
    label: 'Cancelar',
    action: () => this.fechar(),
  };

  open(): void {
    this.form = this.vazio();
    this.modal.open();
  }

  fechar(): void {
    this.modal.close();
  }

  async buscarCep(): Promise<void> {
    const cep = (this.form.cep ?? '').replace(/\D/g, '');

    if (cep.length !== 8) {
      return;
    }

    this.buscandoCep.set(true);

    const endereco = await this.cepService.buscar(cep);

    this.buscandoCep.set(false);

    if (!endereco) {
      window.alert('CEP não encontrado ou serviço indisponível.');
      return;
    }

    this.form.logradouro = endereco.logradouro;
    this.form.bairro = endereco.bairro;
    this.form.cidade = endereco.cidade;
    this.form.estado = endereco.estado;
  }

  private vazio(): ClienteForm {
    return {
      nome: '',
      cpf: '',
      data_nascimento: null,
      telefone: '',
      celular: '',
      email: '',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      observacoes: '',
    };
  }

  private async salvar(): Promise<void> {
    if (!this.form.nome?.trim()) {
      return;
    }

    this.acaoSalvar.loading = true;

    const payload = {
      nome: this.form.nome.trim(),
      cpf: this.form.cpf?.trim() || null,
      data_nascimento: this.form.data_nascimento || null,
      telefone: this.form.telefone?.trim() || null,
      celular: this.form.celular?.trim() || null,
      email: this.form.email?.trim() || null,
      cep: this.form.cep?.trim() || null,
      logradouro: this.form.logradouro?.trim() || null,
      numero: this.form.numero?.trim() || null,
      complemento: this.form.complemento?.trim() || null,
      bairro: this.form.bairro?.trim() || null,
      cidade: this.form.cidade?.trim() || null,
      estado: this.form.estado || null,
      observacoes: this.form.observacoes?.trim() || null,
    };

    const { error } = await this.supabase.client.from('clientes').insert(payload);

    this.acaoSalvar.loading = false;

    if (error) {
      const duplicado = error.code === '23505';
      console.error('Erro ao salvar cliente:', error.message);
      window.alert(
        duplicado
          ? 'Já existe um cliente com este CPF.'
          : `Não foi possível salvar: ${error.message}`,
      );
      return;
    }

    this.fechar();
    this.salvo.emit();
  }
}