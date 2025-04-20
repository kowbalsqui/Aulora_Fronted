import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/v1/login/', {
      email,
      password
    }).pipe(
      tap((res) => {
        if (res.token && res.user && isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.userKey, JSON.stringify(res.user));
        }
      })
    );
  }

  reloadUser(): any {
    // Verificamos que estamos en el navegador (no en SSR)
    if (isPlatformBrowser(this.platformId)) {
      console.log('🔁 Reloading user from localStorage...');
  
      // Obtenemos los datos del usuario desde localStorage
      const user = localStorage.getItem(this.userKey);
  
      if (user) {
        const parsedUser = JSON.parse(user);
        console.log('✅ Usuario recargado correctamente:', parsedUser);
        return parsedUser;
      } else {
        console.warn('⚠️ No hay datos de usuario en localStorage.');
        return null;
      }
    }
  
    console.warn('⚠️ reloadUser llamado fuera del navegador (SSR).');
    return null;
  }  

  setAuthData(token: string, user: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem(this.userKey);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  getRol():number {
    return this.getUser()?.rol; 
  }

  isEstudiante(): boolean {
    return this.getRol() == 3; 
  }

  isProfesor(): boolean {
    return this.getRol() == 2; 
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }
}
