import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateAreaComponent } from './save-update-area.component';

describe('SaveUpdateAreaComponent', () => {
  let component: SaveUpdateAreaComponent;
  let fixture: ComponentFixture<SaveUpdateAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
