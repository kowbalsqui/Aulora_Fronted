import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-modulo-detalle',
  standalone: true,
  templateUrl: './modulo-detalle.component.html',
  styleUrls: ['./modulo-detalle.component.css'],
  imports: [CommonModule]
})
export class ModuloDetalleComponent implements OnInit {
  modulo: any = null;
  contenidoSeguro: SafeHtml = "";  
  errorMessage: string | null = null;
  successMessage: string | null = null; 

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    const headers = new HttpHeaders({
      Authorization: 'Token ' + this.authService.getToken()
    });

    this.http.get(`http://localhost:8000/api/v1/modulos/${id}/`, { headers }).subscribe({
      next: (res) => {
        this.modulo = res;
        this.contenidoSeguro = this.sanitizer.bypassSecurityTrustHtml(this.modulo.contenido); // 👈 aquí dentro
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el módulo.';
      }
    });
  }

  completarModulo(moduloId: number) {
    const token = this.authService.getToken();
    const headers = { Authorization: 'Token ' + token };
  
    this.http.post(`http://localhost:8000/api/v1/modulos/${moduloId}/completar/`, {}, { headers })
      .subscribe({
        next: (res: any) => {
          console.log('✅ Progreso actualizado:', res.nuevo_progreso);
          this.successMessage = `¡Progreso actualizado al ${res.nuevo_progreso}%!`;
          // Puedes también actualizar el progreso local si lo estás mostrando en pantalla
        },
        error: (err) => {
          console.error('❌ Error al marcar módulo como completado', err);
          this.errorMessage = 'Error al actualizar progreso.';
        }
      });
  }
}
