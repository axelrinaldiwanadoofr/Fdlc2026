
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {

  constructor(private http: HttpClient) {}

  getTitresEvenements(): Observable<string[]> {
    return this.http.get<string[]>(
        'http://localhost/Fdlc2026/php/evenement/titres-evenements.php'
    );
  }
}
