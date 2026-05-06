import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  lastScroll = 0;

  @HostListener('window:scroll', [])
  onScroll() {
    const current = window.pageYOffset;
    const nav = document.getElementById('navbar');

    if (!nav) return;

    if (current > this.lastScroll) {
      nav.classList.add('hide'); // scroll down
    } else {
      nav.classList.remove('hide'); // scroll up
    }

    this.lastScroll = current;
  }
}
