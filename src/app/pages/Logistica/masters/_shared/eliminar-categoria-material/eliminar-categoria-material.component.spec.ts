import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarCategoriaMaterialComponent } from './eliminar-categoria-material.component';

describe('EliminarCategoriaMaterialComponent', () => {
  let component: EliminarCategoriaMaterialComponent;
  let fixture: ComponentFixture<EliminarCategoriaMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EliminarCategoriaMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarCategoriaMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
