import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateEstablecimientoModalComponent } from './save-update-establecimiento-modal.component';

describe('SaveUpdateEstablecimientoModalComponent', () => {
  let component: SaveUpdateEstablecimientoModalComponent;
  let fixture: ComponentFixture<SaveUpdateEstablecimientoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateEstablecimientoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateEstablecimientoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
