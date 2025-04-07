import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';  // Asegúrate de que las rutas estén configuradas correctamente
import { AppComponent } from './app/app.component';  // Asegúrate de que AppComponent esté correctamente importado
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';  // Asegúrate de importar withFetch

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  // Proveer las rutas
    provideHttpClient(withFetch())  // Habilitar la API fetch en lugar de XMLHttpRequest
  ]
})
  .catch((err) => console.error(err));
