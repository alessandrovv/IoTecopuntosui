import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionCrediticiaComponent } from './evaluacion-crediticia.component';

describe('EvaluacionCrediticiaComponent', () => {
  let component: EvaluacionCrediticiaComponent;
  let fixture: ComponentFixture<EvaluacionCrediticiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluacionCrediticiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionCrediticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
