import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasMaterialComponent } from './categorias-material.component';

describe('CategoriasMaterialComponent', () => {
  let component: CategoriasMaterialComponent;
  let fixture: ComponentFixture<CategoriasMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriasMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriasMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
