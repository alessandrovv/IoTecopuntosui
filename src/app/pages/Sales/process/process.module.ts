import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
// import { CustomersComponent } from './customers/customers.component';
// import { ProductsComponent } from './products/products.component';
// import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { CRUDTableModule } from '../../../_metronic/shared/crud-table/crud-table.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProcessComponent } from './process.component';
import { ProcessRoutingModule } from './process-routing.module';
import { MatTreeModule } from '@angular/material/tree';
import { RutasComponent } from './rutas/rutas.component';
import { SaveUpdateRutaComponent } from './rutas/save-update-ruta/save-update-ruta.component';
import { PedidoVentaComponent } from './pedido-venta/pedido-venta.component';
import { SavePedidoVentaComponent } from './pedido-venta/save-pedido-venta/save-pedido-venta.component';
import { UpdatePedidoVentaComponent } from './pedido-venta/update-pedido-venta/update-pedido-venta.component';
import { VerPedidoVentaComponent } from './pedido-venta/ver-pedido-venta/ver-pedido-venta.component';
import { CopyPedidoVentaComponent } from './pedido-venta/copy-pedido-venta/copy-pedido-venta.component';
import { AnularPedidoVentaModalComponent } from './pedido-venta/anular-pedido-venta-modal/anular-pedido-venta-modal.component';
import { CerrarPedidoVentaModalComponent } from './pedido-venta/cerrar-pedido-venta-modal/cerrar-pedido-venta-modal.component';
import { ClienteModalComponent } from './pedido-venta/cliente-modal/cliente-modal.component';
import { TasaCambioModalComponent } from './pedido-venta/tasa-cambio-modal/tasa-cambio-modal.component';
import { VerMapaComponent } from '../report/seguimiento-visita-comercial/ver-mapa/ver-mapa.component';
import { StockEcommerceComponent } from './stock-ecommerce/stock-ecommerce.component';
import { SaveUpdateStockComponent } from './stock-ecommerce/save-update-stock/save-update-stock.component';
import { PedidoVentaDespachoComponent } from './pedido-venta-despacho/pedido-venta-despacho.component';
import { VerPedidoVentaDespachoComponent } from './pedido-venta-despacho/ver-pedido-venta-despacho/ver-pedido-venta-despacho.component';


@NgModule({
  declarations: [
    ProcessComponent,
    RutasComponent,
    SaveUpdateRutaComponent,
    PedidoVentaComponent,
    SavePedidoVentaComponent,
    UpdatePedidoVentaComponent,
    VerPedidoVentaComponent,
    CopyPedidoVentaComponent,
    AnularPedidoVentaModalComponent,
    CerrarPedidoVentaModalComponent,
    ClienteModalComponent,
    TasaCambioModalComponent,
    StockEcommerceComponent,
    SaveUpdateStockComponent,
    PedidoVentaDespachoComponent,
    VerPedidoVentaDespachoComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ProcessRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTreeModule,
    NgbModule
  ],
  entryComponents: [
  ]
})
export class ProcessModule {}
