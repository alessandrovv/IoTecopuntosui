import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEstablecimientoModalComponent } from './delete-establecimiento-modal.component';

describe('DeleteEstablecimientoModalComponent', () => {
  let component: DeleteEstablecimientoModalComponent;
  let fixture: ComponentFixture<DeleteEstablecimientoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteEstablecimientoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteEstablecimientoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
