import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-verify-mail-passw',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verify-mail-passw.html',
  styleUrls: ['./verify-mail-passw.css']
})
export class VerifyMailPassw implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(Auth);
  private router = inject(Router);

  mensajeError = '';

  formVerifyCode = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  correoUsuario!: string;

  ngOnInit(): void {
    this.correoUsuario = this.route.snapshot.queryParamMap.get('email')!;
  }

  sendVerificationCode() {
    if (this.formVerifyCode.invalid) return;

    const code = this.formVerifyCode.value.code;

    this.authService.validateCode({
      correo: this.correoUsuario,
      codigo: Number(code)
    }).subscribe({
      next: (res) => {
        this.mensajeError = '';
        
        // Redirección a cambiar contraseña con el correo del usuario
        this.router.navigate(['/changePassword'], {
          queryParams: { email: this.correoUsuario }
        });
      },
      error: (err) => {
        this.mensajeError = err.error.message;
      }
    });
  }
}