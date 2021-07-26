import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Classificacao } from '../shared/model/classificacao';

@Injectable({
  providedIn: 'root'
})
export class ClassificacaoService {

  constructor(private http: HttpClient) { }

  buscar(): Observable<Classificacao[]> {
    return this.http.get<Classificacao[]>(`${environment.apiUrl}/classificacoes`);
  }
}
