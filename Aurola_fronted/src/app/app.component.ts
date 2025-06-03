import { Component, ElementRef, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';  // Importamos el Router
import { RouterModule } from '@angular/router';  // Importar RouterModule
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports:[RouterModule, CommonModule, DragDropModule]
})
export class AppComponent {
  @ViewChild('temaNuevo') temaNuevo!: ElementRef;

  mostrarPerfil = false;

  constructor(private router: Router, public authService: AuthService) {}

  modoOscuro: boolean = false;


  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const guardado = localStorage.getItem('modoOscuro');
      if (guardado === '1') {
        this.modoOscuro = true;
        document.body.classList.add('modo-oscuro');
      }
    }
  }

    
  toggleTema() {
    this.modoOscuro = !this.modoOscuro;
    if (this.modoOscuro) {
      document.body.classList.add('modo-oscuro');
      localStorage.setItem('modoOscuro', '1');
    } else {
      document.body.classList.remove('modo-oscuro');
      localStorage.setItem('modoOscuro', '0');
    }
  }

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
