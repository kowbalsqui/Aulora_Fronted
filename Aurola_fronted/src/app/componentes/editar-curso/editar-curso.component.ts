import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-editar-curso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-curso.component.html',
  styleUrls: ['./editar-curso.component.css']
})
export class EditarCursoComponent implements OnInit {
  cursoId: number = 0;
  titulo = '';
  descripcion = '';
  precio: number = 0;
  categoria_id: number | null = null;
  categoria_nombre: string = '';

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: 'Token ' + token });

    this.cursoId = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get(`http://localhost:8000/api/v1/cursos/${this.cursoId}/`, { headers }).subscribe({
      next: (curso: any) => {
        this.titulo = curso.titulo;
        this.descripcion = curso.descripcion;
        this.precio = curso.precio;
        this.categoria_id = curso.categoria_id;
        this.categoria_nombre = curso.categoria_nombre || 'N/A';
      },
      error: () => this.errorMessage = 'Error al cargar el curso'
    });
  }

  guardarCambios(): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: 'Token ' + token });

    const payload = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      precio: this.precio,
      categoria_id: this.categoria_id // necesario para evitar error del backend
    };

    this.http.put(`http://localhost:8000/api/v1/cursos/${this.cursoId}/`, payload, { headers }).subscribe({
      next: () => {
        this.successMessage = 'Curso actualizado correctamente';
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: () => this.errorMessage = 'Error al actualizar el curso'
    });
  }
}
