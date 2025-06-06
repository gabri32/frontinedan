import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignarGradoComponent } from './modal-asignar-grado.component';

describe('ModalAsignarGradoComponent', () => {
  let component: ModalAsignarGradoComponent;
  let fixture: ComponentFixture<ModalAsignarGradoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAsignarGradoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAsignarGradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
