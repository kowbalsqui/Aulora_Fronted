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

  pagar() {
    this.procesando = true;

    // En una app real, enviarías esto a una pasarela.
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
