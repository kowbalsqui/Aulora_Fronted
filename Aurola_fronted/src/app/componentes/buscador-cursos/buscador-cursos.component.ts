import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, Subject } from 'rxjs'; 
import { AuthService } from '../../services/auth.service';
//Subjects es una fuente de eventos para usarlos como EventEmitter
//debounceTime es un operador que retrasa la emisión de un valor hasta que haya pasado un tiempo determinado desde la última emisión

@Component({
  selector: 'app-explorar-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscador-cursos.component.html',
  styleUrls: ['./buscador-cursos.component.css']
})
export class ExplorarCursosComponent implements OnInit {
  cursos: any[] = [];
  itinerarios: any[] = [];
  searchTerm = '';
  categoriaId = '';
  orden = '';
  searchChanged = new Subject<string>(); //Canal al cual vamos a eviar el texto que busquemos en la barra de busqueda

  constructor(private http: HttpClient, public authService: AuthService) {}

  ngOnInit(): void {
    this.searchChanged.pipe(debounceTime(50)).subscribe((term) => {
      this.searchTerm = term;
      this.cargarCursos();
    });
  
    // Cargar al inicio
    this.cargarCursos();
    //Nos suscribimos al canal de busqueda y le decimos que cuando pase el tiempo del debounceTime busque con lo que tenga dentro el searchChanged
  }

  cargarCursos() {
    let params = [];

    if (this.searchTerm) params.push(`search=${this.searchTerm}`);
    if (this.categoriaId) params.push(`categoria_id=${this.categoriaId}`);
    if (this.orden) params.push(`ordering=${this.orden}`);

    const queryString = params.length ? `?${params.join('&')}` : '';

    this.http.get<any[]>(`http://localhost:8000/api/v1/explorar-cursos/${queryString}`)
      .subscribe({
        next: (res) => this.cursos = res,
        error: (err) => console.error('Error cargando cursos:', err)
      });
    
    this.http.get<any[]>(`http://localhost:8000/api/v1/explorar-itinerarios/${queryString}`)
      .subscribe({
        next: (res) => this.itinerarios = res,
        error: (err) => console.error('Error cargando itinerarios:', err)
      });
  }
}
