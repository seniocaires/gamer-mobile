import { Component, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, Subject, timer } from 'rxjs';
import { PartidaService } from '../api/partida.service';
import { PerguntaService } from '../api/pergunta.service';
import { QuestaoService } from '../api/questao.service';
import { Alternativa } from '../shared/model/alternativa';
import { Partida } from '../shared/model/partida';
import { Pergunta } from '../shared/model/pergunta';
import { Resposta } from '../shared/model/resposta';

import { map, takeUntil, repeatWhen } from 'rxjs/operators';
import { AppPage } from '../shared/app/page';
import { StorageService } from '../api/storage.service';
import { Constantes } from '../shared/app/constantes';
import { UsuarioService } from '../api/usuario.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page extends AppPage {

  partida: Partida = new Partida();
  pergunta: Pergunta = new Pergunta();
  alternativaSelecionada: Alternativa = new Alternativa();
  resposta: Resposta = new Resposta();

  private minutos;
  private segundos;
  private tempoParcial = 0;
  private tempoTotal = 0;
  private intervalo = 1000;
  readonly observableRelogio: Observable<any>;
  private pararRelogio = new Subject<void>();
  private iniciarRelogio = new Subject<void>();

  constructor(
    storageService: StorageService,
    usuarioService: UsuarioService,
    private partidaService: PartidaService,
    private perguntaService: PerguntaService,
    public toastController: ToastController) {

    super(storageService, usuarioService);

    this.observableRelogio = timer(0, this.intervalo)
      .pipe(
        map(() => <any>{

        }),
        takeUntil(this.pararRelogio),
        repeatWhen(() => this.iniciarRelogio)
      );

    this.observableRelogio.subscribe(() => {

      if (this.partida.id) {
        // this.minutos = Math.floor(this.tempoTotal / 60);
        // this.segundos = Math.floor(this.tempoTotal % 60);

        // this.minutos = this.minutos < 10 ? "0" + this.minutos : this.minutos;
        // this.segundos = this.segundos < 10 ? "0" + this.segundos : this.segundos;

        document.getElementById('time').innerHTML = this.tempoFormatado(this.tempoTotal);//this.minutos + ":" + this.segundos;
        // this.relogio.textContent = this.minutos + ":" + this.segundos;

        --this.tempoTotal;
        --this.tempoParcial;
        if (this.tempoTotal < 0) {
          this.pararRelogio.next();
          // this.encerrarPartida();
          this.acabouTempo();
        }
      }

    });
  }

  tempoFormatado(tempo: number) {
    let minutos = Math.floor(tempo / 60);
    let segundos = Math.floor(tempo % 60);

    let minutosString = minutos < 10 ? "0" + minutos : minutos;
    let segundosString = segundos < 10 ? "0" + segundos : segundos;

    return minutosString + ":" + segundosString;
  }

  reset() {

    this.encerrarPartida();

    this.partida = new Partida();
    this.pergunta = new Pergunta();
    this.alternativaSelecionada = new Alternativa();
    this.resposta = new Resposta();
    this.tempoTotal = 0;

  }

  ionViewDidLeave() {
    this.reset();
    this.desligarAudioFundo();
  }

  criarPartida() {
    this.ligarAudioFundo();
    this.tempoTotal = 0
    this.partidaService.criar(this.usuario).subscribe((novaPartida: Partida) => {
      this.partida = novaPartida;
      this.buscarProximaPergunta();

      this.audioFundo.load();
      this.audioFundo.play();
      this.audioFundo.loop = true;
    });
  }

  encerrarPartida() {
    if (this.partida.id) {
      this.partidaService.encerrar(this.partida.id).subscribe(_ => {
        this.partida = new Partida();
      });
    }
  }

  buscarProximaPergunta() {
    this.perguntaService.buscarAleatoria().subscribe((perguntaAleatoria: Pergunta) => {
      this.pergunta = perguntaAleatoria;
      this.resposta = new Resposta();
      this.tempoParcial = 15;
      this.tempoTotal = 15 + this.tempoTotal;
      this.pararRelogio.next();
      this.iniciarRelogio.next();
    });
  }

  selecionarAlternativa(alternativa: Alternativa) {

    this.tocarAudio(Constantes.AUDIO_RESPOSTA_SELECIONAR);
    this.pergunta.alternativas.forEach(alternativaIndice => {
      alternativaIndice.selecionada = false;
    });
    alternativa.selecionada = true;
  }

  responder() {

    this.pararRelogio.next();
    this.resposta = new Resposta();
    this.resposta.idQuestao = this.pergunta.id;
    this.pergunta.alternativas.forEach(alternativaIndice => {
      if (alternativaIndice.selecionada) {
        this.resposta.idResposta = alternativaIndice.id;
      }
    });
    this.partidaService.responder(this.partida.id, this.resposta).subscribe((partidaAtualizada: Partida) => {
      if (partidaAtualizada.termino) {
        this.resposta.correta = false;
        this.tocarAudio(Constantes.AUDIO_RESPOSTA_ERRADA);
        this.desligarAudioFundo();
        this.mensagemRespostaErrada();
        this.partidaService.encerrar(this.partida.id).subscribe(_ => { });
        this.tempoParcial = 0;
      } else {
        this.partida = partidaAtualizada;
        this.resposta.correta = true;
        this.tocarAudio(Constantes.AUDIO_RESPOSTA_CERTA);
        this.mensagemRespostaCerta();
        if (this.tempoParcial > 0) {
          this.tempoAdicionado(this.tempoFormatado(this.tempoParcial));
        }
      }
    });
  }

  async acabouTempo() {

    this.desligarAudioFundo();
    this.tocarAudio(Constantes.AUDIO_TEMPO_ACABOU);

    const toast = await this.toastController.create({
      duration: 3000,
      cssClass: 'tempoAcabou',
      position: 'middle'
    });
    toast.present();
    toast.onDidDismiss().then(_ => {
      this.encerrarPartida();
    });
  }

  async tempoAdicionado(tempo: string) {
    const toast = await this.toastController.create({
      duration: 1000,
      cssClass: 'tempoAdicionado',
      position: 'top',
      message: `+ ${tempo} segundos`,
      translucent: true,
      color: undefined
    });
    toast.present();
  }

  async mensagemRespostaErrada() {
    const toast = await this.toastController.create({
      duration: 3000,
      cssClass: 'respostaErrada',
      position: 'middle'
    });
    toast.present();
  }

  async mensagemRespostaCerta() {
    const toast = await this.toastController.create({
      duration: 3000,
      cssClass: 'respostaCerta',
      position: 'middle'
    });
    toast.present();
  }
}
