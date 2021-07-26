import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../shared/model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  criar(): Observable<Usuario> {
    return this.http.post<Usuario>(`${environment.apiUrl}/usuarios`, {});
  }

  atualizar(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${environment.apiUrl}/usuarios`, usuario);
  }
}
