import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaseMaterialComponent } from './clase-material.component';

describe('ClaseMaterialComponent', () => {
  let component: ClaseMaterialComponent;
  let fixture: ComponentFixture<ClaseMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaseMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaseMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
