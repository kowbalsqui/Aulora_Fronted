import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperar-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.css'
})
export class RecuperarPasswordComponent {
  email : string = "";
  error : string = ""; 
  ok : string = ""; 

  constructor(private http: HttpClient, private router: Router) {}

  verificarEmail(){

    this.error = '';
    this.ok = '';

    this.http.post('http://localhost:8000/api/v1/verificar-email/', {email: this.email}).subscribe({
      next: () =>{
        this.ok = "Correo encontrado"
        this.error = '';
        
        setTimeout(() => {
          this.router.navigate(['/resetear', this.email]);
        }, 1500); // espera 1.5 segundos antes de redirigir
      },
      error: (err) =>{
        this.error = err.error?.detail || 'Email no encontrado';
      }
    });
  }
}
