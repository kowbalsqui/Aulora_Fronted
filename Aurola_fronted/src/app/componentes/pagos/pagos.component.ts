import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pago',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
  imports: [CommonModule, FormsModule]
})
export class PagosComponent implements OnInit {
  id!: number;
  tipo!: 'curso' | 'itinerario';  // 🔥 nuevo
  form = {
    titular: '',
    numero: '',
    expiracion: '',
    cvv: ''
  };
  procesando = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tipo = this.route.snapshot.paramMap.get('tipo') as 'curso' | 'itinerario';
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  pagar() {
    // Validaciones (igual que ya tienes)
    const exprFecha = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const exprCvv = /^\d{3,4}$/;
    const exprTarjeta = /^\d{16}$/;

    if (!exprTarjeta.test(this.form.numero) || !exprFecha.test(this.form.expiracion) || !exprCvv.test(this.form.cvv)) {
      alert('Datos de tarjeta inválidos.');
      return;
    }

    if (!this.esFechaExpiracionValida(this.form.expiracion)) {
      alert('La fecha de expiración ya ha pasado.');
      return;
    }

    this.procesando = true;

    const url = this.tipo === 'curso'
      ? `http://localhost:8000/api/v1/cursos/${this.id}/inscribirse/`
      : `http://localhost:8000/api/v1/itinerarios/${this.id}/pagar/`;

    const headers = { Authorization: 'Token ' + localStorage.getItem('auth_token') };

    this.http.post(url, {}, { headers }).subscribe({
      next: () => {
        alert('✅ Pago exitoso. Ya estás inscrito.');
        const redirect = this.tipo === 'curso' ? 'curso' : 'itinerario';
        this.router.navigate(['/' + redirect, this.id]);
      },
      error: () => {
        alert('❌ Error al procesar el pago.');
        this.procesando = false;
      }
    });
  }

  esFechaExpiracionValida(fecha: string): boolean {
    const [mes, anio] = fecha.split('/').map(Number);
    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1;
    const anioActual = ahora.getFullYear() % 100;
    return anio > anioActual || (anio === anioActual && mes >= mesActual);
  }
}

