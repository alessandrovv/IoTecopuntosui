import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateCategoriamaterialComponent } from './save-update-categoriamaterial.component';

describe('SaveUpdateCategoriamaterialComponent', () => {
  let component: SaveUpdateCategoriamaterialComponent;
  let fixture: ComponentFixture<SaveUpdateCategoriamaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateCategoriamaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateCategoriamaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
