import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MastersRoutingModule } from './report-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { ReportComponent } from './report.component';
import { ReporteVencimientoComponent } from './reporte-vencimiento/reporte-vencimiento.component';
import {MatDividerModule} from '@angular/material/divider'; 


@NgModule({
  declarations: [
    ReportComponent,
    ReporteVencimientoComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MastersRoutingModule,
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
    MatDividerModule,
  ],
  entryComponents: [
    // DeleteCustomersModalComponent,
    // UpdateCustomersStatusModalComponent,
    // FetchCustomersModalComponent,
    // EditCustomerModalComponent,
    // DeleteProductModalComponent,
    // DeleteProductsModalComponent,
    // UpdateProductsStatusModalComponent,
    // FetchProductsModalComponent,
    // DeleteRemarkModalComponent,
    // DeleteRemarksModalComponent,
    // FetchRemarksModalComponent,
    // DeleteSpecModalComponent,
    // DeleteSpecsModalComponent,
    // FetchSpecsModalComponent,
    // EditRemarkModalComponent,
    // EditSpecModalComponent
  ]
})
export class ReportModule { }
