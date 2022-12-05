import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRolModalComponent } from './delete-rol-modal.component';

describe('DeleteRolModalComponent', () => {
  let component: DeleteRolModalComponent;
  let fixture: ComponentFixture<DeleteRolModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteRolModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRolModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
