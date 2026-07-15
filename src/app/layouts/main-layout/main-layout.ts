import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

/** App shell: top navbar + routed content. */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
