import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { ItinerarioService } from '../../services/itinerario.service';
import { ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DragDropModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatBody') chatBody!: ElementRef;

  cursos: any[] = [];
  mis_cursos: any[] = [];
  itinerarios: any[] = [];
  mis_itinerarios: any[] = [];
  mostrarChat = false;
  mensajeActual = '';
  mensajes: {
    texto: string;
    de: 'usuario' | 'bot';
    opciones?: string[] | null;
  }[] = [];

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    public router: Router,
    public cursoService: CursoService,
    public itinerarioService: ItinerarioService
  ) {}

  dropCurso(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.mis_cursos, event.previousIndex, event.currentIndex);
  }

  dropItinerario(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.mis_itinerarios,
      event.previousIndex,
      event.currentIndex
    );
  }

  irAlCurso(id: number) {
    this.router.navigate(['/curso', id]);
  }

  irAlItinerario(id: number) {
    this.router.navigate(['/itinerario', id]);
  }

  ngOnInit(): void {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders({
        Authorization: 'Token ' + token,
      });

      this.http
        .get<any[]>('http://localhost:8000/api/v1/mis-cursos/', { headers })
        .subscribe({
          next: (res) => {
            this.mis_cursos = res;
          },
          error: (err) => {
            console.error('Error al cargar cursos:', err);
          },
        });

      this.http
        .get<any[]>('http://localhost:8000/api/v1/cursos/?limit=5', { headers })
        .subscribe({
          next: (res) => {
            this.cursos = res;
          },
          error: (err) => {
            console.error('Error al cargar cursos:', err);
          },
        });

      this.http
        .get<any[]>('http://localhost:8000/api/v1/itinerarios/?limit=5', {
          headers,
        })
        .subscribe({
          next: (res) => {
            this.itinerarios = res.filter((it) => !it.inscrito);
          },
          error: (err) => {
            console.error('Error al cargar los itinerarios :', err);
          },
        });

      this.itinerarioService.getMisItinerarios().subscribe({
        next: (res) => {
          this.mis_itinerarios = res;
          console.log('✅ Mis itinerarios:', res); // <-- AÑADE ESTE LOG
        },
        error: (err) => {
          console.error('Error al cargar mis itinerarios:', err);
        },
      });
    }
  }

  apuntarse(curso: any): void {
    if (curso.precio > 0) {
      this.router.navigate(['/pago', 'curso', curso.id]);
    } else {
      this.cursoService.inscribirse(curso.id).subscribe({
        next: () => {
          alert('Te has inscrito correctamente');
          this.mis_cursos.push(curso);
        },
        error: () => {
          alert('Error al inscribirte. Intenta de nuevo.');
        },
      });
    }
  }

  apuntarseItinerarios(itinerario: any): void {
    if (itinerario.precio > 0) {
      this.router.navigate(['/pago', 'itinerario', itinerario.id]);
    } else {
      this.itinerarioService.inscribirse(itinerario.id).subscribe({
        next: () => {
          alert('Te has inscrito al itinerario correctamente');
          this.mis_itinerarios.push(itinerario);
          // 🔥 Elimina el itinerario de sugerencias
          this.itinerarios = this.itinerarios.filter(
            (i) => i.id !== itinerario.id
          );
        },
        error: () => {
          alert('Error al inscribirse dentro del itinerario');
        },
      });
    }
  }

  cargarItinerarios(): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: 'Token ' + token });

    this.http
      .get<any[]>('http://localhost:8000/api/v1/itinerarios/', { headers })
      .subscribe({
        next: (res) => {
          this.itinerarios = res.filter((it) => !it.inscrito);
        },
        error: (err) => {
          console.error('Error al cargar los itinerarios :', err);
        },
      });
  }

  cargaMisCursos(): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: 'Token ' + token });

    this.http
      .get<any[]>('http://localhost:8000/api/v1/mis-cursos/', { headers })
      .subscribe({
        next: (res) => {
          this.mis_cursos = res;
          console.log('mis cursos actualizados correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar mis cursos ' + err);
        },
      });
  }

  pagarItinerario(itinerario: any): void {
    const token = this.authService.getToken();

    this.http
      .post(
        `http://localhost:8000/api/v1/itinerarios/${itinerario.id}/pagar/`,
        {},
        {
          headers: { Authorization: 'Token ' + token },
        }
      )
      .subscribe({
        next: () => {
          alert('✅ Pago exitoso. Inscrito en el itinerario y sus cursos.');
          // Refrescar los datos del usuario
          this.itinerarioService.getMisItinerarios().subscribe({
            next: (res) => (this.mis_itinerarios = res),
          });
          this.cargarItinerarios(); // o recargar los disponibles si tienes método
          this.cargaMisCursos();
        },
        error: () => {
          alert('❌ Error al procesar el pago.');
        },
      });
  }

  editarCurso(id: number): void {
    this.router.navigate(['/editar-curso', id]);
  }


  seleccionarOpcion(opcion: string): void {
    this.mensajeActual = opcion;
    this.enviarMensaje(opcion);
  }

  abrirChat() {
    this.mostrarChat = true;
    if (this.mensajes.length === 0) {
      this.mensajeActual = 'hola';
      this.enviarMensaje('hola');
    }
  }

  ngAfterViewChecked() {
    this.scrollAlFinal();
  }

  scrollAlFinal() {
    try {
      this.chatBody.nativeElement.scrollTop =
        this.chatBody.nativeElement.scrollHeight;
    } catch (err) {}
  }

  enviarMensaje(mensaje: string) {
    const pregunta = this.mensajeActual.trim();
    if (!pregunta) return;

    this.mensajes.push({ texto: pregunta, de: 'usuario' });

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<any>(
        'http://localhost:8000/api/v1/chatbot/',
        { pregunta },
        { headers }
      )
      .subscribe({
        next: (resp) => {
          this.mensajes.push({
            texto: resp.respuesta,
            de: 'bot',
            opciones: resp.opciones || null, // Añadimos esto
          });
          setTimeout(() => this.scrollAlFinal(), 100); // Si tienes scroll automático
        },
        error: () => {
          this.mensajes.push({
            texto: 'Hubo un error al conectar con el servidor.',
            de: 'bot',
          });
        },
      });

    this.mensajeActual = '';
  }

  eliminarCurso(id: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: 'Token ' + token });
    const confirmar = confirm(`¿Estás seguro de que quieres eliminar el curso`);

    if (!confirmar){
      return; 
    }

    this.http.delete(`http://localhost:8000/api/v1/cursos/${id}/`, { headers }).subscribe({
      next: () => {
        this.cursos = this.cursos.filter((c) => c.id !== id);
      },
      error: (err) => console.error('Error al eliminar curso', err),
    });
  }

  eliminarItinerario(id: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: 'Token ' + token });
    const confirmar = confirm(`¿Estás seguro de que quieres eliminar el curso`);

    if (!confirmar){
      return; 
    }

    this.http
      .delete(`http://localhost:8000/api/v1/itinerarios/${id}/`, { headers })
      .subscribe({
        next: () => {
          this.itinerarios = this.itinerarios.filter((i) => i.id !== id);
        },
        error: (err) => console.error('Error al eliminar itinerario', err),
      });
  }
}
