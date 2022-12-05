import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateDocumentoComponent } from './save-update-documento.component';

describe('SaveUpdateDocumentoComponent', () => {
  let component: SaveUpdateDocumentoComponent;
  let fixture: ComponentFixture<SaveUpdateDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateDocumentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
