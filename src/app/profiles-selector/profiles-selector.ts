import { PLATFORM_ID, Component, inject, OnInit } from '@angular/core';
import { Perfil, UsuarioService } from '../services/usuario-service';
import { isPlatformBrowser } from '@angular/common';
import { ProfilesAccount } from '../account/profiles-account/profiles-account';


@Component({
  selector: 'app-profiles-selector',
  imports: [],
  templateUrl: './profiles-selector.html',
  styleUrl: './profiles-selector.css'
})
export class ProfilesSelector implements OnInit {
  private usuarioService = inject(UsuarioService);
  private platformId = inject(PLATFORM_ID);

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
      this.usuarioService.getAllProfiles().subscribe({
        next: (res) => {
          this.perfiles = res;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
