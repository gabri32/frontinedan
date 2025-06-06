import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignarAsignaturasComponent } from './modal-asignar-asignaturas.component';

describe('ModalAsignarAsignaturasComponent', () => {
  let component: ModalAsignarAsignaturasComponent;
  let fixture: ComponentFixture<ModalAsignarAsignaturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAsignarAsignaturasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAsignarAsignaturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
