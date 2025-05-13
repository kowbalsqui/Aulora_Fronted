import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pago',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
  imports: [CommonModule, FormsModule]
})
export class PagosComponent implements OnInit {
  cursoId!: number;
  form = {
    titular: '',
    numero: '',
    expiracion: '',
    cvv: ''
  };
  procesando = false;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cursoId = Number(this.route.snapshot.paramMap.get('id'));
  }

  esFechaExpiracionValida(fecha: string): boolean {
    const expr = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expr.test(fecha)) return false;

    const [mesStr, anioStr] = fecha.split('/');
    const mes = parseInt(mesStr, 10);
    const anio = parseInt(anioStr, 10);

    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1; // getMonth() devuelve 0-11
    const anioActual = ahora.getFullYear() % 100; // convertir a formato dos dígitos

    // Comparación
    return anio > anioActual || (anio === anioActual && mes >= mesActual);
  }


  pagar() {
    const exprFecha = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/AA con mes válido
    const exprCvv = /^\d{3,4}$/; // CVV de 3 o 4 dígitos
    const exprTarjeta = /^\d{16}$/; // Número de tarjeta de 16 dígitos

    // Validaciones antes de enviar
    if (!exprTarjeta.test(this.form.numero)) {
      alert('Número de tarjeta inválido. Debe contener 16 dígitos.');
      return;
    }

    if (!exprFecha.test(this.form.expiracion)) {
      alert('Fecha de expiración inválida. Usa el formato MM/AA.');
      return;
    }

    if (!this.esFechaExpiracionValida(this.form.expiracion)) {
      alert('La fecha de expiración es inválida o ya ha pasado.');
      return;
    }

    if (!exprCvv.test(this.form.cvv)) {
      alert('CVV inválido. Debe contener 3 o 4 dígitos.');
      return;
    }

    this.procesando = true;

    this.cursoService.pagarCurso(this.cursoId, this.form).subscribe({
      next: () => {
        alert('Pago simulado exitoso. ¡Ya estás inscrito!');
        this.router.navigate(['/curso', this.cursoId]);
      },
      error: () => {
        alert('Error al procesar el pago.');
        this.procesando = false;
      }
    });
  }

}
