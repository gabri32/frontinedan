import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasVistaDocenteComponentComponent } from './notas-vista-docente-component.component';

describe('NotasVistaDocenteComponentComponent', () => {
  let component: NotasVistaDocenteComponentComponent;
  let fixture: ComponentFixture<NotasVistaDocenteComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotasVistaDocenteComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasVistaDocenteComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
