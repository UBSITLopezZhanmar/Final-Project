import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { CanvasCursorComponent } from './canvas-cursor/canvas-cursor.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CanvasCursorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'it-store';
}
