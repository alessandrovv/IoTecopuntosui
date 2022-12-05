import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPedidoVentaDespachoComponent } from './ver-pedido-venta-despacho.component';

describe('VerPedidoVentaDespachoComponent', () => {
  let component: VerPedidoVentaDespachoComponent;
  let fixture: ComponentFixture<VerPedidoVentaDespachoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerPedidoVentaDespachoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerPedidoVentaDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
