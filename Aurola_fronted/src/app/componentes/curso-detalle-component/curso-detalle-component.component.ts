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

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService,
    public authService: AuthService,  // 🔓 Hacemos público para usar en el HTML
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
          this.errorMessage = 'No estás inscrito en este curso.';
          setTimeout(() => this.router.navigate(['/']), 1500);
        } else {
          this.errorMessage = 'Ocurrió un error al cargar el curso.';
        }
      }
    });
  }

  apuntarse(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.curso.precio > 0) {
      this.router.navigate(['/pago', this.curso.id]);
    } else {
      this.cursoService.inscribirse(this.curso.id).subscribe({
        next: () => {
          this.inscrito = true;
          this.successMessage = 'Te has inscrito correctamente al curso.';
        },
        error: () => {
          this.errorMessage = 'Error al inscribirse. Intenta de nuevo.';
        }
      });
    }
  }

  // 👇 Nueva función para crear módulo
  crearModulo(): void {
    this.router.navigate(['/modulo/crear'], {
      queryParams: { curso_id: this.curso.id }
    });
  }

  // 👇 Nueva función para editar módulo existente
  editarModulo(modulo: any): void {
    this.router.navigate(['/modulo/editar', modulo.id]);
  }
}
