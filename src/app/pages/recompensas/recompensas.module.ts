import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecompensasRoutingModule } from './recompensas-routing.module';
import { RecompensasComponent } from './recompensas.component';
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
import { MatTreeModule } from '@angular/material/tree';
import { RecompensasListComponent } from './recompensas-list/recompensas-list.component';
import { RecompensasAddEditComponent } from './recompensas-add-edit/recompensas-add-edit.component';


@NgModule({
  declarations: [
    RecompensasComponent,
    RecompensasListComponent,
    RecompensasAddEditComponent
  ],
  imports: [
    CommonModule,
    RecompensasRoutingModule,
    HttpClientModule,
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
  ]
})
export class RecompensasModule { }
