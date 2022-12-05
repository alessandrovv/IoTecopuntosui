import { SpinnerInterceptor } from './../../../Shared/interceptors/spinner.interceptors';
import { SpinnerModule } from './../../../Shared/components/spinner/spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


import { CRUDTableModule } from '../../../_metronic/shared/crud-table/crud-table.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';

import { ReporteComprasComponent } from './reporte-compras/reporte-compras.component';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { MatTreeModule } from '@angular/material/tree';
import { ReporteStockComponent } from './reporte-stock/reporte-stock.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { truncate } from 'fs/promises';
import { ReporteMovimientosComponent } from './reporte-movimientos/reporte-movimientos.component';
import { ReporteVentasComponent } from './reporte-ventas/reporte-ventas.component';


@NgModule({
    declarations: [
      ReporteComprasComponent,
      ReportsComponent,
      ReporteStockComponent,
      ReporteMovimientosComponent,
      ReporteVentasComponent
    ],
    imports: [
      CommonModule,
      HttpClientModule,
      ReportsRoutingModule,
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
      SpinnerModule
    ],providers: [
      {provide: HTTP_INTERCEPTORS, useClass : SpinnerInterceptor, multi:true}
    ],
    entryComponents: [
    ]
  })
  export class ReportsModule {}