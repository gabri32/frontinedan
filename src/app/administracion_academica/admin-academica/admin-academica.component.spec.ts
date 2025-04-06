import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAcademicaComponent } from './admin-academica.component';

describe('AdminAcademicaComponent', () => {
  let component: AdminAcademicaComponent;
  let fixture: ComponentFixture<AdminAcademicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAcademicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
