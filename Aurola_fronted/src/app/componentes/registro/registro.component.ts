import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password1 = '';
  password2 = '';
  rol = 'profesor'; // Valor por defecto
  tipo_cuenta = 'FR';
  foto_perfil: File | null = null;

  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: any) {
    this.foto_perfil = event.target.files[0];
  }

  register() {
    if (this.password1 !== this.password2) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      this.successMessage = '';
      return;
    }

    const rolMap: any = {
      admin: 1,
      profesor: 2,
      estudiante: 3
    };

    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('email', this.email);
    formData.append('password1', this.password1);
    formData.append('password2', this.password2);
    formData.append('rol', rolMap[this.rol]);
    formData.append('tipo_cuenta', this.tipo_cuenta);

    if (this.foto_perfil) {
      formData.append('foto_perfil', this.foto_perfil);
    }

    this.http.post<any>('http://localhost:8000/api/v1/register/', formData).subscribe({
      next: () => {
        this.successMessage = 'Registro exitoso. Redirigiendo al login...';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error) => {
        this.errorMessage = 'Error en el registro: ' + JSON.stringify(error.error);
        this.successMessage = '';
      }
    });
  }
}