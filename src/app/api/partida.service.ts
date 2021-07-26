import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Partida } from '../shared/model/partida';
import { Resposta } from '../shared/model/resposta';
import { Usuario } from '../shared/model/usuario';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {

  constructor(private http: HttpClient) { }

  criar(usuario: Usuario): Observable<Partida> {
    const headers = new HttpHeaders({ 'Authorization': `${usuario.id}` });
    return this.http.post<Partida>(`${environment.apiUrl}/partidas`, {}, {headers: headers});
  }

  responder(idPartida: number, resposta: Resposta): Observable<Partida> {
    return this.http.patch<Partida>(`${environment.apiUrl}/partidas/${idPartida}/resposta`, resposta);
  }


  encerrar(idPartida: number): Observable<Partida> {
    return this.http.patch<Partida>(`${environment.apiUrl}/partidas/${idPartida}/encerrar`, {});
  }
}
