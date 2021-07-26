import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pergunta } from '../shared/model/pergunta';

@Injectable({
  providedIn: 'root'
})
export class PerguntaService {

  constructor(private http: HttpClient) { }

  buscarAleatoria(): Observable<Pergunta> {
    return this.http.get<Pergunta>(`${environment.apiUrl}/perguntas`);
  }
}
