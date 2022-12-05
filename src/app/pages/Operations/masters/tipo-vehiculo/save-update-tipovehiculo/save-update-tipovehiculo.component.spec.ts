import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateTipovehiculoComponent } from './save-update-tipovehiculo.component';

describe('SaveUpdateTipovehiculoComponent', () => {
  let component: SaveUpdateTipovehiculoComponent;
  let fixture: ComponentFixture<SaveUpdateTipovehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateTipovehiculoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateTipovehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
