import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionDocumentoComponent } from './configuracion-documento.component';

describe('ConfiguracionDocumentoComponent', () => {
  let component: ConfiguracionDocumentoComponent;
  let fixture: ComponentFixture<ConfiguracionDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracionDocumentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
