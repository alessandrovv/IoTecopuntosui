import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuestoTrabajoComponent } from './puesto-trabajo.component';

describe('PuestoTrabajoComponent', () => {
  let component: PuestoTrabajoComponent;
  let fixture: ComponentFixture<PuestoTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuestoTrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuestoTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
