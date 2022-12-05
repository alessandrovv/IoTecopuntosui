import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultitablaComponent } from './multitabla.component';

describe('MultitablaComponent', () => {
  let component: MultitablaComponent;
  let fixture: ComponentFixture<MultitablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultitablaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultitablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
