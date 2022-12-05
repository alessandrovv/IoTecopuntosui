import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionEvaluacionCrediticiaComponent } from './revision-evaluacion-crediticia.component';

describe('RevisionEvaluacionCrediticiaComponent', () => {
  let component: RevisionEvaluacionCrediticiaComponent;
  let fixture: ComponentFixture<RevisionEvaluacionCrediticiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisionEvaluacionCrediticiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionEvaluacionCrediticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
