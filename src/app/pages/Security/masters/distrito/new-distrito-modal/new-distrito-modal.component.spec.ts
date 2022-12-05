import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDistritoModalComponent } from './new-distrito-modal.component';

describe('NewDistritoModalComponent', () => {
  let component: NewDistritoModalComponent;
  let fixture: ComponentFixture<NewDistritoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDistritoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDistritoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
