import { Component, ElementRef, inject, QueryList, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  service = inject(StoreService);

  ngAfterViewInit() {

    const videos = document.querySelectorAll('video');

    videos.forEach((video: HTMLVideoElement) => {
      video.muted = true;
      video.loop = true;
      video.playsInline = true;

      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Autoplay blocked:', err);
        });
      }
    });

  }
}
