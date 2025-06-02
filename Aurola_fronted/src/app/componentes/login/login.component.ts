import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { CommonModule } from '@angular/common'; // Importa CommonModuleç
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]  // Asegúrate de que estos módulos estén aquí
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  mostrarPassword1 : boolean = false; 

  constructor(public authService: AuthService, private router : Router) {}

  login() {
  this.authService.login(this.email, this.password).subscribe({
    next: (res) => {
      this.successMessage = `Bienvenido, ${res.user.nombre}`;
      this.errorMessage = '';
      setTimeout(() => this.router.navigate(['/']), 1500);
    },
    error: (err) => {
      console.error('Error de login:', err);
      this.errorMessage = 'Credenciales inválidas o error de conexión.';
      this.successMessage = '';
    }
  });
}
}
