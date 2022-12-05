import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateTasaCambioComponent } from './save-update-tasa-cambio.component';

describe('SaveUpdateTasaCambioComponent', () => {
  let component: SaveUpdateTasaCambioComponent;
  let fixture: ComponentFixture<SaveUpdateTasaCambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateTasaCambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateTasaCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
