import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateProveedoresComponent } from './save-update-proveedores.component';

describe('SaveUpdateProveedoresComponent', () => {
  let component: SaveUpdateProveedoresComponent;
  let fixture: ComponentFixture<SaveUpdateProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateProveedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
