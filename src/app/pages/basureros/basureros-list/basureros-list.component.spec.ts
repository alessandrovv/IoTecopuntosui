import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasurerosListComponent } from './basureros-list.component';

describe('BasurerosListComponent', () => {
  let component: BasurerosListComponent;
  let fixture: ComponentFixture<BasurerosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasurerosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasurerosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
