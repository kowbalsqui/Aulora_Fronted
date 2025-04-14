import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-curso-detalle',
  templateUrl: './curso-detalle-component.html',
  styleUrls: ['./curso-detalle-component.css'],
  imports: [CommonModule]
})
export class CursoDetalleComponent implements OnInit {
  curso: any;
  modulos: any[] = [];
  usuario: any;
  inscrito: boolean = false;
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.usuario = this.authService.getUser();

    this.cursoService.getCurso(id).subscribe({
      next: (res) => {
        this.curso = res;
        this.modulos = res.modulos || [];
        this.inscrito = res.inscripcion?.includes(this.usuario.id);
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 403) {
          this.router.navigate(['/']);
          alert('No estás inscrito en este curso.');
        }
      }
    });
  }

  apuntarse(): void {
    if (this.curso.precio > 0) {
      this.router.navigate(['/pago', this.curso.id]);
    } else {
      this.cursoService.inscribirse(this.curso.id).subscribe({
        next: () => {
          this.inscrito = true;
        },
        error: () => {
          alert('Error al inscribirse');
        }
      });
    }
  }
}
