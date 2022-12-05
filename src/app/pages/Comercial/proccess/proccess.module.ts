import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
// import { CustomersComponent } from './customers/customers.component';
// import { ProductsComponent } from './products/products.component';
// import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


import { ProccessRoutingModule } from './proccess-routing.module';
import { ProccessComponent } from './proccess.component';
import { CRUDTableModule } from '../../../_metronic/shared/crud-table/crud-table.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { SeguimientoVentasComponent } from './seguimiento-ventas/seguimiento-ventas.component';
import { SaveUpdateSeguimientoVentaComponent } from './seguimiento-ventas/save-update-seguimiento-venta/save-update-seguimiento-venta.component';


@NgModule({
  declarations: [
    // CustomersComponent,
    // ProductsComponent,
    ProccessComponent,
    SeguimientoVentasComponent,
    SaveUpdateSeguimientoVentaComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ProccessRoutingModule,
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
  ],
  entryComponents: [
  ]
})
export class ProccessModule {}
