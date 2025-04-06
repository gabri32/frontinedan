import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionDocentesComponent } from './administracion-docentes.component';

describe('AdministracionDocentesComponent', () => {
  let component: AdministracionDocentesComponent;
  let fixture: ComponentFixture<AdministracionDocentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministracionDocentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministracionDocentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
