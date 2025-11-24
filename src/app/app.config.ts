// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withRouterConfig, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      //Forces Angular to scroll to the top when navigating to a new route.
      withRouterConfig({ onSameUrlNavigation: 'reload' }), 
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // Crucial setting! Scrolls to the top.
        anchorScrolling: 'enabled',
      })
    ),
    provideHttpClient()
  ]
};
