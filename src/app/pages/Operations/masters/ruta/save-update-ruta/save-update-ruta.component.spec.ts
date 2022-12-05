import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateRutaComponent } from './save-update-ruta.component';

describe('SaveUpdateRutaComponent', () => {
  let component: SaveUpdateRutaComponent;
  let fixture: ComponentFixture<SaveUpdateRutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateRutaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveUpdateRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
