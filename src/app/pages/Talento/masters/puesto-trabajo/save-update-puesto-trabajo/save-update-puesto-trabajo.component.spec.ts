import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdatePuestoTrabajoComponent } from './save-update-puesto-trabajo.component';

describe('SaveUpdatePuestoTrabajoComponent', () => {
  let component: SaveUpdatePuestoTrabajoComponent;
  let fixture: ComponentFixture<SaveUpdatePuestoTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdatePuestoTrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdatePuestoTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
