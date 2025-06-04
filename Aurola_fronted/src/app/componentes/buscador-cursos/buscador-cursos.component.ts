import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { debounceTime, Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-explorar-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscador-cursos.component.html',
  styleUrls: ['./buscador-cursos.component.css']
})
// ... (imports igual que antes)

export class ExplorarCursosComponent implements OnInit {
  cursos: any[] = [];
  cursosPorCategoria: { [categoria: string]: any[] } = {}; // NUEVO
  itinerarios: any[] = [];
  searchTerm = '';
  categoriaId = '';
  orden = '';
  searchChanged = new Subject<string>();
  misCursosIds: Set<number> = new Set();
  misItinerariosIds: Set<number> = new Set();

  constructor(private http: HttpClient, public authService: AuthService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: 'Token ' + token });

    this.searchChanged.pipe(debounceTime(1)).subscribe((term) => {
      this.searchTerm = term;
      this.cargarCursos();
    });

    this.http.get<any[]>('http://34.236.97.194:8000/api/v1/mis-cursos/', { headers }).subscribe({
      next: (res) => {
        this.misCursosIds = new Set(res.map(curso => curso.id));
        this.cargarCursos();
      },
      error: () => console.error('Error al cargar mis cursos')
    });

    this.http.get<any[]>('http://34.236.97.194:8000/api/v1/mis-itinerarios/', { headers }).subscribe({
      next: (res) => {
        this.misItinerariosIds = new Set(res.map(it => it.id));
        this.cargarCursos();
      },
      error: () => console.error('Error al cargar mis itinerarios')
    });
  }

  cargarCursos(): void {
    const headers = new HttpHeaders({
      Authorization: 'Token ' + this.authService.getToken()
    });
    const params: string[] = [];

    if (this.searchTerm) params.push(`search=${this.searchTerm}`);
    if (this.categoriaId) params.push(`categoria_id=${this.categoriaId}`);
    if (this.orden) params.push(`ordering=${this.orden}`);

    const queryString = params.length ? `?${params.join('&')}` : '';

    this.http.get<any[]>(`http://34.236.97.194:8000/api/v1/explorar-cursos/${queryString}`, { headers })
      .subscribe({
        next: (res) => {
          this.cursosPorCategoria = {};
          res.forEach(curso => {
            const categoria = curso.categoria_nombre || 'Sin categoría';
            if (!this.cursosPorCategoria[categoria]) {
              this.cursosPorCategoria[categoria] = [];
            }
            this.cursosPorCategoria[categoria].push({
              ...curso,
              inscrito: this.misCursosIds.has(curso.id)
            });
          });
        },
        error: (err) => console.error('Error cargando cursos:', err)
      });

    this.http.get<any[]>(`http://34.236.97.194:8000/api/v1/explorar-itinerarios/${queryString}`, { headers })
      .subscribe({
        next: (res) => {
          this.itinerarios = res.map(it => ({
            ...it,
            inscrito: this.misItinerariosIds.has(it.id)
          }));
        },
        error: (err) => console.error('Error cargando itinerarios:', err)
      });
  }

  apuntarse(curso: any): void {
    if (curso.precio > 0) {
      window.location.href = `/pago/curso/${curso.id}`;
    } else {
      this.http.post(`http://34.236.97.194:8000/api/v1/cursos/${curso.id}/inscribirse/`, {}, {
        headers: { Authorization: 'Token ' + this.authService.getToken() }
      }).subscribe({
        next: () => {
          alert('✅ Te has inscrito correctamente al curso');
          this.misCursosIds.add(curso.id);
          this.cargarCursos();
        },
        error: () => {
          alert('❌ Error al inscribirte. Intenta de nuevo.');
        }
      });
    }
  }

  apuntarseItinerario(itinerario: any): void {
    if (itinerario.precio > 0) {
      window.location.href = `/pago/itinerario/${itinerario.id}`;
    } else {
      this.http.post(`http://34.236.97.194:8000/api/v1/itinerarios/${itinerario.id}/inscribirse/`, {}, {
        headers: { Authorization: 'Token ' + this.authService.getToken() }
      }).subscribe({
        next: () => {
          alert('✅ Te has inscrito al itinerario correctamente');
          this.misItinerariosIds.add(itinerario.id);
          this.cargarCursos();
        },
        error: () => {
          alert('❌ Error al inscribirte al itinerario');
        }
      });
    }
  }
}
