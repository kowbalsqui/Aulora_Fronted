import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Importamos el Router
import { RouterModule } from '@angular/router';  // Importar RouterModule
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports:[RouterModule, CommonModule]
})
export class AppComponent {
  mostrarPerfil = false;

  constructor(private router: Router, public authService: AuthService) {}

  goToLogin() {
    // Navegar a la ruta de login
    this.router.navigate(['/login']);
  }

  goToRegister() {
    // Navegar a la ruta de registro
    this.router.navigate(['/register']);
  }

  logout() {
    //Cerra la sesion del usuario
    this.authService.logout();
    this.router.navigate(['/']);
    this.mostrarPerfil = false; 
  }
  
}
