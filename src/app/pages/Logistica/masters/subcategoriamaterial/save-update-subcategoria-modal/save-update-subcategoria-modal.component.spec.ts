import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateSubcategoriaModalComponent } from './save-update-subcategoria-modal.component';

describe('SaveUpdateSubcategoriaModalComponent', () => {
  let component: SaveUpdateSubcategoriaModalComponent;
  let fixture: ComponentFixture<SaveUpdateSubcategoriaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateSubcategoriaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateSubcategoriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
