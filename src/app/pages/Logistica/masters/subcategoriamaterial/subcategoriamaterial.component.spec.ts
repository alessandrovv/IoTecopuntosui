import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoriamaterialComponent } from './subcategoriamaterial.component';

describe('SubcategoriamaterialComponent', () => {
  let component: SubcategoriamaterialComponent;
  let fixture: ComponentFixture<SubcategoriamaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcategoriamaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoriamaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
