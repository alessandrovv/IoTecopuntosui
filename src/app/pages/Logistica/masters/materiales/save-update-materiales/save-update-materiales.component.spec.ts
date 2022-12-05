import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateMaterialesComponent } from './save-update-materiales.component';

describe('SaveUpdateMaterialesComponent', () => {
  let component: SaveUpdateMaterialesComponent;
  let fixture: ComponentFixture<SaveUpdateMaterialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateMaterialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateMaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
