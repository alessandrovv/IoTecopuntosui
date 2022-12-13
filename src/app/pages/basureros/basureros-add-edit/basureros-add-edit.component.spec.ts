import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasurerosAddEditComponent } from './basureros-add-edit.component';

describe('BasurerosAddEditComponent', () => {
  let component: BasurerosAddEditComponent;
  let fixture: ComponentFixture<BasurerosAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasurerosAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasurerosAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
