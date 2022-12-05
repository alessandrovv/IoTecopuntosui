import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateMultitablaComponent } from './save-update-multitabla.component';

describe('SaveUpdateMultitablaComponent', () => {
  let component: SaveUpdateMultitablaComponent;
  let fixture: ComponentFixture<SaveUpdateMultitablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateMultitablaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateMultitablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
