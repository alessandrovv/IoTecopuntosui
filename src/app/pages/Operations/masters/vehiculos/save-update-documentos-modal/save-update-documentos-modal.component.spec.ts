import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateDocumentosModalComponent } from './save-update-documentos-modal.component';

describe('SaveUpdateDocumentosModalComponent', () => {
  let component: SaveUpdateDocumentosModalComponent;
  let fixture: ComponentFixture<SaveUpdateDocumentosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateDocumentosModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateDocumentosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
