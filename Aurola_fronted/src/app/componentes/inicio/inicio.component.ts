import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CursoService } from '../../services/curso.service';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  cursos: any[] = [];
  mis_cursos: any[] = [];
  itinerarios: any[] = [];
  mis_itinerarios: any[] = [];

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private router: Router,
    public cursoService : CursoService
  ) {}

  irAlCurso(id: number) {
    this.router.navigate(['/curso', id]);
  }

  ngOnInit(): void {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders({
        Authorization: 'Token ' + token
      });

      this.http.get<any[]>('http://localhost:8000/api/v1/mis-cursos/', { headers }).subscribe({
        next: (res) => {
          this.mis_cursos = res;
        },
        error: (err) => {
          console.error('Error al cargar cursos:', err);
        }
      });

      this.http.get<any[]>('http://localhost:8000/api/v1/mis-itinerarios', { headers}).subscribe({
        next: (res) =>{
          this.mis_itinerarios = res;
        },
        error: (err)=>{
          console.error('Error al cargar los itinerarios:', err);
        }
      });

      this.http.get<any[]>('http://localhost:8000/api/v1/cursos/', { headers }).subscribe({
        next: (res) => {
          this.cursos = res;
        },
        error: (err) => {
          console.error('Error al cargar cursos:', err);
        }
      });

      this.http.get<any[]>('http://localhost:8000/api/v1/itinerarios/', { headers }).subscribe({
        next: (res) =>{
          this.itinerarios = res; 
        },
        error: (err) =>{
          console.error('Error al cargar los itinerarios', err); 
        }
      });
    }
  }

  apuntarse(curso: any): void {
    if (curso.precio > 0) {
      this.router.navigate(['/pago', curso.id]);
    } else {
      this.cursoService.inscribirse(curso.id).subscribe({
        next: () => {
          alert('Te has inscrito correctamente');
          this.mis_cursos.push(curso)
        },
        error: () => {
          alert('Error al inscribirte. Intenta de nuevo.');
        }
      });
    }
  }

}
