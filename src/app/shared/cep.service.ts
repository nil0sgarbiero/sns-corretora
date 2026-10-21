import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface EnderecoCep {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface ViaCepResposta {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
}

@Injectable({ providedIn: 'root' })
export class CepService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://viacep.com.br/ws';

  async buscar(cep: string): Promise<EnderecoCep | null> {
    const limpo = (cep ?? '').replace(/\D/g, '');

    if (limpo.length !== 8) {
      return null;
    }

    try {
      const dados = await firstValueFrom(
        this.http.get<ViaCepResposta>(`${this.baseUrl}/${limpo}/json/`),
      );

      if (!dados || dados.erro) {
        return null;
      }

      return {
        cep: dados.cep ?? limpo,
        logradouro: dados.logradouro ?? '',
        complemento: dados.complemento ?? '',
        bairro: dados.bairro ?? '',
        cidade: dados.localidade ?? '',
        estado: dados.uf ?? '',
      };
    } catch (erro) {
      console.error('Erro ao consultar CEP:', erro);
      return null;
    }
  }
}