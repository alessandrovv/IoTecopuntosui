import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecompensasAddEditComponent } from './recompensas-add-edit.component';

describe('RecompensasAddEditComponent', () => {
  let component: RecompensasAddEditComponent;
  let fixture: ComponentFixture<RecompensasAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecompensasAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecompensasAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
