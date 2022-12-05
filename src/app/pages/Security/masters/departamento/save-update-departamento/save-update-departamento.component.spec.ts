import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateDepartamentoComponent } from './save-update-departamento.component';

describe('SaveUpdateDepartamentoComponent', () => {
  let component: SaveUpdateDepartamentoComponent;
  let fixture: ComponentFixture<SaveUpdateDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateDepartamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
