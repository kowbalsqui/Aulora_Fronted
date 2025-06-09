import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-itinerario',
  standalone: true,
  templateUrl: './editar-itinerario.component.html',
  styleUrls: ['./editar-itinerario.component.css'],
  imports: [CommonModule, FormsModule]
})
export class EditarItinerarioComponent implements OnInit {
  itinerarioId: number = 0;
  itinerario: any = {};
  titulo = '';
  descripcion = '';
  precio = 0;
  cursosDisponibles: any[] = [];
  cursosSeleccionados: number[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: 'Token ' + token });
    this.itinerarioId = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get(`http://localhost:8000/api/v1/itinerarios/${this.itinerarioId}/`, { headers }).subscribe({
      next: (res: any) => {
        this.itinerario = res;
        this.titulo = res.titulo;
        this.descripcion = res.descripcion;
        this.precio = res.precio;
        this.cursosSeleccionados = res.cursos_detalles?.map((c: any) => c.id) || [];
      },
      error: () => {
        this.errorMessage = 'Error al cargar el itinerario';
      }
    });

    this.http.get('http://localhost:8000/api/v1/cursos/', { headers }).subscribe({
      next: (res: any) => this.cursosDisponibles = res,
      error: () => this.errorMessage = 'Error al cargar cursos'
    });
  }

  toggleCurso(cursoId: number): void {
    const index = this.cursosSeleccionados.indexOf(cursoId);
    if (index > -1) this.cursosSeleccionados.splice(index, 1);
    else this.cursosSeleccionados.push(cursoId);
  }

  guardarCambios(): void {

    console.log("Ha entrado en guardar cambios"); 
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: 'Token ' + token });

    const payload = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      precio: this.precio,
      cursos: this.cursosSeleccionados
    };

    this.http.put(`http://localhost:8000/api/v1/itinerarios/${this.itinerarioId}/`, payload, { headers }).subscribe({
      next: () => {
        this.successMessage = 'Itinerario actualizado correctamente';
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: () => this.errorMessage = 'Error al actualizar el itinerario'
    });
  }
}
