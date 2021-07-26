import { Component } from '@angular/core';
import { StorageService } from '../api/storage.service';
import { UsuarioService } from '../api/usuario.service';
import { Constantes } from '../shared/app/constantes';
import { AppPage } from '../shared/app/page';
import { Usuario } from '../shared/model/usuario';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page extends AppPage {

  constructor(
    storageService: StorageService,
    usuarioService: UsuarioService) {

    super(storageService, usuarioService);
  }

  salvar() {
    this.usuarioService.atualizar(this.usuario).subscribe((usuarioAtualizado: Usuario) => {
      this.storageService.set(Constantes.USUARIO_KEY_STORAGE, usuarioAtualizado);
      this.usuario = usuarioAtualizado;
    });
  }

}
