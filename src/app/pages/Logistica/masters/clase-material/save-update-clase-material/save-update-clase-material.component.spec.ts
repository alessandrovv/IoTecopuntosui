import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateClaseMaterialComponent } from './save-update-clase-material.component';

describe('SaveUpdateClaseMaterialComponent', () => {
  let component: SaveUpdateClaseMaterialComponent;
  let fixture: ComponentFixture<SaveUpdateClaseMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateClaseMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateClaseMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
