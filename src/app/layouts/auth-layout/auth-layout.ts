import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

/** Centered card shell for login/register/forgot-password. */
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {}
