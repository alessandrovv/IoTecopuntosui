import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateDistritoModalComponent } from './save-update-distrito-modal.component';

describe('SaveUpdateDistritoModalComponent', () => {
  let component: SaveUpdateDistritoModalComponent;
  let fixture: ComponentFixture<SaveUpdateDistritoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateDistritoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateDistritoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
