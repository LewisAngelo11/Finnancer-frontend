import { PLATFORM_ID, Component, inject, OnInit, signal } from '@angular/core';
import { Perfil, UsuarioService } from '../services/usuario-service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-profiles-selector',
  imports: [],
  templateUrl: './profiles-selector.html',
  styleUrl: './profiles-selector.css'
})
export class ProfilesSelector implements OnInit {
  private usuarioService = inject(UsuarioService);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  pinRequired = signal(false);

  perfiles: Perfil[] = [];
  
    // Iconos predeterminados que el usuario puede seleccionar para el icono de un perfil
  icons: Record<number ,string> = {
    1: 'bx  bx-star',
    2: 'bx  bx-user',
    3: 'bx bx-dollar',
    4: 'bx bx-cart o bx bx-store',
    5: 'bx bx-package o bx bx-archive',
    6: 'bx bx-shield o bx bx-lock',
    7: 'bx bx-wrench o bx bx-cog',
    8: 'bx bx-file o bx bx-folder',
    9: 'bx bx-phone o bx bx-headphone',
    10: 'bx bx-chat o bx bx-converasation'
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.usuarioService.getAllActiveProfiles().subscribe({
        next: (res) => {
          this.perfiles = res;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  // Función que guarda el perfil seleccionado en localstorage
  seleccionarPerfil(perfil: Perfil) {
    if (perfil.pin !== null) {
      this.pinRequired.set(true);
    }

    // Creo el objeto perfil para guardarlo en el localstorage
    const perfilActual = {
      id_perfil: perfil.id_perfil,
      super_usuario: perfil.super_usuario,
    };
    
    // Guardar el del perfil seleccionado
    localStorage.setItem('perfilActual', JSON.stringify(perfilActual));

    // Redirigir a la siguiente página o dashboard
    this.router.navigate(['/dashboard']);
  }
}
