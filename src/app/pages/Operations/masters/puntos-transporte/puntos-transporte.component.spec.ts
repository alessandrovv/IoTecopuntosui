import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntosTransporteComponent } from './puntos-transporte.component';

describe('PuntosTransporteComponent', () => {
  let component: PuntosTransporteComponent;
  let fixture: ComponentFixture<PuntosTransporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuntosTransporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuntosTransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
