import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
// import { CustomersComponent } from './customers/customers.component';
// import { ProductsComponent } from './products/products.component';
// import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


import { MastersRoutingModule } from './masters-routing.module';
import { MastersComponent } from './masters.component';
import { CRUDTableModule } from '../../../_metronic/shared/crud-table/crud-table.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { EvaluacionCrediticiaComponent } from './evaluacion-crediticia/evaluacion-crediticia.component';
import { MetasComercialesComponent } from './metas-comerciales/metas-comerciales.component';
import { SaveUpdateMetasComercialesComponent } from './metas-comerciales/save-update-metas-comerciales/save-update-metas-comerciales.component';
import { RevisionEvaluacionCrediticiaComponent } from './_shared/revision-evaluacion-crediticia/revision-evaluacion-crediticia.component';


@NgModule({
  declarations: [
    // CustomersComponent,
    // ProductsComponent,
    MastersComponent,
		EvaluacionCrediticiaComponent,
		MetasComercialesComponent,
		SaveUpdateMetasComercialesComponent,
		RevisionEvaluacionCrediticiaComponent,
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
  ],
  entryComponents: [
    RevisionEvaluacionCrediticiaComponent
  ]
})
export class MastersModule {}
