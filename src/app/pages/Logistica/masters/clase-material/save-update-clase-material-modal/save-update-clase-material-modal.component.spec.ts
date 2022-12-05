import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateClaseMaterialModalComponent } from './save-update-clase-material-modal.component';

describe('SaveUpdateClaseMaterialModalComponent', () => {
  let component: SaveUpdateClaseMaterialModalComponent;
  let fixture: ComponentFixture<SaveUpdateClaseMaterialModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateClaseMaterialModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateClaseMaterialModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
