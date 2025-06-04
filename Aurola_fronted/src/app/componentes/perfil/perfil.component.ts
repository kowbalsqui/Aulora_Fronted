import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  nombre = ''; 
  contrasena = ''; 
  tipo_cuenta = ''; 
  cursos_completados = 0;
  foto_perfil : File | null = null;  
  susscesMessage : string | null = null;
  errorMesssage : string | null = null;

  constructor (public authService: AuthService, private http: HttpClient, private router: Router){}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  
    this.http.get<any>('http://34.236.97.194:8000/api/v1/perfil/', {
      headers: { Authorization: 'Token ' + token }
    }).subscribe({
      next: (user) => {
        this.nombre = user.nombre;
        this.tipo_cuenta = user.tipo_cuenta;
        this.cursos_completados = user.cursos_completados; 
  
        // Solo mostramos la ruta, no lo tratamos como File
        // No seteamos this.foto_perfil aquí
      },
      error: (err) => {
        console.log(err);
        this.errorMesssage = 'Error al cargar el perfil del usuario';
      }
    });
  }
  

  onFileSelect(event: any){
    this.foto_perfil = event.target.files[0];
  }

  actualizarPerfil() {
    const token = this.authService.getToken();
    const formData = new FormData();
  
    formData.append('nombre', this.nombre);
    formData.append('tipo_cuenta', this.tipo_cuenta);
  
    if (this.contrasena) {
      formData.append('contrasena', this.contrasena);
    }
  
    if (this.foto_perfil) {
      formData.append('foto_perfil', this.foto_perfil);
    }
  
    this.http.put('http://34.236.97.194:8000/api/v1/perfil/', formData, {
      headers: { Authorization: 'Token ' + token }
    }).subscribe({
      next: (res) => {
        this.susscesMessage = 'Perfil actualizado correctamente';
        this.errorMesssage = '';
  
        // Guardamos el nuevo usuario
        this.authService.setAuthData(token!, res);

        this.authService.reloadUser(); // ← Aquí se recarga desde el localStorage
  
        // Redirigimos al inicio
        this.router.navigate(['/']);
      },
      error: () => {
        this.susscesMessage = '';
        this.errorMesssage = 'Error al modificar el perfil del usuario';
      }
    });
  }
  
}
