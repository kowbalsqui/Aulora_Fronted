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
  moduloCompletado: boolean = false;

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
        this.moduloCompletado = this.modulo.completado;
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
        console.log('✅ Progreso actualizado:', res.progreso_curso);
        this.successMessage = `¡Progreso actualizado al ${res.progreso_curso}%!`;

        // 🔥 Actualizar cursos_completados en localStorage si llega al 100%
        if (res.progreso_curso === 100) {
          const user = this.authService.getUser();
          if (user) {
            user.cursos_completados = (user.cursos_completados || 0) + 1;
            localStorage.setItem('auth_user', JSON.stringify(user));
            console.log('🎯 Cursos completados actualizado en localStorage:', user.cursos_completados);
          }
        }

        // ✅ marcar como completado y redirigir al curso
        this.moduloCompletado = true;
        setTimeout(() => {
          window.location.href = `/curso/${this.modulo.curso_id}`;
        }, 1500);
      },
      error: (err) => {
        console.error('❌ Error al marcar módulo como completado', err);
        this.errorMessage = 'Error al actualizar progreso.';
      }
    });
}

}
