import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateCaracteristicaMaterialComponent } from './save-update-caracteristica-material.component';

describe('SaveUpdateCaracteristicaMaterialComponent', () => {
  let component: SaveUpdateCaracteristicaMaterialComponent;
  let fixture: ComponentFixture<SaveUpdateCaracteristicaMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateCaracteristicaMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateCaracteristicaMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
