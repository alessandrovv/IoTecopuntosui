import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateNeumaticosModalComponent } from './save-update-neumaticos-modal.component';

describe('SaveUpdateNeumaticosModalComponent', () => {
  let component: SaveUpdateNeumaticosModalComponent;
  let fixture: ComponentFixture<SaveUpdateNeumaticosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateNeumaticosModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateNeumaticosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
