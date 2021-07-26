import { StorageService } from "src/app/api/storage.service";
import { UsuarioService } from "src/app/api/usuario.service";
import { Usuario } from "../model/usuario";
import { Constantes } from "./constantes";

export class AppPage {

  public audioFundo = new Audio('../../assets/audio/2019-12-11_-_Retro_Platforming_-_David_Fesliyan.mp3');

  public usuario: Usuario = new Usuario();

  constructor(public storageService: StorageService, public usuarioService: UsuarioService) {
    this.usuario = new Usuario();
  }

  ionViewWillEnter() {
    this.storageService.get(Constantes.USUARIO_KEY_STORAGE).then(usuarioStorage => {
      if (!usuarioStorage) {
        this.usuarioService.criar().subscribe((usuarioCriado: Usuario) => {
          this.storageService.set(Constantes.USUARIO_KEY_STORAGE, usuarioCriado);
        });
      }
      this.usuario = usuarioStorage;
      this.desligarAudioFundo();
    })
  }

  ligarAudioFundo() {
    if (this.usuario.configuracao.audioFundoLigado) {
      this.audioFundo.muted = false;
      this.audioFundo.play();
    }
  }

  desligarAudioFundo() {
    this.audioFundo.muted = true;
    this.audioFundo.pause();
  }

  tocarAudio(arquivoAudio: string) {
    if (this.usuario.configuracao.audioEfeitosLigado) {
      let audio = new Audio(arquivoAudio);
      audio.load();
      audio.play();
    }
  }

}
