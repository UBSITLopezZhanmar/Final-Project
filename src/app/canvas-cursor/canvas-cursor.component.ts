import {
  AfterViewInit,
  Component,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-canvas-cursor',
  standalone: true,
  templateUrl: './canvas-cursor.component.html',
  styleUrls: ['./canvas-cursor.component.css']
})
export class CanvasCursorComponent
  implements AfterViewInit, OnDestroy {

  private ctx: any;
  private lines: any[] = [];
  private pos = { x: 0, y: 0 };
  private hue: any;

  private E = {
    friction: 0.5,
    trails: 20,
    size: 50,
    dampening: 0.25,
    tension: 0.98,
  };

  ngAfterViewInit(): void {
    this.renderCanvas();
  }

  ngOnDestroy(): void {
    this.ctx.running = false;

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('touchstart', this.onMouseMove);

    window.removeEventListener('resize', this.resizeCanvas);
  }

  // =========================
  // Oscillator
  // =========================

  Oscillator = class {
    phase: number;
    offset: number;
    frequency: number;
    amplitude: number;

    constructor(options: any = {}) {
      this.phase = options.phase || 0;
      this.offset = options.offset || 0;
      this.frequency = options.frequency || 0.001;
      this.amplitude = options.amplitude || 1;
    }

    update() {
      this.phase += this.frequency;
      return this.offset + Math.sin(this.phase) * this.amplitude;
    }
  };

  // =========================
  // Node
  // =========================

  Node = class {
    x = 0;
    y = 0;
    vx = 0;
    vy = 0;
  };

  // =========================
  // Line
  // =========================

  Line = class {

    spring: number;
    friction: number;
    nodes: any[] = [];

    constructor(
      private parent: CanvasCursorComponent,
      options: any = {}
    ) {

      this.spring = options.spring || 0.45;

      this.friction =
        parent.E.friction +
        0.01 * Math.random() -
        0.002;

      for (let i = 0; i < parent.E.size; i++) {

        const node = new parent.Node();

        node.x = parent.pos.x;
        node.y = parent.pos.y;

        this.nodes.push(node);
      }
    }

    update() {

      let spring = this.spring;

      let node = this.nodes[0];

      node.vx +=
        (this.parent.pos.x - node.x) * spring;

      node.vy +=
        (this.parent.pos.y - node.y) * spring;

      for (let i = 0; i < this.nodes.length; i++) {

        node = this.nodes[i];

        if (i > 0) {

          const prev = this.nodes[i - 1];

          node.vx +=
            (prev.x - node.x) * spring;

          node.vy +=
            (prev.y - node.y) * spring;

          node.vx +=
            prev.vx * this.parent.E.dampening;

          node.vy +=
            prev.vy * this.parent.E.dampening;
        }

        node.vx *= this.friction;
        node.vy *= this.friction;

        node.x += node.vx;
        node.y += node.vy;

        spring *= this.parent.E.tension;
      }
    }

    draw() {

      const ctx = this.parent.ctx;

      let x = this.nodes[0].x;
      let y = this.nodes[0].y;

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let i = 1; i < this.nodes.length - 2; i++) {

        const a = this.nodes[i];
        const b = this.nodes[i + 1];

        x = (a.x + b.x) * 0.5;
        y = (a.y + b.y) * 0.5;

        ctx.quadraticCurveTo(a.x, a.y, x, y);
      }

      const a = this.nodes[this.nodes.length - 2];
      const b = this.nodes[this.nodes.length - 1];

      ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);

      ctx.stroke();
      ctx.closePath();
    }
  };

  // =========================
  // Mouse Move
  // =========================

  onMouseMove = (e: any) => {

    if (e.touches) {

      this.pos.x = e.touches[0].pageX;
      this.pos.y = e.touches[0].pageY;

    } else {

      this.pos.x = e.clientX;
      this.pos.y = e.clientY;
    }

    e.preventDefault();
  };

  // =========================
  // Resize
  // =========================

  resizeCanvas = () => {

    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;
  };

  // =========================
  // Render
  // =========================

  render = () => {

    if (!this.ctx.running) return;

    this.ctx.globalCompositeOperation =
      'source-over';

    this.ctx.clearRect(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );

    this.ctx.globalCompositeOperation =
      'lighter';

    this.ctx.strokeStyle =
      'hsla(' +
      Math.round(this.hue.update()) +
      ',100%,50%,0.2)';

    this.ctx.lineWidth = 1;

    for (let i = 0; i < this.lines.length; i++) {

      const line = this.lines[i];

      line.update();
      line.draw();
    }

    requestAnimationFrame(this.render);
  };

  // =========================
  // Initialize
  // =========================

  renderCanvas() {

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    this.ctx = canvas.getContext('2d');

    this.ctx.running = true;

    this.hue = new this.Oscillator({
      phase: Math.random() * Math.PI * 2,
      amplitude: 85,
      frequency: 0.0015,
      offset: 285,
    });

    for (let i = 0; i < this.E.trails; i++) {

      this.lines.push(
        new this.Line(this, {
          spring:
            0.45 + (i / this.E.trails) * 0.025,
        })
      );
    }

    this.resizeCanvas();

    document.addEventListener(
      'mousemove',
      this.onMouseMove
    );

    document.addEventListener(
      'touchmove',
      this.onMouseMove
    );

    window.addEventListener(
      'resize',
      this.resizeCanvas
    );

    this.render();
  }
}