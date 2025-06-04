// crear-itinerario.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-itinerario',
  templateUrl: './crear-itinerario.component.html',
  styleUrls: ['./crear-itinerario.component.css'],
  imports :[CommonModule, FormsModule]
})
export class CrearItinerarioComponent implements OnInit {
  titulo = '';
  descripcion = '';
  precio = 0;
  cursos: any[] = [];
  cursosSeleccionados: number[] = [];

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: 'Token ' + token });

    this.http.get('http://34.236.97.194:8000/api/v1/cursos/', { headers }).subscribe({
      next: (res: any) => this.cursos = res,
      error: (err) => console.error('Error al cargar cursos del profesor:', err)
    });
  }

  toggleCurso(cursoId: number): void {
    const index = this.cursosSeleccionados.indexOf(cursoId);
    if (index > -1) {
      this.cursosSeleccionados.splice(index, 1); // quitar si ya estaba
    } else {
      this.cursosSeleccionados.push(cursoId); // añadir si no estaba
    }
  }

  crearItinerario(): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: 'Token ' + token });

    const payload = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      precio: this.precio,
      cursos: this.cursosSeleccionados
    };

    this.http.post('http://34.236.97.194:8000/api/v1/itinerarios/', payload, { headers }).subscribe({
      next: () => {
        this.successMessage = 'Itinerario creado exitosamente';
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al crear itinerario';
      }
    });
  }
}
