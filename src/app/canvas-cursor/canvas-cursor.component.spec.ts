import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasCursorComponent } from './canvas-cursor.component';

describe('CanvasCursorComponent', () => {
  let component: CanvasCursorComponent;
  let fixture: ComponentFixture<CanvasCursorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanvasCursorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasCursorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
