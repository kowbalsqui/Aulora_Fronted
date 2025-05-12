import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ItinerarioService {

  private baseUrl = 'http://localhost:8000/api/v1/itinerarios';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getItinerario (id: number){
    return this.http.get<any>(`${this.baseUrl}/${id}/`, { 
      headers: {
        Authorization: `Token ${this.authService.getToken()}`
      }
    });
  }

  getMisItinerarios() {
    return this.http.get<any>('http://localhost:8000/api/v1/mis-itinerarios/', {
      headers: {
        Authorization: `Token ${this.authService.getToken()}`
      }
    });
  }

  inscribirse(id: number){
    return this.http.post<any>(`${this.baseUrl}/${id}/inscribirse/`, {}, {
      headers: {
        Authorization: `Token ${this.authService.getToken()}`
      }
    });
  }

  pagarItinerario(itinerarioId: number, data: any) {
    return this.http.post<any>(`${this.baseUrl}/${itinerarioId}/inscribirse/`, data, {
      headers: {
        Authorization: `Token ${this.authService.getToken()}`
      }
    });
  }
}
