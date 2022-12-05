import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePedidoVentaDespachoModalComponent } from './delete-pedido-venta-despacho-modal.component';

describe('DeletePedidoVentaDespachoModalComponent', () => {
  let component: DeletePedidoVentaDespachoModalComponent;
  let fixture: ComponentFixture<DeletePedidoVentaDespachoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePedidoVentaDespachoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePedidoVentaDespachoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
