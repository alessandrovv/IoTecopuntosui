import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveProyectoModalComponent } from './save-proyecto-modal.component';

describe('SaveProyectoModalComponent', () => {
  let component: SaveProyectoModalComponent;
  let fixture: ComponentFixture<SaveProyectoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveProyectoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveProyectoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
