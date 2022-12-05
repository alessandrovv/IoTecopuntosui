import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSubcategoriaModalComponent } from './delete-subcategoria-modal.component';

describe('DeleteSubcategoriaModalComponent', () => {
  let component: DeleteSubcategoriaModalComponent;
  let fixture: ComponentFixture<DeleteSubcategoriaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSubcategoriaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSubcategoriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
