import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Se agregó el HttpClient con Fetch

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()), // Esto permite que HttpCLient se utilice en toda la app
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()), provideCharts(withDefaultRegisterables())
  ]
};
