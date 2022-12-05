import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateRolModalComponent } from './save-update-rol-modal.component';

describe('SaveUpdateRolModalComponent', () => {
  let component: SaveUpdateRolModalComponent;
  let fixture: ComponentFixture<SaveUpdateRolModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateRolModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateRolModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
