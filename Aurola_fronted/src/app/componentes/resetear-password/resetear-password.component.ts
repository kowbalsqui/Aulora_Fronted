import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-resetear-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './resetear-password.component.html',
  styleUrl: './resetear-password.component.css'
})
export class ResetearPasswordComponent {
  email: string = '';
  password1: string = '';
  password2: string = '';
  error: string = '';
  ok: string = '';

  constructor(private http : HttpClient, private route : ActivatedRoute, private router : Router){}

ngOnInit() {
  this.route.paramMap.subscribe(params => {
    this.email = params.get('email') || '';
  });
}
cambiarPassword() {
  if (this.password1 !== this.password2) {
    this.error = 'Las contraseñas no coinciden';
    return;
  }

  this.http.post('http://localhost:8000/api/v1/reset-password/', {
    email: this.email,
    password: this.password1
  }).subscribe({
    next: () => {
      this.ok = 'Contraseña cambiada correctamente';
      this.router.navigate(['/login']);
      this.error = '';

    },
    error: () => {
      this.error = 'Error al cambiar contraseña';
      this.ok = '';
    }
  });
}
}
