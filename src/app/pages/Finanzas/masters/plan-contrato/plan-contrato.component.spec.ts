import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanContratoComponent } from './plan-contrato.component';

describe('PlanContratoComponent', () => {
  let component: PlanContratoComponent;
  let fixture: ComponentFixture<PlanContratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanContratoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
