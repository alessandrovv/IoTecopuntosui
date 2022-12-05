import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoVentaDespachoComponent } from './pedido-venta-despacho.component';

describe('PedidoVentaDespachoComponent', () => {
  let component: PedidoVentaDespachoComponent;
  let fixture: ComponentFixture<PedidoVentaDespachoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidoVentaDespachoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoVentaDespachoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
