import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/'; // URL de tu API en Django

  constructor(private http: HttpClient) {}

  // Llamada para registrar un nuevo usuario
  register(usuarioData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}usuarios/`, usuarioData);
  }

  // Llamada para login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, credentials);
  }
}
