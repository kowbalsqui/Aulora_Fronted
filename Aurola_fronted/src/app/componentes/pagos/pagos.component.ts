import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pago',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PagosComponent implements OnInit {
  id!: number;
  tipo!: 'curso' | 'itinerario';

  metodoPago: 'tarjeta' | 'paypal' = 'tarjeta';
  precio: number = 0;

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

    const url = this.tipo === 'curso'
      ? `http://localhost:8000/api/v1/cursos/${this.id}/precio/`
      : `http://localhost:8000/api/v1/itinerarios/${this.id}/precio/`;


    const headers = { Authorization: 'Token ' + localStorage.getItem('auth_token') };

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        this.precio = data.precio;

        setTimeout(() => {
          if (this.metodoPago === 'paypal') {
            this.renderizarPayPal();
          }
        }, 0);
      },
      error: () => {
        window.alert('❌ No se pudo obtener el precio.');
      }
    });
  }

  onMetodoPagoChange() {
    if (this.metodoPago === 'paypal') {
      setTimeout(() => this.renderizarPayPal(), 0);
    }
  }


  pagar() {
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
        alert('✅ Pago con tarjeta completado.');
        this.router.navigate(['/' + this.tipo, this.id]);
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

  renderizarPayPal() {
    const paypal = (window as any).paypal;
    if (paypal) {
      paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: this.precio.toFixed(2)
              }
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            alert('✅ Pago completado con PayPal por ' + details.payer.name.given_name);

            const url = this.tipo === 'curso'
              ? `http://localhost:8000/api/v1/cursos/${this.id}/inscribirse/`
              : `http://localhost:8000/api/v1/itinerarios/${this.id}/pagar/`;

            const headers = { Authorization: 'Token ' + localStorage.getItem('auth_token') };

            this.http.post(url, {}, { headers }).subscribe({
              next: () => this.router.navigate(['/' + this.tipo, this.id]),
              error: () => alert('❌ Error al procesar el pago en backend.')
            });
          });
        }
      }).render('#paypal-button-container');
    }
  }
}
