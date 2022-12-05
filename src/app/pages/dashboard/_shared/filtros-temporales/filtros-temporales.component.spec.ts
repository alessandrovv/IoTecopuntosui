import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosTemporalesComponent } from './filtros-temporales.component';

describe('FiltrosTemporalesComponent', () => {
  let component: FiltrosTemporalesComponent;
  let fixture: ComponentFixture<FiltrosTemporalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltrosTemporalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosTemporalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
