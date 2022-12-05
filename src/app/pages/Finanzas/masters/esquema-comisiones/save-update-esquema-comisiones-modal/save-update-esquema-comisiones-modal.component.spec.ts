import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateEsquemaComisionesModalComponent } from './save-update-esquema-comisiones-modal.component';

describe('SaveUpdateEsquemaComisionesModalComponent', () => {
  let component: SaveUpdateEsquemaComisionesModalComponent;
  let fixture: ComponentFixture<SaveUpdateEsquemaComisionesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateEsquemaComisionesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateEsquemaComisionesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
