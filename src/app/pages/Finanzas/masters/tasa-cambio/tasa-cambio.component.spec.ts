import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasaCambioComponent } from './tasa-cambio.component';

describe('TasaCambioComponent', () => {
  let component: TasaCambioComponent;
  let fixture: ComponentFixture<TasaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
