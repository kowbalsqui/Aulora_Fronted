// modulo-formulario.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-modulo-formulario',
  standalone: true,
  templateUrl: './modulo-formulario.component.html',
  styleUrls: ['./modulo-formulario.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ModuloFormularioComponent implements OnInit {
  curso_id: number = 0;
  modulo_id: number | null = null;
  titulo: string = '';
  contenido: string = '';
  tipo_archivo: string = '';
  tipoArchivoOpciones = [
    { value: '', label: 'Sin archivo' },
    { value: 'foto', label: 'Imagen' },
    { value: 'video', label: 'Vídeo' },
    { value: 'documento', label: 'Documento' },
  ];
  
  archivo: File | null = null;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['curso_id']) {
        if (!this.curso_id || this.curso_id <= 0) {
          this.errorMessage = 'Curso no válido. No se puede guardar.';
          return;
        }        
        this.curso_id = Number(params['curso_id']);
        console.log("Curso ID recibido:", this.curso_id); // 🔍 Verificar
      }
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.modulo_id = Number(params['id']);
        this.cargarModulo();
      }
    });
  }

  cargarModulo() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: 'Token ' + token });
  
    this.http.get<any>(`http://localhost:8000/api/v1/modulos/${this.modulo_id}/`, { headers }).subscribe({
      next: (modulo) => {
        this.titulo = modulo.titulo;
        this.contenido = modulo.contenido;
        this.tipo_archivo = modulo.tipo_archivo;
        this.curso_id = modulo.curso_id; // 🔥 Añadir esto si el backend lo devuelve
      },
      error: (err) => {
        console.error('Error al cargar el módulo:', err);
        this.errorMessage = 'Error al cargar el módulo.';
      }
    });
  }

  onFileSelected(event: any) {
    this.archivo = event.target.files[0];
  }

  guardarModulo() {
    const token = this.authService.getToken();
    const formData = new FormData();
    formData.append('titulo', this.titulo);
    formData.append('contenido', this.contenido);
    formData.append('tipo_archivo', this.tipo_archivo);
    formData.append('curso_id', this.curso_id.toString()); // ✅ ¡Siempre incluirlo!
  
    if (this.archivo) {
      formData.append('archivo', this.archivo);
    }
  
    const headers = new HttpHeaders({ Authorization: 'Token ' + token });
    const request = this.modulo_id
      ? this.http.put(`http://localhost:8000/api/v1/modulos/${this.modulo_id}/`, formData, { headers })
      : this.http.post(`http://localhost:8000/api/v1/modulos/`, formData, { headers });
  
    request.subscribe({
      next: () => {
        this.successMessage = 'Módulo guardado correctamente';
        this.errorMessage = null;
        setTimeout(() => this.router.navigate(['/curso', this.curso_id]), 1500);
      },
      error: () => {
        this.successMessage = null;
        this.errorMessage = 'Error al guardar el módulo';
      }
    });
  }
}
