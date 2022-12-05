import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdatePlanContratoModalComponent } from './save-update-plan-contrato-modal.component';

describe('SaveUpdatePlanContratoModalComponent', () => {
  let component: SaveUpdatePlanContratoModalComponent;
  let fixture: ComponentFixture<SaveUpdatePlanContratoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdatePlanContratoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdatePlanContratoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
