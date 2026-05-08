import { Component, inject} from '@angular/core';
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
          playPromise.catch(() => {});
        });
      }
    });
  }

  featuredProducts = [
    this.service.monitors().at(-1),
    this.service.keyboards().at(-1),
    this.service.pc().at(-1),
    this.service.arduino().at(-1),

    this.service.monitors()[0],
    this.service.keyboards()[0],
    this.service.pc()[0],
    this.service.arduino()[0]
  ].filter(item => item !== undefined);
}
