import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateVacanteComponent } from './save-update-vacante.component';

describe('SaveUpdateVacanteComponent', () => {
  let component: SaveUpdateVacanteComponent;
  let fixture: ComponentFixture<SaveUpdateVacanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateVacanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateVacanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
