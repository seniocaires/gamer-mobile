import { Component } from '@angular/core';
import { ClassificacaoService } from '../api/classificacao.service';
import { Classificacao } from '../shared/model/classificacao';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  classificacoes: Classificacao[] = [];

  constructor(private classificacaoService: ClassificacaoService) {
  }

  ionViewWillEnter() {
    this.buscarClassificacao();
  }

  buscarClassificacao() {
    this.classificacaoService.buscar().subscribe((classificacoesRegistradas: Classificacao[]) => {
      this.classificacoes = classificacoesRegistradas;
    });
  }

}
