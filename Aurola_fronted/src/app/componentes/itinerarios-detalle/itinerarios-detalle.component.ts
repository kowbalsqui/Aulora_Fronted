import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-itinerario-detalle',
  standalone: true,
  templateUrl: './itinerarios-detalle.component.html',
  styleUrl: './itinerarios-detalle.component.css',
  imports: [CommonModule]
})
export class ItinerarioDetalleComponent implements OnInit {
  itinerario: any;
  cargando = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  const token = this.authService.getToken();

  if (!token) {
    this.errorMessage = 'No estás autenticado.';
    this.router.navigate(['/login']);
    return;
  }

  const headers = new HttpHeaders({ Authorization: `Token ${token}` });

  this.http.get<any>(`http://34.236.97.194:8000/api/v1/itinerarios/${id}/`, { headers })
    .subscribe({
      next: (res) => {
        this.itinerario = res;
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        this.errorMessage = 'No se pudo cargar el itinerario.';
        console.error(err);
        setTimeout(() => this.router.navigate(['/']), 1500);
      }
    });
}

  irAlCurso(id: number): void {
    this.router.navigate(['/curso', id]);
  }

  editarItinerario(id: number): void {
  this.router.navigate(['/itinerario/editar', id]);
}

}
