import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestasTallerComponent } from './respuestas-taller.component';

describe('RespuestasTallerComponent', () => {
  let component: RespuestasTallerComponent;
  let fixture: ComponentFixture<RespuestasTallerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RespuestasTallerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RespuestasTallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
