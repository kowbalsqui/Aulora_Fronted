import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RecaptchaModule } from "ng-recaptcha";

@Component({
  selector: 'app-register',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  imports: [CommonModule, FormsModule, RecaptchaModule]
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password1 = '';
  password2 = '';
  rol = 'profesor'; // Valor por defecto
  tipo_cuenta = 'FR';
  foto_perfil: File | null = null;
  materia = ''; 
  materias: { id: number, nombre: string }[] = [];
  
  mostrarPassword1: boolean = false;
  mostrarPassword2: boolean = false;

  captchaValido: boolean = false;
  captchaToken: string | null = null;

  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: any) {
    this.foto_perfil = event.target.files[0];
  }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8000/api/v1/categorias/').subscribe({
      next: (data) => {
        console.log("Materias recibidas:", data); // 👈 esto es lo importante
        this.materias = data;
      },
      error: (err) => {
        console.error("Error al cargar materias", err);
      }
    });
  }

  onCaptchaResolved(token: string | null) {
    if (token) {
      this.captchaValido = true;
      this.captchaToken = token;
    } else {
      this.captchaValido = false;
      this.captchaToken = null;
    }
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

    if (this.rol === 'profesor' || this.rol === '2') {
      formData.append('materia', this.materia);
    }

    formData.append('captcha', this.captchaToken ?? '');

    this.http.post<any>('http://localhost:8000/api/v1/register/', formData).subscribe({
      next: () => {
        // 🔥 Auto-login al registrarse
        this.http.post<any>('http://localhost:8000/api/v1/login/', {
          email: this.email,
          password: this.password1
        }).subscribe({
          next: (loginRes) => {
            localStorage.setItem('auth_token', loginRes.token);
            localStorage.setItem('auth_user', JSON.stringify(loginRes.user));
            this.successMessage = 'Registro y login exitosos. Redirigiendo...';
            this.errorMessage = '';
            setTimeout(() => this.router.navigate(['/']), 1500); // Cambia '/' si quieres otra ruta
          },
          error: () => {
            this.successMessage = '';
            this.errorMessage = 'Usuario creado, pero fallo al iniciar sesión automáticamente.';
          }
        });
      },
      error: (error) => {
        this.errorMessage = 'Error en el registro: ' + JSON.stringify(error.error);
        this.successMessage = '';
      }
    });
  }

}