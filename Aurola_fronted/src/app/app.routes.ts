import { Routes } from '@angular/router';
import { LoginComponent } from '../../src/app/componentes/login/login.component';
import { RegistroComponent } from '../../src/app/componentes/registro/registro.component';
import { InicioComponent } from '../../src/app/componentes/inicio/inicio.component'
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { ExplorarCursosComponent } from '../app/componentes/buscador-cursos/buscador-cursos.component';
import { CrearCursoComponent } from './componentes/crear-curso/crear-curso.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistroComponent },
  { path: 'perfil', component:PerfilComponent},
  { path: 'cursos', component: ExplorarCursosComponent },
  { path: 'crear-curso', component: CrearCursoComponent },
];

