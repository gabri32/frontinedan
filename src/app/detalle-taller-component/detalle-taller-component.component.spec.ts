import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTallerComponentComponent } from './detalle-taller-component.component';

describe('DetalleTallerComponentComponent', () => {
  let component: DetalleTallerComponentComponent;
  let fixture: ComponentFixture<DetalleTallerComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleTallerComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleTallerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
