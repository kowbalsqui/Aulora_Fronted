import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-curso-detalle',
  templateUrl: './curso-detalle-component.html',
  styleUrls: ['./curso-detalle-component.css'],
  standalone: true,
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
    public authService: AuthService,
    private router: Router,
    private http: HttpClient
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

  crearModulo(): void {
    this.router.navigate(['/modulo/crear'], {
      queryParams: { curso_id: this.curso.id }
    });
  }

  editarModulo(modulo: any): void {
    this.router.navigate(['/modulo/editar', modulo.id]);
  }

  verDetalle(modulo: any): void {
    setTimeout(() => this.router.navigate(['/modulo', modulo.id]), 1500);
  }

  eliminarModulo(id : number){
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: 'Token ' + token });
    const confirmar = confirm(`¿Estás seguro de que quieres eliminar el curso`);

    if (!confirmar){
      return; 
    }

    this.http.delete(`http://localhost:8000/api/v1/modulos/${id}/`, { headers }).subscribe({
      next: () => {
        this.modulos = this.modulos.filter((c) => c.id !== id);
        this.router.navigate(['/']);
      },
      error: (err) => console.error('Error al eliminar curso', err),
    });
  }
} 
