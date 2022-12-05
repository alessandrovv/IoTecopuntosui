import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
// import { CustomersComponent } from './customers/customers.component';
// import { ProductsComponent } from './products/products.component';
// import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


import { CRUDTableModule } from '../../../_metronic/shared/crud-table/crud-table.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportRoutingModule } from './report-routing.module';
import { MatTreeModule } from '@angular/material/tree';
import { ReportComponent } from './report.component';
import { SeguimientoVisitaComercialComponent } from '../report/seguimiento-visita-comercial/seguimiento-visita-comercial.component';
import { VerEvidenciaComponent } from './seguimiento-visita-comercial/ver-evidencia/ver-evidencia.component';
import { VerMapaComponent } from './seguimiento-visita-comercial/ver-mapa/ver-mapa.component';

@NgModule({
  declarations: [
    ReportComponent,
    SeguimientoVisitaComercialComponent,
    VerEvidenciaComponent,
    VerMapaComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReportRoutingModule,
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
    MatTreeModule
  ],
  entryComponents: [
  ]
})
export class ReportModule {}
