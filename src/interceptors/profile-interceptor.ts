import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const profileInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  let perfilStr: string | null = null;

  // Solo acceder a localStorage si ya está en el navegador
  if (isPlatformBrowser(platformId)) {
    perfilStr = localStorage.getItem('perfilActual');
  }

  // Si no hay un perfil activo en localSotrage, dejamos pasar la request tal cual
  if (!perfilStr){
    return next(req);
  }

  // Extraer los datos
  const perfil = JSON.parse(perfilStr);
  const idPerfil = perfil.id_perfil;
  const superUsuario = perfil.super_usuario;

  // Clona lar request y le agrega en los headers el id del perfil y el tipo de usuario
  const clonedReq = req.clone({
    headers: req.headers
      .set('X-Perfil-Id', idPerfil.toString())
      .set('X-Super-Usuario', superUsuario.toString())
  });

  // Envía la request clonada y con el id y tipo de usuario en el header
  return next(clonedReq);
};
