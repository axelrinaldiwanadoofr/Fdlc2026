
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personne } from '../modeles/personne';

@Injectable({
  providedIn: 'root'
})
export class PersonneService {

  constructor(private http: HttpClient) {}

  getPersonne(id: number): Observable<Personne> {
    return this.http.get<Personne>(
      `http://localhost/Fdlc2026/php/personne/une-personne.php?id=${id}`
    );
  }
}
