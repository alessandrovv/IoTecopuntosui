import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdatePuntosTransporteComponent } from './save-update-puntos-transporte.component';

describe('SaveUpdatePuntosTransporteComponent', () => {
  let component: SaveUpdatePuntosTransporteComponent;
  let fixture: ComponentFixture<SaveUpdatePuntosTransporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdatePuntosTransporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdatePuntosTransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
