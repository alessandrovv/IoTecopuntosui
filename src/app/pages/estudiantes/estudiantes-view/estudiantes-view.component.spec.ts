import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudiantesViewComponent } from './estudiantes-view.component';

describe('EstudiantesViewComponent', () => {
  let component: EstudiantesViewComponent;
  let fixture: ComponentFixture<EstudiantesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstudiantesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudiantesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
