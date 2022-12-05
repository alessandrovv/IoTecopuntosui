import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProyectoModalComponent } from './update-proyecto-modal.component';

describe('UpdateProyectoModalComponent', () => {
  let component: UpdateProyectoModalComponent;
  let fixture: ComponentFixture<UpdateProyectoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProyectoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProyectoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
