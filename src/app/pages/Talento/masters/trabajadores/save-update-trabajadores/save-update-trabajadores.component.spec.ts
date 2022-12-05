import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateTrabajadoresComponent } from './save-update-trabajadores.component';

describe('SaveUpdateTrabajadoresComponent', () => {
  let component: SaveUpdateTrabajadoresComponent;
  let fixture: ComponentFixture<SaveUpdateTrabajadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateTrabajadoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateTrabajadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
