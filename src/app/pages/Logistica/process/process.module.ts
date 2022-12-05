import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProcessRoutingModule } from "./process-routing.module";
import { ProcessComponent } from './process.component';
import { CRUDTableModule } from "../../../_metronic/shared/crud-table/crud-table.module";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSortModule } from "@angular/material/sort";
import { NgSelectModule } from "@ng-select/ng-select";
import { OrdenCompraComponent } from './orden-compra/orden-compra.component';
import { SaveOrdenCompraComponent } from './orden-compra/save-orden-compra/save-orden-compra.component';
import { EditOrdenCompraComponent } from './orden-compra/edit-orden-compra/edit-orden-compra.component';
import { CopyOrdenCompraComponent } from './orden-compra/copy-orden-compra/copy-orden-compra.component';
import { VerOrdenCompraComponent } from './orden-compra/ver-orden-compra/ver-orden-compra.component';
import { DocumentoCompraComponent } from './documento-compra/documento-compra.component';
import { SaveDocumentoCompraComponent } from './documento-compra/save-documento-compra/save-documento-compra.component';
import { EditDocumentoCompraComponent } from './documento-compra/edit-documento-compra/edit-documento-compra.component';
import { CopyDocumentoCompraComponent } from './documento-compra/copy-documento-compra/copy-documento-compra.component';
import { VerDocumentoCompraComponent } from './documento-compra/ver-documento-compra/ver-documento-compra.component';
import { NotaAlmacenComponent } from './nota-almacen/nota-almacen.component';
import { SaveNotaEntradaComponent } from './nota-almacen/save-nota-entrada/save-nota-entrada.component';
import { SaveNotaSalidaComponent } from './nota-almacen/save-nota-salida/save-nota-salida.component';
import { VerNotaSalidaComponent } from './nota-almacen/ver-nota-salida/ver-nota-salida.component';
import { VerNotaEntradaComponent } from './nota-almacen/ver-nota-entrada/ver-nota-entrada.component';
import { SaveUpdateProveedoresModalComponent } from './_shared/save-update-proveedores-modal/save-update-proveedores-modal.component';
import { AgregarTasaCambioComponent } from './_shared/agregar-tasa-cambio/agregar-tasa-cambio.component';
import { AgregarMaterialComponent } from './_shared/agregar-material/agregar-material.component';
import { AnularOrdenCompraModalComponent } from './orden-compra/anular-orden-compra-modal/anular-orden-compra-modal.component';
import { CerrarOrdenCompraModalComponent } from './orden-compra/cerrar-orden-compra-modal/cerrar-orden-compra-modal.component';
import { AgregarMaterialEntradaComponent } from './nota-almacen/save-nota-entrada/agregar-material-entrada/agregar-material-entrada.component';
import { EditMaterialEntradaComponent } from './nota-almacen/save-nota-entrada/edit-material-entrada/edit-material-entrada.component';
import { EditMaterialSalidaComponent } from './nota-almacen/save-nota-salida/edit-material-salida/edit-material-salida.component';
import { AgregarMaterialSalidaComponent } from './nota-almacen/save-nota-salida/agregar-material-salida/agregar-material-salida.component';
//import { OrdenCompraVistaComponent } from './nota-almacen/save-nota-entrada/orden-compra-vista/orden-compra-vista.component';
import { VistaPedidoVentaComponent } from './nota-almacen/save-nota-salida/vista-pedido-venta/vista-pedido-venta.component';
import { VistaOrdenCompraComponent } from './nota-almacen/save-nota-entrada/vista-orden-compra/vista-orden-compra.component';
import { VistaOrdenCompraVerComponent } from './nota-almacen/ver-nota-entrada/vista-orden-compra-ver/vista-orden-compra-ver.component';
import { VistaPedidoVentaVerComponent } from './nota-almacen/ver-nota-salida/vista-pedido-venta-ver/vista-pedido-venta-ver.component';


@NgModule({
  declarations: [
    ProcessComponent,
    OrdenCompraComponent,
    SaveOrdenCompraComponent,
    EditOrdenCompraComponent,
    CopyOrdenCompraComponent,
    VerOrdenCompraComponent,
    DocumentoCompraComponent,
    SaveDocumentoCompraComponent,
    EditDocumentoCompraComponent,
    CopyDocumentoCompraComponent,
    VerDocumentoCompraComponent,
    NotaAlmacenComponent,
    SaveNotaEntradaComponent,
    SaveNotaSalidaComponent,
    VerNotaSalidaComponent,
    VerNotaEntradaComponent,
    SaveUpdateProveedoresModalComponent,
    AgregarTasaCambioComponent,
    AgregarMaterialComponent,
    AnularOrdenCompraModalComponent,
    CerrarOrdenCompraModalComponent,
    AgregarMaterialEntradaComponent,
    EditMaterialEntradaComponent,
    EditMaterialSalidaComponent,
    AgregarMaterialSalidaComponent,
    //OrdenCompraVistaComponent,
    VistaPedidoVentaComponent,
    VistaOrdenCompraComponent,
    VistaOrdenCompraVerComponent,
    VistaPedidoVentaVerComponent,
  ],
  imports: [
    CommonModule,
    ProcessRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
    NgbModalModule,
    NgbModule,
    NgbDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  entryComponents: [],
})
export class ProcessModule {}
