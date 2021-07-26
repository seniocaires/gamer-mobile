import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SugestaoNome } from '../shared/model/sugestao-nome';

@Injectable({
  providedIn: 'root'
})
export class SugestaoNomeService {

  constructor(private http: HttpClient) { }

  buscarAleatoria(): Observable<SugestaoNome> {
    return this.http.get<SugestaoNome>(`${environment.apiUrl}/sugestoesnomes`);
  }
}
