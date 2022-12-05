import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateCertificadoModalComponent } from './save-update-certificado-modal.component';

describe('SaveUpdateCertificadoModalComponent', () => {
  let component: SaveUpdateCertificadoModalComponent;
  let fixture: ComponentFixture<SaveUpdateCertificadoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateCertificadoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateCertificadoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
