import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

// Este interceptor añade el token JWT al header de la request, primero clona la original y a la copia, añade el token
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Obtener el token del local storage
  const authToken = localStorage.getItem('token');

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
