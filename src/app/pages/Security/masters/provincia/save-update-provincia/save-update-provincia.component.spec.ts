import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateProvinciaComponent } from './save-update-provincia.component';

describe('SaveUpdateProvinciaComponent', () => {
  let component: SaveUpdateProvinciaComponent;
  let fixture: ComponentFixture<SaveUpdateProvinciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateProvinciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateProvinciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
