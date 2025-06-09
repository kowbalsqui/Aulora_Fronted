import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private baseUrl = 'http://localhost:8000/api/v1/cursos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCurso(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}/`, {
      headers: {
        Authorization: `Token ${this.authService.getToken()}`
      }
    });
  }

  inscribirse(id: number) {
    return this.http.post<any>(`${this.baseUrl}/${id}/inscribirse/`, {}, {
      headers: {
        Authorization: `Token ${this.authService.getToken()}`
      }
    });
  }

  pagarCurso(cursoId: number, data: any) {
    return this.http.post<any>(`${this.baseUrl}/${cursoId}/inscribirse/`, data, {
      headers: {
        Authorization: `Token ${this.authService.getToken()}`
      }
    });
  }
}
