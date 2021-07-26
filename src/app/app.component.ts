import { Component } from '@angular/core';
import { StorageService } from './api/storage.service';
import { UsuarioService } from './api/usuario.service';
import { Constantes } from './shared/app/constantes';
import { Usuario } from './shared/model/usuario';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storageService: StorageService,
    private usuarioService: UsuarioService
  ) {

    this.storageService.get(Constantes.USUARIO_KEY_STORAGE).then(usuarioStorage => {
      if (!usuarioStorage) {
        this.usuarioService.criar().subscribe((usuarioCriado: Usuario) => {
          this.storageService.set(Constantes.USUARIO_KEY_STORAGE, usuarioCriado);
        });
      } else {
        console.dir(usuarioStorage);
      }
    });
  }
}
