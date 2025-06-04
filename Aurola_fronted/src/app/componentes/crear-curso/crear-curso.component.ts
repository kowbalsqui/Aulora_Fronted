import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-crear-curso',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-curso.component.html',
  styleUrl: './crear-curso.component.css'
})
export class CrearCursoComponent {
  categorias: any[] = []; 

  nuevoCurso = {
    titulo: '',
    descripcion: '',
    categoria_id: 0,
    precio: 0,
  };

  foto: File | null = null; 
  errorMessage: string|null = ''; 
  successMessage: string|null = '';

  constructor(private router: Router, public authService: AuthService, private http: HttpClient){}

  ngOnInit(): void {
    const token = this.authService.getToken();
    this.http.get('http://34.236.97.194:8000/api/v1/categorias/', {
      headers: {Authorization : 'Token ' + token}
    }).subscribe({
      next: (res: any) => {
        this.categorias = res;
      },
      error: (err) => {
        console.log('Error al cargar las categorias', err);
        this.errorMessage = 'Error al cargar las categorias';
      }
    })
  }

  onFileSelected(event: any) {
    this.foto = event.target.files[0];
  }

  crearCurso(){
    const token = this.authService.getToken();
    const formdata = new FormData(); 
    formdata.append('titulo',this.nuevoCurso.titulo);
    formdata.append('descripcion', this.nuevoCurso.descripcion);
    formdata.append('precio', this.nuevoCurso.precio.toString());
    formdata.append('categoria_id', this.nuevoCurso.categoria_id.toString());
    if (this.foto){
      formdata.append('foto', this.foto);
    }

    console.log('FormData', {
      titulo: this.nuevoCurso.titulo,
      descripcion: this.nuevoCurso.descripcion,
      precio: this.nuevoCurso.precio,
      categoria_id: this.nuevoCurso.categoria_id,
      foto: this.foto
    });

    this.http.post('http://34.236.97.194:8000/api/v1/cursos/', formdata, {
      headers: {
        'Authorization': 'Token ' + token
      }
    }).subscribe({
      next: (res) => {
        this.successMessage = 'Curso creado exitosamente'; 
        this.errorMessage = ""; 
        this.router.navigate(['/']);
      },
      error: (err) =>{
        this.errorMessage = 'Error al crear el curso'; 
        this.successMessage = "";
        console.log('Error al crear el curso', err.error); 
      }
    })
  }
}
