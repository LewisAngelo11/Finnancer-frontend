import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Este interceptor añade el token JWT al header de la request, primero clona la original y a la copia, añade el token
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const platformId = inject(PLATFORM_ID);
  
  let authToken: string | null = null;

  // Solo acceder a localStorage si ya está en el navegador
  if (isPlatformBrowser(platformId)) {
    authToken = localStorage.getItem('token');
  }

  // Si no hay un token en localSotrage, dejamos pasar la request tal cual
  if (!authToken) {
    return next(req);
  }

  // Clona la request original y le agrega el token en el header a la clonada
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    } 
  })

  // Envía la request clonada y con el token en el header
  return next(clonedReq);
};
